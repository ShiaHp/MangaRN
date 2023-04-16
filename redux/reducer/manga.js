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
            limit : 20,
            offset : offset*20,
            includes : ["cover_art"]
        }
    })
    .then((payload)=>{
        const mangaList = payload.data.data.data
        var cover = null
        mangaList.forEach((element,index) => {
            cover = element.relationships.filter(item => item.type === "cover_art")[0]
            mangaList[index].cover = cover
        });
        dispatch(setManga(mangaList))
    })
    .catch((err)=>{
        console.log('Get manga error',err);
    })
}


export const {setTags,setManga} = mangaSlice.actions


export default mangaSlice.reducer