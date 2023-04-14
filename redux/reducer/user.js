import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

import { storeData, getData } from "../../features/asyncStorage";

const url = 'http://192.168.1.8:3033/'

const initialState = {
    value : null
  }
export const userSlice = createSlice({
    name : 'user',
    initialState,

    reducers :{
        changeUser : (state,action)=>{
            state.value = action.payload
            storeData('user',state.value)
        },
        logOut : (state,action)=>{
            state.value = null,
            storeData('user',null)
        }
    }
})

export const {changeUser, logOut} = userSlice.actions

export const getUserFromAsyncStore = ()=>(dispatch)=>{
    getData('user')  
    .then((value)=>{
        dispatch(changeUser(value)) 
    })
}

export const login = (payload)=>(dispatch)=>{
    axios({
        method : "POST",
        url : `${url}api/v1/users/login`,
        data : {
            email : payload.email,
            password : payload.password,
        }
    })
    .then((data)=>{
        dispatch(changeUser(data.data.user))
        
    })
    .catch((err)=>{
        console.log(err); 
    })
}
export const register = (dispatch)=>{
    axios({
        method : "POST",
        url : `${url}api/v1/users/register`,
        data : {
            email : payload.email,
            password : payload.password,
        }
    })
    .then((data)=>{
        console.log(data);
        dispatch(changeUser(data.data.user))
    })
    .catch((err)=>{
        console.log(err);
    })
}


export default userSlice.reducer