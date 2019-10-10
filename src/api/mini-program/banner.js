import request from '@/utils/request'

export function queryBannerInfos(data) {
  return request({
    url: '/bannerInfo/list',
    method: 'post',
    data
  })
}

export function updateBannerInfo(data) {
  return request({
    url: '/bannerInfo/update',
    method: 'post',
    data
  })
}

export function saveBannerInfo(data) {
  return request({
    url: '/bannerInfo/add',
    method: 'post',
    data
  })
}
