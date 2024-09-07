import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface CometdConnectionStatus {
    isConnected: boolean,
    isHandshaked: boolean,
}

const initialState: CometdConnectionStatus = {
   isConnected: false,
    isHandshaked: false,
}

export const cometdConnectionStatusSlice = createSlice({
    name: 'cometDConnectionStatus',
    initialState,
    reducers: {
        updateIsConnected: (draft, action: PayloadAction<boolean>) => {
            if (action.payload) {
                draft.isConnected = action.payload;
            } else {
                draft.isConnected = action.payload;
                draft.isHandshaked = action.payload;
            }
        },
        updateIsHandshaked: (draft, action: PayloadAction<boolean>) => {
            draft.isConnected = action.payload;
            draft.isHandshaked = action.payload;
        },
    },
});

export const { updateIsConnected, updateIsHandshaked } = cometdConnectionStatusSlice.actions

