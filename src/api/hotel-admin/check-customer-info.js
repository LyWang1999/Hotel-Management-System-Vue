import request from '@/utils/request'

export function getCheckCustomers(listQuery) {
  return request({
    url: '/check-customer/info/page/' + listQuery.page + '/limit/' + listQuery.limit + '/asc/' + listQuery.asc,
    method: 'get',
    params: {
      checkCustomerIdCard: listQuery.checkCustomerIdCard,
      checkCustomerPhone: listQuery.checkCustomerPhone,
      checkCustomerName: listQuery.checkCustomerName,
      orderId: listQuery.orderId,
      roomNo: listQuery.roomNo
    }
  })
}

export function updateCheckCustomerInfo({ checkCustomerIdCard, checkCustomerId, checkCustomerName,
  male, waiterPassword, orderId, roomNo, checkCustomerCheckInTime, checkCustomerLeaveTime, living }) {
  return request({
    url: '/check-customer/info',
    method: 'patch',
    data: {
      checkCustomerIdCard,
      checkCustomerId,
      checkCustomerName,
      male,
      waiterPassword,
      orderId,
      roomNo,
      checkCustomerCheckInTime,
      checkCustomerLeaveTime,
      living
    }
  })
}

export function deleteCheckCustomerInfo(checkCustomerId) {
  return request({
    url: '/check-customer/info',
    method: 'delete',
    data: {
      checkCustomerId
    }
  })
}
