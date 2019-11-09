// eslint-disable-next-line
import * as loginService from '@/api/login'
// eslint-disable-next-line
import { BasicLayout, RouteView, BlankLayout, PageView } from '@/layouts'

// 前端路由表
const constantRouterComponents = {
  // 基础页面 layout 必须引入
  BasicLayout: BasicLayout,
  BlankLayout: BlankLayout,
  RouteView: RouteView,
  PageView: PageView,
  '403': () => import(/* webpackChunkName: "error" */ '@/views/exception/403'),
  '404': () => import(/* webpackChunkName: "error" */ '@/views/exception/404'),
  '500': () => import(/* webpackChunkName: "error" */ '@/views/exception/500'),

  // 业务统计
  'Analysis': () => import('@/views/dashboard/Analysis'),
  // 系统设置
  'AdminRole': () => import('@/views/admin/role/Role'),
  'AdminMenu': () => import('@/views/admin/menu/Menu'),
  'AdminDict': () => import('@/views/admin/dict/Dict'),
  'AdminLog': () => import('@/views/admin/opLog/Log'),
  'AdminTag': () => import('@/views/admin/tag/Tag'),

  // 用户管理
  'AdminUser': () => import('@/views/admin/user/User'),

  // 广告管理
  'AdMaterial': () => import('@/views/ad/material/Material'),
  'AdTemplate': () => import('@/views/ad/adTemplate/AdTemplate'),

  // 代理商管理
  'Agent': () => import('@/views/agent/Agent'),

  // 机构管理
  'Place': () => import('@/views/place/Place'),
  // 设备管理
  'Device': () => import('@/views/device/Device'),
  // 订单管理 订单列表
  'Order': () => import('@/views/order/Order'),
  // 订单管理 扫码列表
  'Scan': () => import('@/views/order/Scan')
}

// 前端未找到页面路由（固定不用改）
const notFoundRouter = {
  path: '*', redirect: '/404', hidden: true
}

// 根级菜单
const rootRouter = {
  key: '',
  name: 'index',
  title: '首页',
  path: '/',
  component: 'BasicLayout',
  redirect: '/analysis',
  children: []
}

/**
 * 动态生成菜单
 * @param token
 * @returns {Promise<Router>}
 */
export const generatorDynamicRouter = () => {
  return new Promise((resolve, reject) => {
    loginService.getMenus().then(res => {
      const result = res.data
      const menuNav = []
      //      后端数据, 根级树数组,  根级 PID
      // listToTree(result, childrenNav, 0)
      rootRouter.children = result
      menuNav.push(rootRouter)
      const routers = generator(menuNav)
      routers.push(notFoundRouter)
      resolve(routers)
    }).catch(err => {
      reject(err)
    })
  })
}

/**
 * 格式化树形结构数据 生成 vue-router 层级路由表
 *
 * @param routerMap
 * @param parent
 * @returns {*}
 */
export const generator = (routerMap, parent) => {
  return routerMap.map(item => {
    const { show, hideChildren, hiddenHeaderContent, target } = item.meta || {}
    const currentRouter = {
      // 如果路由设置了 path，则作为默认 path，否则 路由地址 动态拼接生成如 /dashboard/workplace
      path: item.path || `${parent && parent.path || ''}/${item.key}`,
      // 路由名称，建议唯一
      name: item.name || '',
      // 该路由对应页面的 组件 :方案1
      component: constantRouterComponents[item.component],
      // 该路由对应页面的 组件 :方案2 (动态加载)
      // component: constantRouterComponents[item.component || item.key] || () => import(`@/views/${item.component}`),

      // meta: 页面标题, 菜单图标, 页面权限(供指令权限用，可去掉)
      meta: { title: item.title, icon: item.icon || undefined, hiddenHeaderContent: hiddenHeaderContent, target: target, permission: item.permission }
    }
    // 是否设置了隐藏菜单
    if (show === false) {
      currentRouter.hidden = true
    }
    // 是否设置了隐藏子菜单
    if (hideChildren) {
      currentRouter.hideChildrenInMenu = true
    }
    // 为了防止出现后端返回结果不规范，处理有可能出现拼接出两个 反斜杠
    if (!currentRouter.path.startsWith('http')) {
      currentRouter.path = currentRouter.path.replace('//', '/')
    }
    // 重定向
    item.redirect && (currentRouter.redirect = item.redirect)
    // 是否有子菜单，并递归处理
    if (item.children && item.children.length > 0) {
      // Recursion
      currentRouter.children = generator(item.children, currentRouter)
    }
    return currentRouter
  })
}
