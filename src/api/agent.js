import { axios } from '@/utils/request'
import qs from 'qs'

export function page (parameter) {
  return axios({
    url: '/agent/page?' + qs.stringify(parameter),
    method: 'get'
  })
}

export function list (parameter) {
  return axios({
    url: '/agent/list?' + qs.stringify(parameter),
    method: 'get'
  })
}

export function add (parameter) {
  return axios({
    url: '/agent',
    method: 'post',
    data: parameter
  })
}

export function update (parameter) {
  return axios({
    url: '/agent',
    method: 'put',
    data: parameter
  })
}

export function get (id) {
  return axios({
    url: '/agent/' + id,
    method: 'get'
  })
}

export function remove (id) {
  return axios({
    url: '/agent/' + id,
    method: 'delete'
  })
}
