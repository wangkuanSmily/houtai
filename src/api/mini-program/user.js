import request from '@/utils/request'

export function userList(data) {
  return request({
    url: '/admin/user/list',
    method: 'post',
    data
  })
}
