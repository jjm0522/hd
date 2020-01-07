import request from '@/utils/request'

export function getShare (data) {
  return request({
    url: '/jssdk',
    method: 'post',
    data: data
  })
}
