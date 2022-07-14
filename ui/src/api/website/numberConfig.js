import request from '@/utils/request'

// 查询列表
export function listConfig(query) {
    return request({
        url: '/website/numberConfig/list',
        method: 'get',
        params: query
    })
}

// 查询详细
export function getConfig(id) {
    return request({
        url: '/website/numberConfig/' + id,
        method: 'get'
    })
}

// 新增
export function addConfig(data) {
    return request({
        url: '/website/numberConfig',
        method: 'post',
        data: data
    })
}

// 修改
export function updateConfig(data) {
    return request({
        url: '/website/numberConfig',
        method: 'put',
        data: data
    })
}

// 删除
export function delConfig(ids) {
    return request({
        url: '/website/numberConfig/' + ids,
        method: 'delete'
    })
}