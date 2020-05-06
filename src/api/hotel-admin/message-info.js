import request from '@/utils/request'
import { parseTime } from '@/utils'

export function getMessages(listQuery) {
  return request({
    url: '/message/info/page/' + listQuery.page + '/limit/' + listQuery.limit + '/asc/' + listQuery.asc,
    method: 'get',
    params: {
      beginDate: listQuery.beginDate,
      endDate: listQuery.endDate,
      sortFiled: listQuery.sortFiled
    }
  })
}

export function createMessageInfo({ messageTitle, messageContent }) {
  return request({
    url: '/message/info',
    method: 'post',
    data: {
      messageTitle,
      messageContent,
      messageSendTime: parseTime(new Date(), '{y}-{m}-{d} {h}:{i}:{s}')
    }
  })
}

export function updateMessageInfo({ messageId, messageTile, messageContent }) {
  return request({
    url: '/message/info',
    method: 'patch',
    data: {
      messageId,
      messageTile,
      messageContent
    }
  })
}

export function deleteMessageInfo(messageId) {
  return request({
    url: '/message/info',
    method: 'delete',
    data: {
      messageId
    }
  })
}
