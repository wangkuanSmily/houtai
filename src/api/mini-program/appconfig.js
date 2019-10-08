import request from '@/utils/request'

export function queryList(data) {
  return request({
    url: '/config/list',
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

export function editCoupon(data) {
  return request({
    url: '/coupon/update',
    method: 'post',
    data
  })
}

export function addCoupon(data) {
  return request({
    url: '/coupon/add',
    method: 'post',
    data
  })
}
