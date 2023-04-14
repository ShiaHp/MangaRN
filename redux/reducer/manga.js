import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";


const url = 'http://192.168.1.8:3032'

const initialState = {
    tag : null,
    manga : [],
    offset : 0,
  }
export const mangaSlice = createSlice({
    name : 'manga',
    initialState,
    reducers :{
        setTags : (state,action)=>{
            state.tag = action.payload
        },
        setManga : (state,action)=>{
            state.manga = state.manga.concat(action.payload)
        }
    }
})

export const getLatestMangas = (offset)=>(dispatch)=>{
    axios({
        url : `${url}/api/v1/manga`,
        method : 'GET',
        params : {
            limit : 10,
            offset : offset*10
        }
    })
    .then((payload)=>{
        dispatch(setManga(payload.data.data.data))
    })
    .catch((err)=>{
        console.log('Get manga error',err);
    })
}


export const {setTags,setManga} = mangaSlice.actions


export default mangaSlice.reducer