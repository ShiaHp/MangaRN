import { configureStore } from '@reduxjs/toolkit'
import userReducer from './user'
import mangaReducer from './manga'
const store = configureStore({
  reducer: {
    // Define a top-level state field named `todos`, handled by `todosReducer`
    user : userReducer,
    manga : mangaReducer
  },
  middleware: (getDefaultMiddleware) =>
  getDefaultMiddleware({
    serializableCheck: false,
    
  }),
})

export default store