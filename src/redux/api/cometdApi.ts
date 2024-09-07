import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {cometd} from "../../utility/cometd-utility.ts";
import {Message} from "cometd";
import {updateIsConnected, updateIsHandshaked} from "../reducers/cometdConnectionStatusSlice.ts";

export const cometdApi = createApi({
    baseQuery: fetchBaseQuery({ baseUrl: '/' }),
    endpoints: (build) => ({
        getMetaConnect: build.query<string, void>({
            queryFn: () => {
                return {data: 'no_value'};
            },
            async onCacheEntryAdded(
                _,
                { cacheDataLoaded, cacheEntryRemoved, dispatch }
            ) {
                // create a websocket connection when the cache subscription starts
                let listener;
                let handshakeListener;

                try {
                    // wait for the initial query to resolve before proceeding
                    await cacheDataLoaded

                    listener = cometd.addListener('/meta/connect', (message: Message) => {
                        if (message.successful) {
                            dispatch(updateIsConnected(true));

                            handshakeListener = cometd.addListener('/meta/handshake', (message) => {
                                if (message.successful) {
                                    dispatch(updateIsHandshaked(true));
                                }
                                else {
                                    dispatch(updateIsHandshaked(false));
                                    cometd.handshake((message) => {
                                        if (message.successful) {
                                            dispatch(updateIsHandshaked(true));
                                        } else {
                                            dispatch(updateIsHandshaked(false));
                                        }
                                    });
                                }
                            });
                        }
                        else {
                            dispatch(updateIsConnected(false));
                        }
                    });
                } catch {
                    // no-op in case `cacheEntryRemoved` resolves before `cacheDataLoaded`,
                    // in which case `cacheDataLoaded` will throw
                };
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
})

export const { useGetMetaConnectQuery } = cometdApi
