import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { checkLoginByAPI } from "api/auth"
// import {ascDueTEventsSort} from "util/filter"

const userState = {
    userLoadingCount:0,
    userName:null,
    photo:null,
    isLogin:false
};

export const checkLogin = createAsyncThunk('user/checkLogin',
    async (payload, thunkAPI) => {
        const response = await checkLoginByAPI()
        // console.log('response',response)
        return response 
    }
)


const userSlice = createSlice({
    name: "user",
    initialState: userState,
    reducers: {
    },
    extraReducers: {
        //不是像weathermood那樣先定 synchronus 的loading, endloading function，好像也不能直接用還沒create的function。
        // 等於是都要用 createAction
        [checkLogin.pending]: (state, action) => {
            state.userLoadingCount+=1
        },
        [checkLogin.fulfilled]: (state, action) => {
            // let newState = {...state,...action.payload}  //state.events.concat(action.payload)
            // newState.userLoadingCount-=1
            // console.log(action.payload, state, newState)
            // state=newState
            state.userName = action.payload.userName
            state.photo=action.payload.photo
            state.isLogin=action.payload.isLogin
            state.userLoadingCount-=1
            //console.log(state)
        },
        [checkLogin.rejected]: (state, action) => {
            state.isLogin = false
            state.userLoadingCount-=1
            console.log(`async action reject:`,action.error)
        },
    }
});


export default userSlice


