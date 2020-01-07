import request from '@/utils/request'
// 案发时间
export function storeOnlineAlarm (params) {
  return request({
    url: '/onlinealarm/storeOnlineAlarm',
    method: 'post',
    params
  })
}
