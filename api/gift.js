import Request from '../utils/request';

// export function getGiftList (params) {
//   return request({
//     url: '/welfare',
//     method: 'get',
//     params
//   })
// }
// 网友福利
export const getGiftList = data => Request({
  url: `/welfare`,
  method: 'GET',
  data,
});
