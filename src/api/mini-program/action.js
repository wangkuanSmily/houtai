import request from '@/utils/request'

export function queryList(data, entityName) {
  return request({
    url: `/${entityName}/list`,
    method: 'post',
    data
  })
}

export function editItem(data, entityName) {
  return request({
    url: `/${entityName}/update`,
    method: 'post',
    data
  })
}

export function addItem(data, entityName) {
  return request({
    url: `/${entityName}/add`,
    method: 'post',
    data
  })
}
