import request from '@/utils/request'

export function activityList(data) {
  return request({
    url: '/coupon/list',
    method: 'post',
    data
  })
}
export function queryItem(id) {
  return request({
    url: '/product/getProductInfo?id=' + id,
    method: 'get'
  })
}

export function editActivity(data) {
  return request({
    url: '/coupon/update',
    method: 'post',
    data
  })
}

export function addActivity(data) {
  return request({
    url: '/coupon/add',
    method: 'post',
    data
  })
}
