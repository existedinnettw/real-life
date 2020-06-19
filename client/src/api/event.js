import moment from 'moment'
import axios from 'axios'

//conbining and using the api which backend provide to fulfill function the app need
//const API_URL= "http://localhost:4000/api"

const baseUrl = process.env.API_URL

export function listEvents(searchText = '') {

    // let now= moment()
    // let lowerBound
    // let upperBound
    // switch (period) {
    //     case 'outdated':
    //         lowerBound=now.subtract(30,'days')
    //         upperBound=now
    //         break
    //     case 'today':
    //         lowerBound=now
    //         upperBound=now.add(1, 'days')
    //         break
    //     case 'oneWeek':
    //         lowerBound=now.add(1, 'days')
    //         upperBound=now.add(7, 'days')
    //         break
    //     case 'oneMonth':
    //         lowerBound=now.add(7, 'days')
    //         upperBound=now.add(30, 'days')
    //         break
    //     case '6Month':
    //         lowerBound=now.add(30, 'days')
    //         upperBound=now.add(30*6, 'days')
    //         break
    //     default:
    //         console.log('you pass the wrong period in.')
    //         return
    // }
    // let finEvents=typedEvents.filter((e)=>{
    //     if(moment.isBetwwen(lowerBound,upperBound)){
    //         return true
    //     }
    // })
    let url = `${baseUrl}/events`
    let query = []
    if (searchText)
        query.push(`searchText=${searchText}`);
    if (query.length)
        url += '?' + query.join('&');
    console.log(`Making GET request to: ${url}`);

    let resPromise = axios.get(url).then(res => {
        if (res.status !== 200) {
            let str=`Unexpected response code: ${res.status}`
            console.log(str)
            throw new Error(str);
        }
        else {
            //console.log(res.data)
            return res.data //if you want to use res.data, you have to call then() after getting resPromise.
        }

    })

    return resPromise

}

export function createEvent(payload) {
    //let {summary, target, purpose, initTime, dueTime, expectTime }=payload
    let url = `${baseUrl}/events`
    console.log(`Making POST request to: ${url} with payload`,payload)
    return axios.post(url, {
        ...payload
    }).then(function(res) {
        if (res.status !== 200)
            throw new Error(`Unexpected response code: ${res.status}`);

        return res.data;
    });
}

export function delEvent(eventID){
    let url = `${baseUrl}/events/${eventID}`
    console.log(`Making delet request to: ${url}`)
    return axios.delete(url, {
    }).then(function(res) {
        if (res.status !== 200)
            throw new Error(`Unexpected response code: ${res.status}`);
        //console.log(res)
        return res.data;
    });
}