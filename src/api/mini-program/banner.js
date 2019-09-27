import request from '@/utils/request'

export function queryBannerInfos(data) {
  return request({
    url: '/bannerInfo/toShowBannerInfos',
    method: 'post',
    data
  })
}

export function updateBannerInfo(data) {
  return request({
    url: '/bannerInfo/updateBannerInfo',
    method: 'post',
    data
  })
}

export function saveBannerInfo(data) {
  return request({
    url: '/bannerInfo/saveBannerInfo',
    method: 'post',
    data
  })
}
