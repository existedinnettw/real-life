import moment from 'moment'
/****event filter and sort*** */
export function idEventFilter(events,id ){
    let event=events.filter(e=>{
        return e.id===id
    })[0]
    //in theory, event id is unique
    return event
}
export function cycleEventsIdEventsFilter(events, cycle_events_id ){
    let filteredEvents=events.filter(e=>{
        return e.cycle_events_id===cycle_events_id //if same return true
    })
    return filteredEvents
}
export function noneOutdatedEventsFilter(events ){
    let filteredEvents=events.filter(e=>{
        return moment.unix(e.due_time).isAfter(moment())
    })
    return filteredEvents
}
export function todayEventsFilter(events ){
    return events.filter(e=>{
        return e.is_today_event===true
    })
}
export function doneEventsFilter(events){
    return events.filter(e=>{
        return !!e.done_ts===true
    })
}
export function unDoneEventsFilter(events){
    return events.filter(e=>{
        return !!e.done_ts===false
    })
}
export function decDueTEventsSort(events){
    return events.sort((e,eNxt)=>{
        return -(e.due_time-eNxt.due_time)
    })
}
export function ascDueTEventsSort(events){
    return events.sort((e,eNxt)=>{
        return (e.due_time-eNxt.due_time)
    })
}
