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

  // 你需要动态引入的页面组件
  'Workplace': () => import('@/views/dashboard/Workplace'),
  'Analysis': () => import('@/views/dashboard/Analysis'),
  // form
  'BasicForm': () => import('@/views/form/BasicForm'),
  'StepForm': () => import('@/views/form/stepForm/StepForm'),
  'AdvanceForm': () => import('@/views/form/advancedForm/AdvancedForm'),

  // list
  'TableList': () => import('@/views/list/TableList'),
  'StandardList': () => import('@/views/list/StandardList'),
  'CardList': () => import('@/views/list/CardList'),
  'SearchLayout': () => import('@/views/list/search/SearchLayout'),
  'SearchArticles': () => import('@/views/list/search/Article'),
  'SearchProjects': () => import('@/views/list/search/Projects'),
  'SearchApplications': () => import('@/views/list/search/Applications'),
  'ProfileBasic': () => import('@/views/profile/basic/Index'),
  'ProfileAdvanced': () => import('@/views/profile/advanced/Advanced'),

  // result
  'ResultSuccess': () => import(/* webpackChunkName: "result" */ '@/views/result/Success'),
  'ResultFail': () => import(/* webpackChunkName: "result" */ '@/views/result/Error'),

  // exception
  'Exception403': () => import(/* webpackChunkName: "fail" */ '@/views/exception/403'),
  'Exception404': () => import(/* webpackChunkName: "fail" */ '@/views/exception/404'),
  'Exception500': () => import(/* webpackChunkName: "fail" */ '@/views/exception/500'),

  // account
  'AccountCenter': () => import('@/views/account/center/Index'),
  'AccountSettings': () => import('@/views/account/settings/Index'),
  'BaseSettings': () => import('@/views/account/settings/BaseSetting'),
  'SecuritySettings': () => import('@/views/account/settings/Security'),
  'CustomSettings': () => import('@/views/account/settings/Custom'),
  'BindingSettings': () => import('@/views/account/settings/Binding'),
  'NotificationSettings': () => import('@/views/account/settings/Notification'),

  // 系统设置
  'AdminUser': () => import('@/views/admin/user/User'),
  'AdminRole': () => import('@/views/admin/role/Role'),
  'AdminMenu': () => import('@/views/admin/menu/Menu'),
  'AdminDict': () => import('@/views/admin/dict/Dict'),
  'AdminLog': () => import('@/views/admin/opLog/Log')

}

// 前端未找到页面路由（固定不用改）
const notFoundRouter = {
  path: '*', redirect: '/404', hidden: true
}

// 根级菜单
const rootRouter = {
  key: '',
  name: '首页',
  path: '',
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
      console.log('res', res)
      const result = res.data
      const menuNav = []
      //      后端数据, 根级树数组,  根级 PID
      // listToTree(result, childrenNav, 0)
      rootRouter.children = result
      menuNav.push(rootRouter)
      console.log('menuNav', menuNav)
      const routers = generator(menuNav)
      routers.push(notFoundRouter)
      console.log('routers', routers)
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
      name: item.component || item.key || '',
      // 该路由对应页面的 组件 :方案1
      component: constantRouterComponents[item.component || item.key],
      // 该路由对应页面的 组件 :方案2 (动态加载)
      // component: constantRouterComponents[item.component || item.key] || () => import(`@/views/${item.component}`),

      // meta: 页面标题, 菜单图标, 页面权限(供指令权限用，可去掉)
      meta: { title: item.name, icon: item.icon || undefined, hiddenHeaderContent: hiddenHeaderContent, target: target, permission: item.permission }
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
