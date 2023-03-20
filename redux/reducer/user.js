import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    user : {}
  }
export const userSlice = createSlice({
    name : 'user',
    initialState,

    reducers :{
        changeUser : (state,action)=>{
            state.user = action.payload
            console.log(state.user);
        }
    }
})

export const {changeUser} = userSlice.actions

export const getUserFromAsyncStore = ()=>{
    
}

export const login = (payload)=>(dispatch)=>{
    axios({
        method : "POST",
        url : 'http://localhost:3033/api/v1/users/login',
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
export const register = (payload)=>(dispatch)=>{
    axios({
        method : "POST",
        url : 'http://localhost:3033/api/v1/users/register',
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