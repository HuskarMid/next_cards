import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import { IProduct } from "./productTypes";

export const productsApi = createApi({
    reducerPath: "api/products",
    baseQuery: fetchBaseQuery({baseUrl: "/api/"}),
    endpoints: build => ({
        getProducts: build.query<IProduct[], number>({
            query: (limit = 10) => `products?limit=${limit}`,
        }),
    }),
})

export const { useGetProductsQuery } = productsApi;
