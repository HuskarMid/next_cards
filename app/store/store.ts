import { configureStore } from "@reduxjs/toolkit";
import { productsApi } from "./products/products";
import { TypedUseSelectorHook, useDispatch as useDispatchBase, useSelector as useSelectorBase, useStore as useStoreBase } from "react-redux";
import productsReducer from "./products/productsSlice";

export const store = configureStore({
    reducer: {
        [productsApi.reducerPath]: productsApi.reducer,
        products: productsReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(productsApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// Типизированные хуки
export const useDispatch = () => useDispatchBase<AppDispatch>();
export const useSelector: TypedUseSelectorHook<RootState> = useSelectorBase;
export const useStore = () => useStoreBase<RootState>();


