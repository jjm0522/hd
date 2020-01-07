import request from '@/utils/request'
// 个人中心 - 我的战队参加过的赛事√
export function getVersusUserItemActivity (params) {
  return request({
    url: '/versus/user/item_activity',
    method: 'get',
    params
  })
}
// 个人中心 - 参与赛事详情中分数统计 - 团队总分，个人得分√
export function getVersusUserJoinScore (id) {
  return request({
    url: '/versus/user/join/score/' + id,
    method: 'get'
  })
}
// 个人中心 - 我的战队 - 成员列表
export function getVersusUserItem (params) {
  return request({
    url: '/versus/user/item',
    method: 'get',
    params
  })
}
// 个人中心 - 我的战队 - 队长 - 成员申请退队信息列表
export function getVersusUserApplyList (params) {
  return request({
    url: '/versus/user/apply/list',
    method: 'get',
    params
  })
}
// 个人中心 - 我的战队 - 队长 - 同意拒绝成员退出
export function getVersusUserApplyExamine (params) {
  return request({
    url: '/versus/user/apply/examine',
    method: 'patch',
    params
  })
}

// 个人中心 - 我的战队 - 队员 - 申请退出战队
export function getVersusUserApplyOut (params) {
  return request({
    url: '/versus/user/apply/out',
    method: 'post',
    params
  })
}
// 个人中心 - 我的战队 - 队长 - 删除队员
export function getVersusUserCaptainDelUser (params) {
  return request({
    url: '/versus/user/captain/del/user',
    method: 'delete',
    params
  })
}
// 个人中心 - 我的战队 - 队长 - 转移队长
export function getVersusUserCaptainTransfer (params) {
  return request({
    url: '/versus/user/captain/transfer',
    method: 'patch',
    params
  })
}
// 个人中心 - 我参与的赛事列表
export function getVersusJoin (params) {
  return request({
    url: '/versus/user/join',
    method: 'get',
    params
  })
}
// 个人中心 - 我收藏的赛事列表
export function getVersusCollection (params) {
  return request({
    url: '/versus/user/collection',
    method: 'get',
    params
  })
}
