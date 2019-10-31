import { axios } from '@/utils/request'
import qs from 'qs'

export function page (parameter) {
  return axios({
    url: '/ad/material/page?' + qs.stringify(parameter),
    method: 'get'
  })
}

export function add (parameter) {
  return axios({
    url: '/ad/material',
    method: 'post',
    data: parameter
  })
}

export function update (parameter) {
  return axios({
    url: '/ad/material',
    method: 'put',
    data: parameter
  })
}

export function get (id) {
  return axios({
    url: '/ad/material/' + id,
    method: 'get'
  })
}

export function remove (id) {
  return axios({
    url: '/ad/material/' + id,
    method: 'delete'
  })
}
