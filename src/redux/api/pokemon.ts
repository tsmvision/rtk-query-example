import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

interface Pokemon {
    name: string;
}

// Define a service using a base URL and expected endpoints
export const pokemonApi = createApi({
    reducerPath: 'pokemonApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'https://pokeapi.co/api/v2/' }),
    endpoints: (builder) => ({
        getPokemonByName: builder.query<Pokemon, string>({
            query: (name) => `pokemon/${name}`,
        }),
        getTest: builder.query<Pokemon, void>({
            // The query is not relevant here, so a `null` returning `queryFn` is used
            queryFn: async () => {
                return {
                    data: {name: ''}
                };
            },
            async onCacheEntryAdded(
                _,
                { cacheDataLoaded, updateCachedData, cacheEntryRemoved }
            ){
                await cacheDataLoaded;
                // listen
                updateCachedData((draft) => {
                    draft.name = 'Merong';
                });

                await cacheEntryRemoved;
                //
            }

            // This mutation takes advantage of tag invalidation behaviour to trigger
            // any queries that provide the 'Post' or 'User' tags to re-fetch if the queries
            // are currently subscribed to the cached data
        }),
    }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetPokemonByNameQuery, useGetTestQuery } = pokemonApi
