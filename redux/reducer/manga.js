import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

import { storeData, getData } from "../../features/asyncStorage";

const url = 'http://localhost:3032/'

const initialState = {
    tag : null,
    manga : null,
    listManga: null,
    detailManga: null,
    listChapter: null,
  }
export const mangaSlice = createSlice({
    name : 'manga',
    initialState,

    reducers :{
        setTags : (state,action)=>{
            state.tag = action.payload
        },
        setOneManga: (state,action) => {
            state.manga = action.payload
            console.log(state.manga)
        },

     
    }
})

export const {setTags,setOneManga} = mangaSlice.actions

export const randomManga = (payload) => (dispatch) => {
    axios({
        method: 'GET',
        url:`${url}api/v1/manga/random`,
    }).then((res) => {
        dispatch(setOneManga(res.data.data));
       
    })
}

export const listChapter = (payload) => (dispatch) => {
    axios({
        method: 'GET',
        url: `${url}`
    })
}
export default mangaSlice.reducer
