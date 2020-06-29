
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import parser from 'cron-parser'
import moment from 'moment'

import { listCycleEvents, createCycleEvent, delCycleEvent, updateCycleEvent } from "api/cycleEvent"
import { cycleEventsIdEventsFilter, noneOutdatedEventsFilter } from "util/filter"
// import store from "state/store"
import { addEvent } from "state/eventSlice";
// import _ from 'lodash'

// cycleEvent STATE
const cycleEventState = {
    cycleEventLoadingCount: 0,
    cycleEvents: [],
};

function createThreeEvents(response, thunkAPI) {
    const { dispatch, getState } = thunkAPI
    response.forEach((el, idx) => {
        let events = getState().event.events
        events = noneOutdatedEventsFilter(cycleEventsIdEventsFilter(events, el.id))
        // events = ascDueTEventsSort(events)
        // console.log('filtered:', events)

        let initInterval = parser.parseExpression(el.init_cron)
        let dueInterval = parser.parseExpression(el.due_cron)

        for (let i = 0; i < 3; i++) {
            let nxtDueTime = moment(dueInterval.next().toDate())
            let found= events.find((el) => {
                return nxtDueTime.isSame(moment.unix(el.due_time))
            })
            // console.log('found:',found)
            if (found) {
                // console.log('event of cycleEvent already created')
                continue
            }


            let payload = {
                summary: el.summary,
                init_time: moment(initInterval.next().toDate()).unix(),
                due_time: nxtDueTime.unix(),
                target: el.target,
                purpose: el.purpose,
                expect_time: el.expect_time,
                cycle_events_id: el.id,
            }
            dispatch(addEvent(payload))
        }//end for
    })
}

export const fetchCycleEvent = createAsyncThunk('cycleEvent/fetchCycleEvent',
    async (searchText = '', thunkAPI) => { //actually the input is an arg (single value)
        const response = await listCycleEvents(searchText) //get cycleEvents
        createThreeEvents(response, thunkAPI)
        return response
    }
)
export const addCycleEvent = createAsyncThunk('cycleEvent/addCycleEvent',
    async (payload, thunkAPI) => {
        const response = await createCycleEvent(payload)
        console.log(response)
        createThreeEvents([response], thunkAPI)
        return response
    }
)
export const modCycleEvent = createAsyncThunk('cycleEvent/modCycleEvent',
    async (payload, thunkAPI) => {
        const response = await updateCycleEvent(payload)
        //console.log(response)
        return response
    }
)
export const rmvCycleEvent = createAsyncThunk('cycleEvent/rmvCycleEvent',
    // events should set null
    // https://stackoverflow.com/questions/19898274/on-delete-set-null-in-postgres
    async (cycleEventID, thunkAPI) => {
        const response = await delCycleEvent(cycleEventID) //should no respond
        return response
    }
)

const cycleEventSlice = createSlice({
    name: "cycleEvent",
    initialState: cycleEventState,
    reducers: {

    },
    extraReducers: {

        [fetchCycleEvent.pending]: (state, action) => {
            state.cycleEventLoadingCount += 1
        },
        [fetchCycleEvent.fulfilled]: (state, action) => {
            state.cycleEvents = (action.payload)
            state.cycleEventLoadingCount -= 1
        },
        [fetchCycleEvent.rejected]: (state, action) => {
            state.cycleEventLoadingCount -= 1
            console.log(`async action reject:`, action.error)
        },

        /*********add cycleEvents***********/
        [addCycleEvent.pending]: (state, action) => {
            state.cycleEventLoadingCount += 1
        },
        [addCycleEvent.fulfilled]: (state, action) => {
            state.cycleEvents = ([action.payload, ...state.cycleEvents])
            state.cycleEventLoadingCount -= 1
        },
        [addCycleEvent.rejected]: (state, action) => {
            state.cycleEventLoadingCount -= 1
            console.log(`async action reject:`, action.error)
        },

        /*********modify cycleEvents***********/
        [modCycleEvent.pending]: (state, action) => {
            state.cycleEventLoadingCount += 1
        },
        [modCycleEvent.fulfilled]: (state, action) => {
            //action.payload
            //console.log(action.payload)
            let cycleEvents = state.cycleEvents.filter(e => {
                return e.id !== action.payload.id
            })
            state.cycleEvents = ([action.payload, ...cycleEvents])  //check this
            state.cycleEventLoadingCount -= 1
            // console.log(state.cycleEvents)
        },
        [modCycleEvent.rejected]: (state, action) => {
            state.cycleEventLoadingCount -= 1
            console.log(`async action reject:`, action.error)
        },

        /*********rmv cycleEvents***********/
        [rmvCycleEvent.pending]: (state, action) => {
            state.cycleEventLoadingCount += 1
        },
        [rmvCycleEvent.fulfilled]: (state, action) => {
            //currently, delete only only return 1 entry
            state.cycleEvents = state.cycleEvents.filter((item, idx) => {
                return item.id !== action.payload[0].id
            })
            state.cycleEventLoadingCount -= 1
        },
        [rmvCycleEvent.rejected]: (state, action) => {
            state.cycleEventLoadingCount -= 1
            console.log(`async action reject:`, action.error)
        }
    }
});

export default cycleEventSlice