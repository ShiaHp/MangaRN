import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

import { storeData, getData } from "../../features/asyncStorage";

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
    }
})

export const {changeUser, getUser} = userSlice.actions

export const getUserFromAsyncStore = ()=>(dispatch)=>{
    // storeData('user',null)
    getData('user')  
    .then((value)=>{
        console.log(value);
        dispatch(changeUser(value)) 
    })
    // .then((value)=>{
    //     console.log('b');
    //     console.log(value);
    // })
}

export const login = (payload)=>(dispatch)=>{
    axios({
        method : "POST",
        url : 'http://192.168.1.8:3033/api/v1/users/login',
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
        url : 'http://192.168.1.8:3033/api/v1/users/register',
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