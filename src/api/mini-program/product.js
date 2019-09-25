import request from '@/utils/request'

export function queryList(data) {
  return request({
    url: '/product/toShowProductInfos',
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

export function updateItem(data) {
  return request({
    url: '/product/updateProductInfo',
    method: 'post',
    data
  })
}

export function addItem(data) {
  return request({
    url: '/product/saveProductInfo',
    method: 'post',
    data
  })
}
