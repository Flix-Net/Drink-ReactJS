import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "../../Utils/Axios";

const initialState = {
    status:null,
    arrProducts : []
}


export const getAllProducts = createAsyncThunk("/api/getAllProducts", async ()=>{
    const {data} = await axios.get("/api/getAllProducts");
    return data;
});




export const productsSlice = createSlice({
    name:"products",
    initialState,
    reducers:{  },
    extraReducers:{


        [getAllProducts.pending]: (state, action) => {
            state.status = "loading"
        },
        [getAllProducts.fulfilled]: (state, action) => {
            state.status = "Success"
            state.arrProducts = action.payload;
        },
        [getAllProducts.rejected]: (state, action) => {
            state.status = "Fail"
        },





    }
})



export default productsSlice.reducer;