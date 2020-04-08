import request from '@/utils/request'

export function login({ username, password, url }) {
  return request({
    url,
    method: 'get',
    params: {
      username,
      password
    }
  })
}

export function getInfo({ url, id }) {
  return request({
    url,
    method: 'get',
    params: {
      id
    }
  })
}
