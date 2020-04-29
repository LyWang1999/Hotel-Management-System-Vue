import request from '@/utils/request'

export function getOneOrderById(orderId) {
  return request({
    url: '/order/info/id/' + orderId,
    method: 'get'
  })
}

// export function updateCheckCustomerInfo({ checkCustomerIdCard, checkCustomerId, checkCustomerName,
//   male, waiterPassword, orderId, roomNo, checkCustomerCheckInTime, checkCustomerLeaveTime, living }) {
//   return request({
//     url: '/check-customer/info',
//     method: 'patch',
//     data: {
//       checkCustomerIdCard,
//       checkCustomerId,
//       checkCustomerName,
//       male,
//       waiterPassword,
//       orderId,
//       roomNo,
//       checkCustomerCheckInTime,
//       checkCustomerLeaveTime,
//       living
//     }
//   })
// }
//
// export function deleteCheckCustomerInfo(checkCustomerId) {
//   return request({
//     url: '/check-customer/info',
//     method: 'delete',
//     data: {
//       checkCustomerId
//     }
//   })
// }
