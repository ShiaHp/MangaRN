import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";


export const url = 'http://192.168.1.12:3032'
// const url = 'http://localhost:3032'

const initialState = {
    tag: null,
    manga: [],
    offset: 0,
    manga: [],
    listManga: null,
    detailManga: null,
    detailMangaCover: null,
    listChapter: null,
}
export const mangaSlice = createSlice({
    name: 'manga',
    initialState,
    reducers: {
        setTags: (state, action) => {
            state.tag = action.payload
        },
        setDetailManga: (state, action) => {
            state.detailManga = action.payload
        },
        setManga: (state, action) => {
            state.manga = state.manga.concat(action.payload)
        },
        setListChapter: (state, action)=>{
            state.listChapter = action.payload
        }
    }
})

export const getLatestMangas = (offset) => (dispatch) => {
    axios({
        url: `${url}/api/v1/manga`,
        method: 'GET',
        params: {
            limit: 20,
            offset: offset * 20,
            includes: ["cover_art"]
        }
    })
        .then((payload) => {
            const mangaList = payload.data.data.data
            var cover = null
            mangaList.forEach((element, index) => {
                cover = element.relationships.filter(item => item.type === "cover_art")[0]
                mangaList[index].cover = cover
            });
            dispatch(setManga(mangaList))
        })
        .catch((err) => {
            console.log('Get manga error', err);
        })
}


export const { setTags, setManga, setDetailManga, setListChapter } = mangaSlice.actions

// export const randomManga = (payload) => (dispatch) => {
//     axios({
//         method: 'GET',
//         url:`${url}api/v1/manga/random`,
//     }).then((res) => {
//         dispatch(setOneManga(res.data.data));

//     })
// }

export const listChapter = (id,page) => (dispatch) => {
    axios({
        method: 'GET',
        url: `${url}/api/v1/manga/chapter/list/${id}`,
        params: {
            order: {
                chapter: 'desc',
                volume: 'desc',
            },
            offset : (page-1)*100,
        }
    })
        .then((res) => {
            dispatch(setListChapter(res.data.data))
        })
        .catch((err) => {
            console.log(err);
        })
}

export const getDetailManga = (payload) => (dispatch) => {
    dispatch(listChapter(payload,1))
    axios({
        method: "GET",
        url: `${url}/api/v1/manga/${payload}`,
        params: {
            includes: ['cover_art', 'author']
        }
    })
        .then((res) => {
            let cover = '';
            let author = '';
            let result = res.data.data.data;
            cover = result.relationships.filter(item => item.type === "cover_art")[0]
            author = result.relationships.filter(item => item.type === "author")[0]
            result.cover = cover;
            result.author = author;
            dispatch(setDetailManga(result))

        })
        .catch((err) => {
            console.log(err);
        })
}

export default mangaSlice.reducer
