import { baseUrl } from '../config/index.js'

export default (options = { method: 'GET', data: {} }) => {
  // const access_token = uni.getStorageSync('access_token')
  const access_token =
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vaGR6aGFuZHVpLnRqYjJjLmNuL2FwaS90ZXN0X2xvZ2luIiwiaWF0IjoxNTc4MzYyODcxLCJleHAiOjE1ODEzNjI4NzEsIm5iZiI6MTU3ODM2Mjg3MSwianRpIjoiZHM1ZVY5TFdBTU5UTEJQeSIsInN1YiI6NDksInBydiI6IjNkMzY5YTdjNjRkNThiMTdkMGFiYjk4MDY2NTE3Y2I3MDYwZjlkYmYifQ.CdeBVZaktYtYmsnir8YcyBbolJcnXE0Ly8f-BtLtL_s'
  return uni.request({
    url: baseUrl + options.url,
    data: options.data,
    header: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${access_token}`
    },
    method: options.method.toUpperCase()
  }).then(res => {
	  console.log(res)
    const { statusCode, data, header } = res[1]

    if (header && header.Authorization) {
      uni.setStorageSync(
        'access_token',
        header.Authorization.split(' ')[1]
      )
    }

    switch (statusCode) {
      case 401: {
        uni.removeStorageSync('access_token')
        return
      }
      case 400: {
        if (data.message == '服务器繁忙，请稍候重试') {
          // return uni.redirectTo({
          //   url: `/pages/errorPage/index?code=${statusCode}`
          // })
        }
        break
      }
      case 500:
      case 404: {
        // return uni.redirectTo({
        //   url: `/pages/errorPage/index?code=${statusCode}`
        // })
      }
    }

    return data
  })
}
