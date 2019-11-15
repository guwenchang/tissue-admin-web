import { axios } from '@/utils/request'
import qs from 'qs'

export function page (parameter) {
  return axios({
    url: '/ad/merchant/page?' + qs.stringify(parameter),
    method: 'get'
  })
}

export function list (parameter) {
  return axios({
    url: '/ad/merchant/list?' + qs.stringify(parameter),
    method: 'get'
  })
}

export function add (parameter) {
  return axios({
    url: '/ad/merchant',
    method: 'post',
    data: parameter
  })
}

export function update (parameter) {
  return axios({
    url: '/ad/merchant',
    method: 'put',
    data: parameter
  })
}

export function get (id) {
  return axios({
    url: '/ad/merchant/' + id,
    method: 'get'
  })
}

export function remove (id) {
  return axios({
    url: '/ad/merchant/' + id,
    method: 'delete'
  })
}
