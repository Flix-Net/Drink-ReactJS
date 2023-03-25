import { configureStore } from '@reduxjs/toolkit'
import productReduces from "./Slice/productsSlice";
import rawMaterialReducer from "./Slice/rawMaterialSlice";

export const store = configureStore({
    reducer: {
        productReduces,
        rawMaterialReducer
    },
})