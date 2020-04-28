import request from '@/utils/request'

export function getRegisters(listQuery) {
  return request({
    url: '/register/info/page/' + listQuery.page + '/limit/' + listQuery.limit + '/asc/' + listQuery.asc,
    method: 'get',
    params: {
      registerPhone: listQuery.registerPhone,
      registerAccount: listQuery.registerAccount
    }
  })
}

export function createRegisterInfo({ registerPhone, registerAccount, registerPassword, male, registerEmail }) {
  return request({
    url: '/register/info',
    method: 'post',
    data: {
      registerPhone,
      registerAccount,
      registerPassword,
      male,
      registerEmail
    }
  })
}

export function updateRegisterInfo({ registerId, registerPhone, registerAccount, male, registerEmail, memberScore }) {
  return request({
    url: '/register/info',
    method: 'patch',
    data: {
      registerId,
      registerPhone,
      registerAccount,
      male,
      registerEmail,
      memberScore
    }
  })
}

export function deleteRegisterInfo(registerId) {
  return request({
    url: '/register/info',
    method: 'delete',
    data: {
      registerId
    }
  })
}
