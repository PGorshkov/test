import axios from "axios"

const _axios = axios.create({
    baseURL: 'https://apiv3.apifootball.com/',
    params: {
        APIkey: '03b9adc487dff5c26b952f668ec825536d8157c0dd7e622ff3611eefd798cf95'
    }
})

export default _axios