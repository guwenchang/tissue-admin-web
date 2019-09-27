import { axios } from '@/utils/request'
import qs from 'qs'

export function page (parameter) {
  return axios({
    url: '/sys/sys-dict/page?' + qs.stringify(parameter),
    method: 'get'
  })
}

export function add (parameter) {
  return axios({
    url: '/sys/sys-dict',
    method: 'post',
    data: parameter
  })
}

export function update (parameter) {
  return axios({
    url: '/sys/sys-dict',
    method: 'put',
    data: parameter
  })
}

export function get (id) {
  return axios({
    url: '/sys/sys-dict/' + id,
    method: 'get'
  })
}

export function remove (id) {
  return axios({
    url: '/sys/sys-dict/' + id,
    method: 'delete'
  })
}
