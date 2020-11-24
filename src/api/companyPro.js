import request from '@/utils/request'

// 查询公司列表
export function queryCompanyList(data) {
  return request({
    url: '/authq/companyPro/v1/companyPageList',
    method: 'post',
    data: {
      'size': data.size,
      'num': data.num,
      'query': {
        'companyName': data.companyName
      }
    }
  })
}

// 查询公司下项目列表
export function queryCompanyDemoList(data) {
  return request({
    url: '/authq/companyPro/v1/proPageList',
    method: 'post',
    data: {
      'size': data.size,
      'num': data.num,
      'query': {
        'companyId': data.companyId
      }
    }
  })
}

// 新建公司
export function addCompany(data) {
  return request({
    url: '/authq/companyPro/v1/addCompany',
    method: 'post',
    data
  })
}

// 修改公司
export function updateCompany(data) {
  return request({
    url: '/authq/companyPro/v1/updateCompany',
    method: 'put',
    data
  })
}

// 删除公司
export function delCompany(ids) {
  console.log(ids)
  return request({
    url: `/authq/companyPro/v1/delCompany/${ids}`,
    method: 'delete'
  })
}

// 新建项目
export function addPro(data) {
  return request({
    url: '/authq/companyPro/v1/addPro',
    method: 'post',
    data
  })
}

// 修改项目
export function updatePro(data) {
  return request({
    url: '/authq/companyPro/v1/updatePro',
    method: 'put',
    data
  })
}

// 删除项目
export function delPro(ids) {
  return request({
    url: `/authq/companyPro/v1/delPro/${ids}`,
    method: 'delete'
  })
}

