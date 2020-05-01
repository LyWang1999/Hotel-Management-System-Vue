import request from '@/utils/request'

export function getOrders(listQuery) {
  return request({
    url: '/order/info/page/' + listQuery.page + '/limit/' + listQuery.limit + '/asc/' + listQuery.asc,
    method: 'get',
    params: {
      orderId: listQuery.orderId,
      registerPhone: listQuery.registerPhone,
      roomTypeName: listQuery.roomTypeName,
      beginDate: listQuery.beginDate,
      endDate: listQuery.endDate
    }
  })
}

export function getOneOrderById(orderId) {
  return request({
    url: '/order/info/id/' + orderId,
    method: 'get'
  })
}

export function updateOrderInfo({ orderId, roomTypeName, orderCheckInTime, orderLeaveTime, orderRoomNum, orderDetail, complete }) {
  return request({
    url: '/order/info',
    method: 'patch',
    data: {
      orderId,
      roomTypeName,
      orderCheckInTime,
      orderLeaveTime,
      orderRoomNum,
      orderDetail,
      complete
    }
  })
}

export function deleteOrderInfo(orderId) {
  return request({
    url: '/order/info',
    method: 'delete',
    data: {
      orderId
    }
  })
}
