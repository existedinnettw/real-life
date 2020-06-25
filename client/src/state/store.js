import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import eventSlice from './eventSlice'
import userSlice from './userSlice'

const middleware = [
    ...getDefaultMiddleware(), //already contain redux-thunk
    /*YOUR CUSTOM MIDDLEWARES HERE*/
];


const store = configureStore({
    reducer: {
        user: userSlice.reducer,
        event: eventSlice.reducer,
    },
    middleware,
});

export default store