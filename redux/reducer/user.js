import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { setReadList } from "./manga";
import { storeData, getData } from "../../features/asyncStorage";
import Toast from 'react-native-toast-message';
export const urlAuth = 'http://192.168.1.72:3033/'
// export const urlAuth = 'http://localhost:3033/'


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
            navigator.navigate('Home');
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


            Toast.show({
                type: 'success',
                position: 'bottom',
                text1: 'Success',
                text2: 'Register success'
            });

            dispatch(changeUser(data.user));
            navigator.navigate('Home');
        })
        .catch((err) => {
            Toast.show({
                type: 'error',
                position: 'bottom',
                text1: 'Error',
                text2: 'Register fail'
            })
            console.log(err);
        })
}
export const updateHistory = (payload) => (dispatch, getState) => {
    const { mangaTitle, lastChapter, lastPage, mangaId, lastTimeRead, chapterId, coverArt } = payload;
    const state = getState().user.value; 

    const userId = state._id;
    axios({
        method: "PUT",
        url: `${urlAuth}api/v1/users/reading-history/${userId}`,
        data: {
            mangaTitle,
            lastChapter,
            lastPage,
            mangaId,
            lastTimeRead,
            chapterId,
            coverArt
        }
    })
        .then(( data ) => {
            // dispatch(changeUser(data.data.user))
            return;
        })
        .catch((err) => {
            console.log(err);
        });
};

export const getHistory = (dispatch) => (dispatch, getState)  => {
    const state = getState().user.value; 
    const userId = state._id;
    axios({
        method: "GET",
        url: `${urlAuth}api/v1/users/reading-history/${userId}`,
    })
        .then(({ data }) => {
            dispatch(setReadList(data))
        })
        .catch((err) => {
            console.log(err);
        })
}

export default userSlice.reducer