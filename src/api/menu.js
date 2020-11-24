import request from '@/utils/request'

// 获取 菜单
export function getMenu(tabActive, data) {
  return request({
    url: `/authq/menu/supply/v1/menus${tabActive}/${data.proCode}/${data.parentId}`,
    method: 'get'
  })
}

// 新增 菜单
export function addMenu(tabActive, data) {
  return request({
    url: `/authq/menu/supply/v1/addMenu${tabActive}`,
    method: 'post',
    data
  })
}

// 修改菜单
export function updateMenu(data) {
  return request({
    url: '/authq/menu/supply/v1/updateMenu',
    method: 'put',
    data
  })
}

// 删除单个菜单
export function delMenu(menuId) {
  return request({
    url: `/authq/menu/supply/v1/delMenu/${menuId}`,
    method: 'delete'
  })
}

// 批量删除菜单
export function batchDel(ids) {
  return request({
    url: `/authq/menu/supply/v1/batchDel`,
    method: 'delete',
    data: {
      'ids': ids
    }
  })
}

