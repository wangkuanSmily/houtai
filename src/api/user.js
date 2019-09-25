import request from '@/utils/request'

export function login(data) {
  return request({
    url: window.location.origin + '/dev-api' + '/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url:  window.location.origin + '/dev-api' + '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url:  window.location.origin + '/dev-api' + '/user/logout',
    method: 'post'
  })
}


// export function login(data) {
//   const formData = new FormData()
//   for (var key in data) {
//     formData.append(key, data[key])
//   }
//   return request({
//     url: process.env.VUE_APP_LOGIN_API + '/oauth/user/token',
//     headers: {
//       'Accept': 'application/json',
//       'Authorization': 'Basic d2ViQXBwOndlYkFwcA=='
//     },
//     method: 'post',
//     data: formData
//   })
// }
//
// export function getInfo(token) {
//   return request({
//     url: process.env.VUE_APP_LOGIN_API + '/oauth/user/info',
//     method: 'get',
//     headers: {
//       Authorization: 'Basic d2ViQXBwOndlYkFwcA=='
//     },
//     params: { token }
//   })
// }
//
// export function logout() {
//   return request({
//     url: process.env.VUE_APP_LOGIN_API + '/oauth/user/logout',
//     headers: {
//       Authorization: 'Basic d2ViQXBwOndlYkFwcA=='
//     },
//     method: 'post'
//   })
// }
