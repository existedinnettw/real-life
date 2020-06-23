
/****event filter and sort*** */
export function idEventFilter(events,id ){
    let event=events.filter(e=>{
        return e.id===id
    })[0]
    return event
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
