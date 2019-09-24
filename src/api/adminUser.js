import { axios } from '@/utils/request'
import qs from 'qs'

export function list (parameter) {
  return axios({
    url: '/sys/sys-user/page?' + qs.stringify(parameter),
    method: 'get'
  })
}

export function add (parameter) {
  return axios({
    url: '/sys/sys-user',
    method: 'post',
    data: parameter
  })
}

export function update (parameter) {
  return axios({
    url: '/sys/sys-user',
    method: 'put',
    data: parameter
  })
}

export function remove (id) {
  return axios({
    url: '/sys/sys-user/' + id,
    method: 'delete'
  })
}
