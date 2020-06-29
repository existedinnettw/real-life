import axios from 'axios'

const baseUrl = process.env.BASE_URL

export function checkLoginByAPI() {
    let url = `${baseUrl}/auth/islogin`
    console.log(`Making GET request to: ${url} `)
    return axios.get(url
    ).then(function (res) {
        if (res.status !== 200)
            throw new Error(`Unexpected response code: ${res.status}`);
            //return false
        //console.log('checkloginback',res.data)
        return res.data;
    });
}
