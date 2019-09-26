import { axios } from '@/utils/request'

export function allTree () {
  return axios({
    url: '/sys/sys-menu/tree',
    method: 'get'
  })
}

export function add (parameter) {
  return axios({
    url: '/sys/sys-menu',
    method: 'post',
    data: parameter
  })
}

export function update (parameter) {
  return axios({
    url: '/sys/sys-menu',
    method: 'put',
    data: parameter
  })
}

export function get (id) {
  return axios({
    url: '/sys/sys-menu/' + id,
    method: 'get'
  })
}

export function remove (id) {
  return axios({
    url: '/sys/sys-menu/' + id,
    method: 'delete'
  })
}
