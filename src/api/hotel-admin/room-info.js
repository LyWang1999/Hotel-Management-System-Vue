import request from '@/utils/request'

export function getRoomNumByType() {
  return request({
    url: '/room/spare-num',
    method: 'get'
  })
}
