import request from '@/utils/request'

export function queryList(data) {
  return request({
    url: '/bannerInfo/list',
    method: 'post',
    data
  })
}

export function editBanner(data) {
  return request({
    url: '/bannerInfo/update',
    method: 'post',
    data
  })
}

export function addBanner(data) {
  return request({
    url: '/bannerInfo/add',
    method: 'post',
    data
  })
}
