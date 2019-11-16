import { axios } from '@/utils/request'

export function total (parameter) {
  return axios({
    url: '/statistics/total',
    method: 'post',
    data: parameter
  })
}

export function scan (parameter) {
  return axios({
    url: '/statistics/scan',
    method: 'post',
    data: parameter
  })
}

export function sale (parameter) {
  return axios({
    url: '/statistics/sale',
    method: 'post',
    data: parameter
  })
}
