import { axios } from '@/utils/request'
import qs from 'qs'

export function page (parameter) {
  return axios({
    url: '/sys/sys-menu/page?' + qs.stringify(parameter),
    method: 'get'
  })
}

export function list (parameter) {
  return axios({
    url: '/sys/sys-menu/list?' + qs.stringify(parameter),
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
