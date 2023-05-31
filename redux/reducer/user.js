import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { setReadList } from "./manga";
import { storeData, getData } from "../../features/asyncStorage";

// export const urlAuth = 'http://10.60.12.188:3033/'
export const urlAuth = 'http://localhost:3033/'

const initialState = {
    value: null
}
export const userSlice = createSlice({
    name: 'user',
    initialState,

    reducers: {
        changeUser: (state, action) => {
            state.value = action.payload
            storeData('user', state.value)
        },
        logOut: (state, action) => {
            state.value = null,
                storeData('user', null)
        }
    }
})

export const { changeUser, logOut } = userSlice.actions

export const getUserFromAsyncStore = () => (dispatch) => {
    getData('user')
        .then((value) => {
            dispatch(changeUser(value))
        })
}

export const login = (payload) => (dispatch) => {
    axios({
        method: "POST",
        url: `${urlAuth}api/v1/users/login`,
        data: {
            email: payload.email,
            password: payload.password,
        }
    })
        .then((data) => {
            dispatch(changeUser(data.data.user))

        })
        .catch((err) => {
            console.log(err);
        })
}
export const register = (payload) => (dispatch) => {
    axios({
        method: "POST",
        url: `${urlAuth}api/v1/users/register`,
        data: {
            email: payload.email,
            password: payload.password,
        }
    })
        .then(({ data }) => {
            console.log(data);
            dispatch(changeUser(data.user))
        })
        .catch((err) => {
            console.log(err);
        })
}
export const updateHistory = (payload) => (dispatch, getState) => {
    const state = getState()
    const userId = state.user.id
    const { mangaTitle, lastChapter, lastPage, mangaId, lastTimeRead, chapterId } = payload
    axios({
        method: "PUT",
        url: `${urlAuth}api/v1/users/reading-history`,
        params: {
            userId
        },
        data: {
            mangaTitle,
            lastChapter,
            lastPage,
            mangaId,
            lastTimeRead,
            chapterId
        }
    })
        .then(({ data }) => {
            console.log(data);
            // dispatch(changeUser(data.user))
        })
        .catch((err) => {
            console.log(err);
        })
}

export const getHistory = (dispatch) => {
    axios({
        method: "GET",
        url: `${urlAuth}api/v1/users/reading-history`,
        params: {
            userId
        }
    })
        .then(({ data }) => {
            console.log(data);
            dispatch(setReadList(data))
        })
        .catch((err) => {
            console.log(err);
        })
}

export default userSlice.reducer