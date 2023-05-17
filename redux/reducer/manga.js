import { createSlice, current } from "@reduxjs/toolkit";
import axios from "axios";
import json from '../../example.json'
import { storeData } from "../../features/asyncStorage";
import { getData } from "../../features/asyncStorage";
// export const url = 'http://192.168.1.15:3032'
export const url = 'http://localhost:3032'
// export const url = 'http://192.168.23.48:3032'

const initialState = {
    manga: [],
    tags: {
        format: [],
        genre: [],
        theme: [],
    },
    offset: 0,
    readList: {},
    listManga: null,
    detailManga: null,
    detailMangaCover: null,
    listChapter: null,
    selectedTags: [],
    searchResult: null
}
export const mangaSlice = createSlice({
    name: 'manga',
    initialState,
    reducers: {
        setSelectedTags: (state, action) => {
            const { key, tag } = action.payload
            const indx = state.selectedTags.indexOf(tag)
            if (indx !== -1)
                state.selectedTags.splice(indx, 1)
            else
                state.selectedTags = [...state.selectedTags, tag]
        },
        setDetailManga: (state, action) => {
            state.detailManga = action.payload
        },
        setSearchResult: (state, action) =>{
            state.searchResult = action.payload
        },
        setManga: (state, action) => {
            state.manga = state.manga.concat(action.payload)
        },
        setListChapter: (state, action) => {
            let { id, result } = action.payload
            result.data = result.data.map(item => {
                if (state.readList && state.readList[id] && state.readList[id]?.list.includes(item.id))
                    return { ...item, hasRead: true }
                else
                    return { ...item, hasRead: false }
            })
            state.listChapter = result
        },
        setReadListChapter: (state, action) => {
            let chapterId = action.payload
            let r = state.listChapter.data.map((item) => {
                let i = { ...item }
                if (item.id === chapterId) {
                    i.hasRead = true
                    return i
                }
                return item
            })
            state.listChapter.data = r
        },
        setReadList: (state, action) => {
            state.readList = action.payload
        },
        setSearchResult : (state, action) =>{
            state.searchResult = action.payload
        },
        setTags :(state, action) =>{
            state.tags = action.payload
        }
    }
})
export const { setManga, setDetailManga, setListChapter, setReadList, setReadListChapter, setSelectedTags, setTags, setSearchResult } = mangaSlice.actions

export const storeReadList = (mangaId, chapterId, chapter) => (dispatch, getState) => {
    const state = getState();
    let readList = { ...state.manga.readList }; // Create a shallow copy of the readList object

    if (readList[mangaId]) {
        readList[mangaId] = {
            ...readList[mangaId],
            list: [...readList[mangaId].list, chapterId]
        };
    } else {
        readList[mangaId] = {
            list: [chapterId]
        };
    }
    console.log(readList);
    dispatch(setReadList(readList));
    storeData('readList', readList);
};

export const getReadListFromStore = () => (dispatch) => {
    getData('readList')
        .then((value) => {
            dispatch(setReadList(value))
        })
}

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



// export const randomManga = (payload) => (dispatch) => {
//     axios({
//         method: 'GET',
//         url:`${url}api/v1/manga/random`,
//     }).then((res) => {
//         dispatch(setOneManga(res.data.data));

//     })
// }

export const getTags = ()=>(dispatch) =>{
    axios({
        url : 'https://api.mangadex.org/manga/tag',
        method:'GET',
    }).then(({data})=>{
        let temp = {
            format: [],
            genre: [],
            theme: [],
        }
        data.data.forEach((item)=>{
            // console.log(temp[item.attributes.group]);
            if(temp[item.attributes.group])
                temp[item.attributes.group].push({id: item.id, name : item.attributes.name.en})
        })
        dispatch(setTags(temp))
    })
    .catch((err)=>{
        console.log('tags:',err);
    })
}

export const getMangaByQuery = (query)=> (dispatch, getState) =>{
    const state = getState()
    const {selectedTags} = state.manga
    // console.log(selectedTags);
    axios({
        url: `https://api.mangadex.org/manga`,
        method: 'GET',
        params: {
            limit: 50,
            // offset: offset * 20,
            includes: ["cover_art","author"],
            title : query,
            includedTags : selectedTags,
            contentRating : ['safe']

        }
    })
        .then(({data}) => {
            const mangaList = data.data
            var cover = null
            var author = null
            mangaList.forEach((element, index) => {
                cover = element.relationships.filter(item => item.type === "cover_art")[0]
                author = element.relationships.filter(item => item.type === "author")[0]
                mangaList[index].cover = cover
                mangaList[index].author = author
            });
            console.log(mangaList);
            dispatch(setSearchResult(mangaList))
        })
        .catch((err) => {
            console.log('Get manga error', err);
        })
}

export const listChapter = (id, page) => (dispatch) => {
    axios({
        method: 'GET',
        url: `${url}/api/v1/manga/chapter/list/${id}`,
        params: {
            order: {
                chapter: 'desc',
                volume: 'desc',
            },
            offset: (page - 1) * 30,
            limit : 30,
            includes : ['scanlation_group']
        }
    })
        .then(({data}) => {
            const result = data.data
            var trans = null
            result.data.forEach((element, index) => {
                trans = element.relationships.filter(item => item.type === "scanlation_group")[0]
                result.data[index].trans = trans
            });
            dispatch(setListChapter({ id, result }))
        })
        .catch((err) => {
            console.log(err);
        })
}

export const getDetailManga = (payload) => (dispatch) => {
    dispatch(listChapter(payload, 1))
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
