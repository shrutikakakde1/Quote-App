import axios from 'axios'

export function getCall() {
    return axios.get('https://api.quotable.io/random')
}

export function insertCall(yourQuote,authorName) {
    return axios.post('https://api.quotable.io/random',{
        content:yourQuote,
        author:authorName
    })
}
