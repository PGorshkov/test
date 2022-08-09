import axios from "axios"

const _axios = axios.create({
    baseURL: 'https://apiv3.apifootball.com/',
    params: {
        APIkey: '98185445708ca5dde507c5442099456f711db7a22588472090f09d635039e1af'
    }
})

export default _axios