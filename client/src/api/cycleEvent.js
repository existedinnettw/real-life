
import axios from 'axios'

//conbining and using the api which backend provide to fulfill function the app need

const baseUrl = process.env.API_URL

export function listCycleEvents(searchText = '') {
    let url = `${baseUrl}/cycleEvents`
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

export function createCycleEvent(payload) {
    let url = `${baseUrl}/cycleEvents`
    console.log(`Making POST request to: ${url} with payload`,payload)
    return axios.post(url, {
        ...payload
    }).then(function(res) {
        if (res.status !== 200)
            throw new Error(`Unexpected response code: ${res.status}`);
        return res.data;
    });
}

export function updateCycleEvent({id,...rest}){
    //should include event ID, id is event id
    let url = `${baseUrl}/cycleEvents/${id}`
    console.log(`Making put request to: ${url}`)
    let valueToModify=rest
    return axios.put(url,{
        ...valueToModify
    }).then(function(res){
        if (res.status!==200)
            throw new Error(`Unexpected response code: ${res.status}`);
        return res.data;
    })
}

export function delCycleEvent(eventID){
    let url = `${baseUrl}/cycleEvents/${eventID}`
    console.log(`Making delet request to: ${url}`)
    return axios.delete(url, {
    }).then(function(res) {
        if (res.status !== 200)
            throw new Error(`Unexpected response code: ${res.status}`);
        //console.log(res)
        return res.data;
    });
}

