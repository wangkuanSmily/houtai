import request from '@/utils/request'

export function queryList(data) {
  return request({
    url: '/facilities/list',
    method: 'post',
    data
  })
}

export function editItem(data) {
  return request({
    url: '/facilities/update',
    method: 'post',
    data
  })
}

export function addItem(data) {
  return request({
    url: '/facilities/add',
    method: 'post',
    data
  })
}
