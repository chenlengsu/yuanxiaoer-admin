import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/authq/authqLogin/v1/login',
    method: 'post',
    data
  })
}

// export function getInfo(token) {
//   return request({
//     url: '/vue-admin-template/user/info',
//     method: 'get',
//     params: { token }
//   })
// }

// export function logout() {
//   return request({
//     url: '/vue-admin-template/user/logout',
//     method: 'post'
//   })
// }

// 获取 pc 菜单
export function getPcMenu(data) {
  return request({
    url: '/authq/menu/supply/v1/menusPc/2/-1',
    method: 'get'
  })
}

