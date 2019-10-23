import request from '@/utils/request'

export function queryList(data) {
  return request({
    url: '/map/list',
    method: 'post',
    data
  })
}
export function queryItem(id) {
  return request({
    url: '/map/info?id=' + id,
    method: 'get'
  })
}

export function updateItem(data) {
  return request({
    url: '/map/update',
    method: 'post',
    data
  })
}

export function addItem(data) {
  return request({
    url: '/map/add',
    method: 'post',
    data
  })
}
