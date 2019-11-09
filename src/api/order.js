import { axios } from '@/utils/request'
import qs from 'qs'

export function page (parameter) {
  return axios({
    url: '/order/page?' + qs.stringify(parameter),
    method: 'get'
  })
}

export function get (id) {
  return axios({
    url: '/order/' + id,
    method: 'get'
  })
}
