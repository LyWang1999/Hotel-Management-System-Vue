import request from '@/utils/request'

export function getRoomNumByType() {
  return request({
    url: '/room/empty-num',
    method: 'get'
  })
}

export function getRooms(listQuery) {
  return request({
    url: '/room/info/page/' + listQuery.page + '/limit/' + listQuery.limit + '/asc/' + listQuery.asc,
    method: 'get',
    params: {
      roomNo: listQuery.roomNo,
      roomTypeName: listQuery.roomTypeName,
      empty: listQuery.empty
    }
  })
}

export function createRoomInfo({ roomNo, roomTypeName, roomDetail }) {
  return request({
    url: '/room/info',
    method: 'post',
    data: {
      roomNo,
      roomTypeName,
      roomDetail
    }
  })
}

export function updateRoomInfo({ roomId, roomTypeName, roomNo, roomDetail, empty }) {
  return request({
    url: '/room/info',
    method: 'patch',
    data: {
      roomId,
      roomNo,
      roomTypeName,
      roomDetail,
      empty
    }
  })
}

export function deleteRoomInfo(roomId) {
  return request({
    url: '/room/info',
    method: 'delete',
    data: {
      roomId
    }
  })
}
