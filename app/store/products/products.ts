import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import { IProduct } from "./productTypes";

export const productsApi = createApi({
    reducerPath: "productsApi",
    baseQuery: fetchBaseQuery({ baseUrl: "https://fakestoreapi.com" }),
    endpoints: build => ({
        getProducts: build.query<IProduct[], number>({
            query: (limit = 10) => `products?limit=${limit}`,
        }),
    }),
})

export const { useGetProductsQuery } = productsApi;
