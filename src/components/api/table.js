import axios from '../libs/api.request'

export const getList = (resource, page = 1, size = 10) => {
    return axios.request({
        url: `${resource}`,
        method: 'get',
        params: {
            page,
            size
        }
    })
}

export const get = (resource, id) => {
    return axios.request({
        url: `${resource}/${id}`,
        method: 'get'
    })
}

export const create = (resource, data) => {
    return axios.request({
        url: `${resource}`,
        method: 'post',
        data: data
    })
}

export const update = (resource, data) => {
    return axios.request({
        url: `${resource}`,
        method: 'put',
        data: data
    })
}

export const excute = (resource, data, method) => {
    return axios.request({
        url: `${resource}`,
        method: method,
        data: data
    })
}

export const remove = (resource, id) => {
    return axios.request({
        url: `${resource}/${id}`,
        method: 'delete'
    })
}