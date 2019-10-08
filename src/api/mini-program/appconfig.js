import request from '@/utils/request'

export function queryList(data) {
  return request({
    url: '/config/list',
    method: 'post',
    data
  })
}

export function updateConfig(data) {
  return request({
    url: '/config/update',
    method: 'post',
    data
  })
}
