
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { listEvents, createEvent, delEvent } from "api/event"

// event STATE
const eventState = {
    eventLoading: false,
    events: [],
};

export const fetchEvent = createAsyncThunk('event/fetchEvent',
    async (searchText = '', thunkAPI) => {
        const { dispatch, rejectWithValue } = thunkAPI
        const response = await listEvents(searchText)
        //follow code will execute after listEvents done
        //console.log(response)
        return response
    }
)
export const addEvent = createAsyncThunk('event/createEvent',
    async (payload, thunkAPI) => {
        const response = await createEvent(payload)
        //console.log(response)
        return response
    }
)
export const rmvEvent = createAsyncThunk('event/createEvent',
    async (eventID, thunkAPI) => {
        const response = await createEvent(eventID) //should no respond
        return response
    }
)

const eventSlice = createSlice({
    name: "event",
    initialState: eventState,
    reducers: {
        // startLoading: (state, action) => {
        //     state.eventLoading = true
        // },
        // endLoading: (state, action) => {
        //     state.eventLoading = false
        // },
    },
    extraReducers: {
        //不是像weathermoo那樣先定 synchronus 的loading, endloading function，好像也不能直接用還沒create的function。
        // 等於是都要用 createAction
        [fetchEvent.pending]: (state, action) => {
            state.eventLoading = true
        },
        [fetchEvent.fulfilled]: (state, action) => {
            state.events = action.payload  //state.events.concat(action.payload)
            state.eventLoading = false
        },
        [fetchEvent.rejected]: (state, action) => {
            state.eventLoading = false
            console.log(`async action reject:`,action.error)
        },

        [addEvent.pending]: (state, action) => {
            state.eventLoading = true
        },
        [addEvent.fulfilled]: (state, action) => {
            state.events = [action.payload, ...state.events]
            state.eventLoading = false
        },
        [addEvent.rejected]: (state, action) => {
            state.eventLoading = false
            console.log(`async action reject:`,action.error)
        },

        [rmvEvent.pending]: (state, action) => {
            state.eventLoading = true
        },
        [rmvEvent.fulfilled]: (state, action) => {
            state.eventLoading = false
        },
        [rmvEvent.rejected]: (state, action) => {
            state.eventLoading = false
            console.log(`async action reject:`,action.error)
        }
    }
});

//if component need action, just import slice and do someing like this.
const { startLoading, endLoading } = eventSlice.actions;

export default eventSlice