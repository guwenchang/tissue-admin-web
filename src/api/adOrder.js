import { axios } from '@/utils/request'
import qs from 'qs'

export function page (parameter) {
  return axios({
    url: '/ad/order/page?' + qs.stringify(parameter),
    method: 'get'
  })
}

export function add (parameter) {
  return axios({
    url: '/ad/order',
    method: 'post',
    data: parameter
  })
}

export function update (parameter) {
  return axios({
    url: '/ad/order',
    method: 'put',
    data: parameter
  })
}

export function get (id) {
  return axios({
    url: '/ad/order/' + id,
    method: 'get'
  })
}

export function remove (id) {
  return axios({
    url: '/ad/order/' + id,
    method: 'delete'
  })
}
