import { axios } from '@/utils/request'

export function getUploadToken (key) {
  return axios({
    url: '/common/uploadToken?key=' + key,
    method: 'get'
  })
}
