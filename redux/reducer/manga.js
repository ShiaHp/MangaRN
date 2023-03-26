import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

import { storeData, getData } from "../../features/asyncStorage";

const url = 'http://192.168.1.8:3033/'

const initialState = {
    tag : null,
    manga : null,
  }
export const mangaSlice = createSlice({
    name : 'manga',
    initialState,

    reducers :{
        setTags : (state,action)=>{
            state.tag = action.payload
        },
    }
})

export const {setTags} = mangaSlice.actions


export default mangaSlice.reducer