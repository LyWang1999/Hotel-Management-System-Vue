import request from '@/utils/request'

export function getAdmins(listQuery) {
  return request({
    url: '/admin/info/page/' + listQuery.page + '/limit/' + listQuery.limit + '/asc/' + listQuery.asc,
    method: 'get',
    params: {
      adminNo: listQuery.adminNo,
      adminName: listQuery.adminName,
      adminDuty: listQuery.adminDuty
    }
  })
}
