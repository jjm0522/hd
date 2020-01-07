import request from '@/utils/request'
// 队长加入赛事
export function postVersusActivityJoin (id, data) {
  return request({
    url: '/versus/activity/join/' + id,
    method: 'post',
    data
  })
}
// 我要答题 - 获取赛事题目列表
export function getVersusActivityQuestion (id, params) {
  return request({
    url: '/versus/activity/question/' + id,
    method: 'get',
    params
  })
}
// 我要答题 - 提交答题
export function postVersusActivityQuestion (id, data) {
  return request({
    url: '/versus/activity/question/' + id,
    method: 'post',
    data
  })
}
// 加入战队（不包括扫码）
export function postVersusItemJoin (id) {
  return request({
    url: '/versus/item/join/' + id,
    method: 'post'
  })
}

// 赛事详情 - 参与该赛事战队列表
export function VersusActivityItem (id, params) {
  return request({
    url: '/versus/activity/item/' + id,
    method: 'get',
    params
  })
}

// 赛事详情-参加的战队
export function getVersusActivityItem (id, params) {
  return request({
    url: '/versus/activity/item/' + id,
    method: 'get',
    params
  })
}
// 赛事排名 - 某赛事队内队员排名√
export function VersusActivityItemuserRanking (id, params) {
  return request({
    url: '/versus/activity/item_user/ranking/' + id,
    method: 'get',
    params
  })
}
// 赛事排名 - 某赛事个人排名列表√
export function VersusActivityUserRanking (id, params) {
  return request({
    url: '/versus/activity/user/ranking/' + id,
    method: 'get',
    params
  })
}
// 赛事排名 - 某赛事的团队得分排名列表
export function VersusActivityItemRanking (id, params) {
  return request({
    url: '/versus/activity/item/ranking/' + id,
    method: 'get',
    params
  })
}
// 赛事列表
export function getVersusActivityList (params) {
  return request({
    url: '/versus/activity',
    method: 'get',
    params
  })
}
// 赛事列表——收藏
export function postVersusActivityList (id) {
  return request({
    url: '/versus/collection/' + id,
    method: 'post'
  })
}

// 赛事详情
export function getVersusActivity (id) {
  return request({
    url: '/versus/activity/' + id,
    method: 'get'
  })
}
// 赛事详情-统计
export function getVersusActivityStatistics (id) {
  return request({
    url: '/versus/activity/statistics/' + id,
    method: 'get'
  })
}

export function getQuestion (id) {
  return request({
    url: '/questionnaire/get/' + id,
    method: 'get'
  })
}

export function questionSubmit (params, id) {
  return request({
    url: '/questionnaire/submit/' + id,
    method: 'post',
    params
  })
}

export function getCList () {
  return request({
    url: '/questionnaire/c_list',
    method: 'get'
  })
}

export function getTraining (params) {
  return request({
    url: '/questionnaire/get_training',
    method: 'post',
    params
  })
}

export function submitTraining (params) {
  return request({
    url: '/questionnaire/submit_training',
    method: 'post',
    params
  })
}

export function getResult (id) {
  return request({
    url: '/questionnaire/result/' + id,
    method: 'get'
  })
}

export function infoDetail (id) {
  return request({
    url: '/questionnaire/info_detail/' + id,
    method: 'get'
  })
}
