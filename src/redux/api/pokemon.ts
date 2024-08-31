import {BaseQueryFn, createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'

interface Pokemon {
    name: string;
}

// interface Data {
//     completed: boolean,
//     id: number,
//     title: string,
//     userId: number,
// }
const baseQuery1 = fetchBaseQuery({ baseUrl: 'https://api.example1.com' });
const baseQuery2 = fetchBaseQuery({ baseUrl: 'https://api.example2.com' });

const baseQuery: BaseQueryFn = async (args, api, extraOptions) => {
    // Determine which baseQuery to use based on the endpoint

    if (args.url.include('/api1')) {
        return baseQuery2(args, api, extraOptions);
    }
    // Default baseQuery if none match
    return baseQuery1(args, api, extraOptions);
}

// Define a service using a base URL and expected endpoints
export const pokemonApi = createApi({
    reducerPath: 'pokemonApi',
    baseQuery: baseQuery,
    endpoints: (builder) => ({
        getPokemonByName: builder.query<Pokemon, string>({
            query: (name) => `pokemon/${name}`,
        }),
        getTest: builder.query<Pokemon, string>({
            // The query is not relevant here, so a `null` returning `queryFn` is used
            queryFn: async (channel) => {
                return {
                    channel,
                    data: {name: ''}
                };
            },
            async onCacheEntryAdded(
                channel,
                { cacheDataLoaded, updateCachedData, cacheEntryRemoved }
            ){
                await cacheDataLoaded;
                console.log(channel)
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
        getTest2: builder.query<string, void>({
            // The query is not relevant here, so a `null` returning `queryFn` is used
            query: () => '/api2',


            // This mutation takes advantage of tag invalidation behaviour to trigger
            // any queries that provide the 'Post' or 'User' tags to re-fetch if the queries
            // are currently subscribed to the cached data
        }),
    }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
    useGetPokemonByNameQuery,
    useGetTestQuery,
    // useGetTest2Query,
} = pokemonApi
