import { configureStore } from '@reduxjs/toolkit'
import userReducer from './user'

const store = configureStore({
  reducer: {
    // Define a top-level state field named `todos`, handled by `todosReducer`
    users : userReducer,
  }
})

export default store