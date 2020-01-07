import request from '../utils/request.js';
// 精彩活动
export function getQuestionList (params) {
  return request({
    url: '/questionnaire/list',
    method: 'get',
    params
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
