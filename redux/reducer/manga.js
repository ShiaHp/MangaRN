import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";


const url = 'http://192.168.1.8:3032'
const url = 'http://localhost:3032/'

const initialState = {
    tag : null,
    manga : [],
    offset : 0,
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
