import request from '@/utils/request'

// 查询角色列表
export function getRoles(proId, data) {
  return request({
    url: `/authq/role/supply/v1/roleList/${proId}`,
    method: 'post',
    data
  })
}

// 根据角色Id获取菜单ids
export function getMenuIdsByRoleId(proId, roleId) {
  return request({
    url: `/authq/role/supply/v1/getMenuIdsByRoleId/${proId}/${roleId}`,
    method: 'get'
  })
}

// 查询项目全部菜单
export function getProAllTree(proId) {
  return request({
    url: `/authq/role/supply/v1/allTree/${proId}`,
    method: 'get'
  })
}

// 更新角色内容
export function updateRole(roleId, data) {
  return request({
    url: `/authq/role/supply/v1/updateRole/${roleId}`,
    method: 'put',
    data
  })
}
