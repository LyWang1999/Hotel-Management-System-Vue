import request from '@/utils/request'

export function getWaiters(listQuery) {
  return request({
    url: '/waiter/info/page/' + listQuery.page + '/limit/' + listQuery.limit + '/asc/' + listQuery.asc,
    method: 'get',
    params: {
      waiterNo: listQuery.waiterNo,
      waiterName: listQuery.waiterName,
      beginWorkTime: listQuery.beginWorkTime,
      endWorkTime: listQuery.endWorkTime,
      workDay: listQuery.workDay
    }
  })
}

export function createWaiterInfo({ waiterNo, waiterName, male, beginWorkTime, endWorkTime, workDay }) {
  return request({
    url: '/waiter/info',
    method: 'post',
    data: {
      waiterNo,
      waiterName,
      male,
      beginWorkTime,
      endWorkTime,
      workDay
    }
  })
}

export function updateWaiterInfo({ waiterId, waiterName, male, waiterPassword, beginWorkTime, endWorkTime, workDay }) {
  return request({
    url: '/waiter/info',
    method: 'patch',
    data: {
      waiterId,
      waiterName,
      male,
      waiterPassword,
      beginWorkTime,
      endWorkTime,
      workDay
    }
  })
}

export function deleteWaiterInfo(waiterId) {
  return request({
    url: '/waiter/info',
    method: 'delete',
    data: {
      waiterId
    }
  })
}
