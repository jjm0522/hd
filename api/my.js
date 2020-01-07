import request from '@/utils/request'

export function getAnswer (params) {
  return request({
    url: '/questionnaire/my?type=test',
    method: 'get',
    params
  })
}

export function getPractice (params) {
  return request({
    url: '/questionnaire/my?type=training',
    method: 'get',
    params
  })
}

export function center () {
  return request({
    url: '/myInfo/center',
    method: 'get'
  })
}

export function info () {
  return request({
    url: '/myInfo/info',
    method: 'get'
  })
}

export function infoEdit (params) {
  return request({
    url: '/myInfo/info',
    method: 'patch',
    params
  })
}

export function myOnlineList (params) {
  return request({
    url: '/onlinealarm/myOnlineList',
    method: 'get',
    params
  })
}

export function myOnlineDetail (id) {
  return request({
    url: '/onlinealarm/myOnlineDetail/' + id,
    method: 'get'
  })
}

export function questionRedPack (params) {
  return request({
    url: '/myInfo/questionRedPack',
    method: 'get',
    params
  })
}

export function onlineRedPack (params) {
  return request({
    url: '/myInfo/onlineRedPack',
    method: 'get',
    params
  })
}

export function resultDetail (params) {
  return request({
    url: '/questionnaire/result_detail',
    method: 'get',
    params
  })
}
