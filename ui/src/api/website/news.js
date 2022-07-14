import request from '@/utils/request'

// 查询列表
export function listNews(query) {
    return request({
        url: '/website/webNews/list',
        method: 'get',
        params: query
    })
}

// 查询详细
export function getNews(id) {
    return request({
        url: '/website/webNews/' + id,
        method: 'get'
    })
}

// 新增
export function addNews(data) {
    return request({
        url: '/website/webNews',
        method: 'post',
        data: data
    })
}

// 修改
export function updateNews(data) {
    return request({
        url: '/website/webNews',
        method: 'put',
        data: data
    })
}

// 删除
export function delNews(ids) {
    return request({
        url: '/website/webNews/' + ids,
        method: 'delete'
    })
}