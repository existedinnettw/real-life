
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { listEvents, createEvent, delEvent, updateEvent } from "api/event"
import {ascDueTEventsSort} from "util/filter"
// import _ from 'lodash'

// event STATE
const eventState = {
    eventLoadingCount: 0,
    events: [],
};

export const fetchEvent = createAsyncThunk('event/fetchEvent',
    async (searchText = '', thunkAPI) => { //actually the input is an arg (single value)
        const { dispatch, rejectWithValue } = thunkAPI
        const response = await listEvents(searchText)
        //follow code will execute after listEvents done
        //console.log(response)
        return response
    }
)
export const addEvent = createAsyncThunk('event/addEvent',
    async (payload, thunkAPI) => {
        const response = await createEvent(payload)
        //console.log(response)
        return response
    }
)
export const modEvent = createAsyncThunk('event/modEvent',
    async (payload, thunkAPI) => {
        const response = await updateEvent(payload)
        //console.log(response)
        return response
    }
)
export const rmvEvent = createAsyncThunk('event/rmvEvent',
    async (eventID, thunkAPI) => {
        const response = await delEvent(eventID) //should no respond
        return response
    }
)

const eventSlice = createSlice({
    name: "event",
    initialState: eventState,
    reducers: {
        // startLoading: (state, action) => {
        //     state.eventLoadingCount+=1
        // },
        // endLoading: (state, action) => {
        //     state.eventLoadingCount-=1
        // },
    },
    extraReducers: {
        //不是像weathermood那樣先定 synchronus 的loading, endloading function，好像也不能直接用還沒create的function。
        // 等於是都要用 createAction
        [fetchEvent.pending]: (state, action) => {
            state.eventLoadingCount+=1
        },
        [fetchEvent.fulfilled]: (state, action) => {
            state.events = ascDueTEventsSort(action.payload)  //state.events.concat(action.payload)
            state.eventLoadingCount-=1
        },
        [fetchEvent.rejected]: (state, action) => {
            state.eventLoadingCount-=1
            console.log(`async action reject:`,action.error)
        },

        /*********add events***********/
        [addEvent.pending]: (state, action) => {
            state.eventLoadingCount+=1
        },
        [addEvent.fulfilled]: (state, action) => {
            state.events = ascDueTEventsSort([action.payload, ...state.events])
            state.eventLoadingCount-=1
        },
        [addEvent.rejected]: (state, action) => {
            state.eventLoadingCount-=1
            console.log(`async action reject:`,action.error)
        },

        /*********modify events***********/
        [modEvent.pending]: (state, action) => {
            state.eventLoadingCount+=1
        },
        [modEvent.fulfilled]: (state, action) => {
            //action.payload
            //console.log(action.payload)
            let events=state.events.filter(e=>{
                return e.id!==action.payload.id
            })
            state.events = ascDueTEventsSort([action.payload,...events])  //check this
            state.eventLoadingCount-=1
            // console.log(state.events)
        },
        [modEvent.rejected]: (state, action) => {
            state.eventLoadingCount-=1
            console.log(`async action reject:`,action.error)
        },

        /*********rmv events***********/
        [rmvEvent.pending]: (state, action) => {
            state.eventLoadingCount+=1
        },
        [rmvEvent.fulfilled]: (state, action) => {
            //currently, delete only only return 1 entry
            state.events= state.events.filter((item,idx)=>{
                return item.id!==action.payload[0].id
            })
            state.eventLoadingCount-=1
        },
        [rmvEvent.rejected]: (state, action) => {
            state.eventLoadingCount-=1
            console.log(`async action reject:`,action.error)
        }
    }
});

//if component need action, just import slice and do someing like this.
// const { startLoading, endLoading } = eventSlice.actions;

export default eventSlice