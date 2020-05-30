import moment from 'moment'


export function getEvents(type = 'work', period = 'today') {
    //get events
    //should use promise
    let events=localStorage.getItem('events')
    let typedEvents= events.filter((e)=>{
        if(e.type==type) return true
    })
    let now= moment()
    let lowerBound
    let upperBound
    switch (period) {
        case 'outdated':
            lowerBound=now.subtract(30,'days')
            upperBound=now
            break
        case 'today':
            lowerBound=now
            upperBound=now.add(1, 'days')
            break
        case 'oneWeek':
            lowerBound=now.add(1, 'days')
            upperBound=now.add(7, 'days')
            break
        case 'oneMonth':
            lowerBound=now.add(7, 'days')
            upperBound=now.add(30, 'days')
            break
        case '6Month':
            lowerBound=now.add(30, 'days')
            upperBound=now.add(30*6, 'days')
            break
        default:
            console.log('you pass the wrong period in.')
            return
    }
    let finEvents=typedEvents.filter((e)=>{
        if(moment.isBetwwen(lowerBound,upperBound)){
            return true
        }
    })
    return finEvents

}

export function addEvent(payload){
    //let {type, name, dueTime, expectTime, timeSpent }=payload
    let events=localStorage.getItem('events')
    events.conate(payload)
    localStorage.setItem('events', events)
}