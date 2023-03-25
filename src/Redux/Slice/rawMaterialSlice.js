import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "../../Utils/Axios";

const initialState = {
    status:null,
    arrRawMaterials : []
}


export const getRawMaterials = createAsyncThunk("/api/getRawMaterials", async ()=>{
    const {data} = await axios.get("/api/getRawMaterials");
    return data;
});




export const rawMaterialSlice = createSlice({
    name:"rawMaterials",
    initialState,
    reducers:{  },
    extraReducers:{
        [getRawMaterials.pending]: (state, action) => {
            state.status = "loading"
        },
        [getRawMaterials.fulfilled]: (state, action) => {
            state.status = "Success"
            state.arrRawMaterials = action.payload;
        },
        [getRawMaterials.rejected]: (state, action) => {
            state.status = "Fail"
        },
    }
})



export default rawMaterialSlice.reducer;