import request from '@/utils/request'

export function addQRCodeConfig(data) {
  return request({
    url: '/qr/generateQRCode',
    method: 'get',
    params: data
  })
}

export function fetchQRCodeConfig(data) {
  return request({
    url: '/qr/getQRCodeConfig',
    method: 'get',
    params: data
  })
}

export function fetchQRCodeConfigs(data) {
  return request({
    url: '/qr/toShowQRCodeList',
    method: 'post',
    data
  })
}
