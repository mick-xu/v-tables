import HttpRequest from './axios'

const axios = new HttpRequest()
export const set = function (url, token) {
    axios.config(url, token)
};
export default axios
