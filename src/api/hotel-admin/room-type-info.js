import request from '@/utils/request'

export function getTypes() {
  return request({
    url: '/room-type/types',
    method: 'get'
  })
}
