import { axios } from '@/utils/request'
import qs from 'qs'

export function page (parameter) {
  return axios({
    url: '/sys/sys-log/page?' + qs.stringify(parameter),
    method: 'get'
  })
}

export function get (id) {
  return axios({
    url: '/sys/sys-log/' + id,
    method: 'get'
  })
}

export function remove (id) {
  return axios({
    url: '/sys/sys-log/' + id,
    method: 'delete'
  })
}
