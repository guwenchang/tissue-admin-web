import Vue from 'vue'
import axios from 'axios'
import router from '@/router'

import {
  VueAxios
} from './axios'
import notification from 'ant-design-vue/es/notification'
import {
  ACCESS_TOKEN
} from '@/store/mutation-types'

// 创建 axios 实例
const service = axios.create({
  baseURL: '/api', // api base_url
  timeout: 6000 // 请求超时时间
})

const err = (error) => {
  if (error.response) {
    if (error.response.status !== 200) {
      notification.error({
        message: '服务器错误',
        description: error.response.data.msg
      })
    }
  }
  return Promise.reject(error)
}

// request interceptor
service.interceptors.request.use(config => {
  const token = Vue.ls.get(ACCESS_TOKEN)
  if (token) {
    config.headers['Access-Token'] = token // 让每个请求携带自定义 token 请根据实际情况自行修改
  }
  return config
}, err)

// response interceptor
service.interceptors.response.use((response) => {
  if (response.data.code !== 0) {
    if (response.data.code === 401) {
      router.push({ path: '/user/login' })
    } else {
      notification.error({
        message: '服务器错误',
        description: response.data.msg
      })
      // eslint-disable-next-line prefer-promise-reject-errors
      return Promise.reject('server error')
    }
  } else {
    return response.data
  }
}, err)

const installer = {
  vm: {},
  install (Vue) {
    Vue.use(VueAxios, service)
  }
}

export {
  installer as VueAxios,
  service as axios
}
