import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {cometd} from "../../utility/cometd-utility.ts";
import {Message} from "cometd";

export interface CometdConnectionStatus {
    isConnected: boolean,
    isHandshaked: boolean,
}

export const cometdApi = createApi({
    baseQuery: fetchBaseQuery({ baseUrl: '/' }),
    endpoints: (build) => ({
        getMetaConnect: build.query<CometdConnectionStatus, void>({
            queryFn: () => {
                return {data: {
                    isConnected: false, isHandshaked: false,
                    }
                };
            },
            async onCacheEntryAdded(
                _,
                { updateCachedData, cacheDataLoaded, cacheEntryRemoved, dispatch }
            ) {
                // create a websocket connection when the cache subscription starts
                let listener;
                let handshakeListener;

                try {
                    // wait for the initial query to resolve before proceeding
                    await cacheDataLoaded;

                    listener = cometd.addListener('/meta/connect', (message: Message) => {
                        if (message.successful) {
                            handshakeListener = cometd.addListener('/meta/handshake', (message) => {
                                if (message.successful) {
                                    updateCachedData((draft) => {
                                        draft.isConnected = true;
                                        draft.isHandshaked = true;
                                    });
                                }
                                else {
                                    updateCachedData((draft) => {
                                        draft.isConnected = true;
                                        draft.isConnected = false;
                                    });

                                    cometd.handshake((message) => {
                                        if (message.successful) {
                                            updateCachedData((draft) => {
                                                draft.isConnected = true;
                                                draft.isHandshaked = true;
                                            });
                                        } else {
                                            updateCachedData((draft) => {
                                                draft.isConnected = true;
                                                draft.isHandshaked = false;
                                            });
                                        }
                                    });
                                }
                            });
                        }
                        else {
                            updateCachedData((draft) => {
                                draft.isConnected = false;
                                draft.isHandshaked = false;
                            });
                        }
                    });
                } catch(e) {
                    console.log(e);
                    updateCachedData((draft) => {
                        draft.isConnected = false;
                        draft.isHandshaked = false;
                    });
                    // no-op in case `cacheEntryRemoved` resolves before `cacheDataLoaded`,
                    // in which case `cacheDataLoaded` will throw
                }
                // cacheEntryRemoved will resolve when the cache subscription is no longer active
                await cacheEntryRemoved
                // perform cleanup steps once the `cacheEntryRemoved` promise resolves
                if (listener) {
                    cometd.removeListener(listener);
                }
                if (handshakeListener) {
                    cometd.removeListener(handshakeListener);
                }
            },
        }),
    }),
});

export const { useGetMetaConnectQuery } = cometdApi
