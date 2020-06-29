import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import eventSlice from './eventSlice'
import cycleEventSlice from './cycleEventSlice'
import userSlice from './userSlice'

const middleware = [
    ...getDefaultMiddleware(), //already contain redux-thunk
    /*YOUR CUSTOM MIDDLEWARES HERE*/
];


const store = configureStore({
    reducer: {
        user: userSlice.reducer,
        event: eventSlice.reducer,
        cycleEvent: cycleEventSlice.reducer
    },
    middleware,
});

export default store