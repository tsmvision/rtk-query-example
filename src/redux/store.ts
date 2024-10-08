import { configureStore } from '@reduxjs/toolkit'
import {counterSlice} from "./reducers/counterSlice.ts";
import {pokemonApi} from "./api/pokemon.ts";
import {cometdConnectionStatusSlice} from "./reducers/cometdConnectionStatusSlice.ts";

export const store = configureStore({
    reducer: {
        [pokemonApi.reducerPath]: pokemonApi.reducer,
        counter: counterSlice.reducer,
        cometdConnectionStatus: cometdConnectionStatusSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(pokemonApi.middleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
