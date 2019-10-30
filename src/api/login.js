import { axios } from '@/utils/request'

export function login (parameter) {
  return axios({
    url: '/auth/login',
    method: 'post',
    data: parameter
  })
}

export function changePwd (parameter) {
  return axios({
    url: '/auth/changePassword',
    method: 'post',
    data: parameter
  })
}

export function getInfo () {
  return axios({
    url: '/auth/info',
    method: 'get'
  })
}

export function getMenus () {
  return axios({
    url: '/auth/perms',
    method: 'get'
  })
}

export function logout () {
  return axios({
    url: '/auth/logout',
    method: 'get'
  })
}
