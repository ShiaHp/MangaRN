import { createSlice, current } from "@reduxjs/toolkit";
import axios from "axios";
import json from '../../example.json'
import { storeData } from "../../features/asyncStorage";
import { getData } from "../../features/asyncStorage";
import { urlAuth } from './user'
// export const urlManga = 'http://192.168.1.5:3032'
export const urlManga = 'http://localhost:3032'
// export const urlManga = 'http://10.60.12.188:3032'

const initialState = {
    manga: [],
    tags: {
        format: [],
        genre: [],
        theme: [],
    },
    offset: 0,
    readList: [],
    listManga: null,
    detailManga: null,
    detailMangaCover: null,
    listChapter: null,
    selectedTags: [],
    searchResult: null,
    detailFirstChapter: null,
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
        setSearchResult: (state, action) => {
            state.searchResult = action.payload
        },
        setManga: (state, action) => {
            state.manga = state.manga.concat(action.payload)
        },
        setListChapter: (state, action) => {
            let { id, result } = action.payload
            let mangaIdx = state.readList?.findIndex((item) => item.mangaId === id)
            console.log(current(state.readList));
            result.data = result.data.map(item => {
                if (state.readList[mangaIdx] && state.readList[mangaIdx]?.chapterId.includes(item.id))
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
        setSearchResult: (state, action) => {
            state.searchResult = action.payload
        },
        setTags: (state, action) => {
            state.tags = action.payload
        },
        detailFirstChapter: (state, action) => {
            state.detailFirstChapter = action.payload
        }
    }
})
export const { setManga, setDetailManga, setListChapter, setReadList, setReadListChapter, setSelectedTags, setTags, setSearchResult, detailFirstChapter } = mangaSlice.actions

export const storeReadList = (mangaId, chapterId, chapter, title) => (dispatch, getState) => {
    const state = getState();
    axios({
        method: 'PUT',
        url: `${urlAuth}api/v1/users/reading-history/${state.user.value.id}`,
        data: {
            mangaTitle: title,
            mangaId,
            lastChapter: chapter,
            lastPage: 1,
            lastTimeRead: Date.now(),
            chapterId
        }
    })
        .then(({ data }) => {
            console.log(data);
        })
    let readList = [...state.manga.readList]; // Create a shallow copy of the readList object
    let mangaIdx = readList.findIndex((item) => item.mangaId === mangaId)
    if (mangaIdx !== -1) {
        readList[mangaIdx] = {
            ...readList[mangaIdx],
            chapterId: [...readList[mangaIdx].chapterId, chapterId],
            lastChapter: chapter,
            mangaTitle: title,
            lastTimeRead: Date.now(),
        };
    } else {
        readList.push({
            mangaId,
            chapterId: [chapterId],
            lastReadChapter: chapter,
            lastTimeRead: Date.now(),
        })
    }
    // console.log(readList);
    dispatch(setReadList(readList));
    storeData('readList', readList);
};

export const getReadListFromStore = () => async (dispatch, getState) => {
    const state = getState()

    let sData = await getData('readList')
    let fetch = await axios({
        method: "GET",
        url: `${urlAuth}api/v1/users/reading-history/${state.user.value.id}`,
    })
    if (sData) {
        let result = fetch.data.concat(sData)
        dispatch(setReadList(result))
    } else {
        dispatch(setReadList(fetch.data))
    }
}

export const deleteReadListById = (id) => async (dispatch, getState) => {

    const state = getState();

    axios({
        method: "PATCH",
        url: `${urlAuth}api/v1/users/reading-history/${state.user.value.id}`,
        data: {
            mangaId: id
        }
    })
    .then(({data})=>{
        console.log(data);
    })
    .catch((err)=>{
        console.log(err);
    })

    let readList = [...state.manga.readList];
    let mangaIdx = readList.findIndex((item) => item.mangaId === id)
    delete readList[mangaIdx]
    dispatch(setReadList(readList))
    storeData('readList', readList);

}

export const getLatestMangas = (offset) => (dispatch) => {
    axios({
        url: `${urlManga}/api/v1/manga`,
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

export const getPopularMangas = (offset) => (dispatch) => {
    axios({
        url: `${urlManga}/api/v1/manga`,
        method: 'GET',
        params: {
            limit: 10,
            // offset: offset * 20,
            includes: ["cover_art"],
            'order[followedCount]': "desc",
            hasAvailableChapters: true
        }
    })
        .then(({data}) => {
            const mangaList = data.data.data
            mangaList.forEach((element, index) => {
                let cover = element.relationships.filter(item => item.type === "cover_art")[0]
                mangaList[index].cover = cover
            });
            dispatch(setManga(mangaList))
        })
        .catch((err) => {
            console.log('Get manga error', err);
        })
}
export const getRecommendedMangas = (offset) => (dispatch) => {
    axios({
        url: `${urlManga}/api/v1/manga`,
        method: 'GET',
        params: {
            limit: 10,
            // offset: offset * 20,
            includes: ["cover_art"],
            'order[createdAt]': "desc",
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
//         url:`${urlManga}api/v1/manga/random`,
//     }).then((res) => {
//         dispatch(setOneManga(res.data.data));

//     })
// }

export const getTags = () => (dispatch) => {
    axios({
        url: 'https://api.mangadex.org/manga/tag',
        method: 'GET',
    }).then(({ data }) => {
        let temp = {
            format: [],
            genre: [],
            theme: [],
        }
        data.data.forEach((item) => {
            // console.log(temp[item.attributes.group]);
            if (temp[item.attributes.group])
                temp[item.attributes.group].push({ id: item.id, name: item.attributes.name.en })
        })
        dispatch(setTags(temp))
    })
        .catch((err) => {
            console.log('tags:', err);
        })
}

export const getMangaByQuery = (query) => (dispatch, getState) => {
    const state = getState()
    const { selectedTags } = state.manga
    // console.log(selectedTags);
    axios({
        url: `https://api.mangadex.org/manga`,
        method: 'GET',
        params: {
            limit: 50,
            // offset: offset * 20,
            includes: ["cover_art", "author"],
            title: query,
            includedTags: selectedTags,
            contentRating: ['safe']

        }
    })
        .then(({ data }) => {
            const mangaList = data.data
            var cover = null
            var author = null
            mangaList.forEach((element, index) => {
                cover = element.relationships.filter(item => item.type === "cover_art")[0]
                author = element.relationships.filter(item => item.type === "author")[0]
                mangaList[index].cover = cover
                mangaList[index].author = author
            });
            dispatch(setSearchResult(mangaList))
        })
        .catch((err) => {
            console.log('Get manga error', err);
        })
}

export const listChapter = (id, page) => (dispatch) => {
    // console.log(`${url}/api/v1/manga/chapter/list/${id}`);
    axios({
        method: 'GET',
        url: `${urlManga}/api/v1/manga/chapter/list/${id}`,
        params: {
            order: {
                chapter: 'desc',
                volume: 'desc',
            },
            offset: (page - 1) * 30,
            limit: 30,
            includes: ['scanlation_group']
        }
    })
        .then(({ data }) => {
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
        url: `${urlManga}/api/v1/manga/${payload}`,
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

export const getDetailFirstChapter = (idManga) => (dispatch) => {
    axios({
        method: "GET",
        url: `${urlManga}/api/v1/manga/chapter/start/${idManga}`,
    }).then((res) => {
        dispatch(detailFirstChapter(res.data.data))
    }).catch((err) => {
        console.log(err);
    });

}

export default mangaSlice.reducer
