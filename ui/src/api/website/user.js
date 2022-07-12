import request from '@/utils/request'

// 查询列表
export function listUser(query) {
    return request({
        url: '/website/webUser/list',
        method: 'get',
        params: query
    })
}

// 查询详细
export function getUser(id) {
    return request({
        url: '/website/webUser/' + id,
        method: 'get'
    })
}

// 新增
export function addUser(data) {
    return request({
        url: '/website/webUser',
        method: 'post',
        data: data
    })
}

// 修改
export function updateUser(data) {
    return request({
        url: '/website/webUser',
        method: 'put',
        data: data
    })
}

// 删除
export function delUser(ids) {
    return request({
        url: '/website/webUser/' + ids,
        method: 'delete'
    })
}