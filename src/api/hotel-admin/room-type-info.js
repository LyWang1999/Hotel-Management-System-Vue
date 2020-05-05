import request from '@/utils/request'

export function getTypeNames() {
  return request({
    url: '/room-type/types',
    method: 'get'
  })
}

export function getRoomTypes(listQuery) {
  return request({
    url: '/room-type/info/page/' + listQuery.page + '/limit/' + listQuery.limit + '/asc/' + listQuery.asc,
    method: 'get',
    params: {
      sortField: listQuery.sortField,
      roomTypeName: listQuery.roomTypeName
    }
  })
}

export function createRoomTypeInfo({ roomTypeName, roomTypeMaxLiving, roomTypePrice }) {
  return request({
    url: '/room-type/info',
    method: 'post',
    data: {
      roomTypeName,
      roomTypeMaxLiving,
      roomTypePrice
    }
  })
}

export function updateRoomTypeInfo({ roomTypeId, roomTypeName, roomTypeMaxLiving, roomTypePrice }) {
  return request({
    url: '/room-type/info',
    method: 'patch',
    data: {
      roomTypeId,
      roomTypeName,
      roomTypeMaxLiving,
      roomTypePrice
    }
  })
}
