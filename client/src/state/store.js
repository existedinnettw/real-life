import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import eventSlice from './eventSlice.js'

const middleware = [
    ...getDefaultMiddleware(), //already contain redux-thunk
    /*YOUR CUSTOM MIDDLEWARES HERE*/
];


const store = configureStore({
    reducer: {
        event: eventSlice.reducer,
    },
    middleware,
});

export default store