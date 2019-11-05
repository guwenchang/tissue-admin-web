import { axios } from '@/utils/request'
import qs from 'qs'

export function page (parameter) {
  return axios({
    url: '/device/page?' + qs.stringify(parameter),
    method: 'get'
  })
}

export function list (parameter) {
  return axios({
    url: '/device/list?' + qs.stringify(parameter),
    method: 'get'
  })
}

export function update (parameter) {
  return axios({
    url: '/device',
    method: 'put',
    data: parameter
  })
}

export function get (id) {
  return axios({
    url: '/device/' + id,
    method: 'get'
  })
}

export function remove (id) {
  return axios({
    url: '/device/' + id,
    method: 'delete'
  })
}
