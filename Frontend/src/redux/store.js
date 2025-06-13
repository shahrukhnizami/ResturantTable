import { configureStore } from "@reduxjs/toolkit";
import { commonApi } from "./api/commonApi";
import { useDispatch } from "react-redux";

export const store = configureStore({
    reducer: {
        [commonApi.reducerPath]: commonApi.reducer,
    },
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware().concat(commonApi.middleware),
});

export const useAppDispatch = () => useDispatch();
