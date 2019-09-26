import request from '@/utils/request'

export function queryBannerInfos(data) {
  return request({
    url: '/bannerInfo/toShowBannerInfos',
    method: 'post',
    data
  })
}
