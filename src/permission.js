import router from './router'
import store from './store'
import storage from 'store'
import NProgress from 'nprogress' // progress bar
import '@/components/NProgress/nprogress.less' // progress bar custom style
import notification from 'ant-design-vue/es/notification'
import { setDocumentTitle, domTitle } from '@/utils/domUtil'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { i18nRender } from '@/locales'
import { whiteList } from '@/config/defaultSettings'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

// 系统登陆页面的路由
const loginRoutePath = '/user/login'
//系统默认主页的路由
const defaultRoutePath = '/dashboard/workplace'

/**
 * @description 系统级路由守卫（拦截器）-在从一个路由前往另一个路由前触发
 * @param to :即将前往的路由
 * @param from: 当前正要离开的路由
 * @param next 进入下一个路由的钩子
 */
router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar
  
  // 如果to.meta为空，则返回to.meta,否则如果to.meta.title不等于undefined,则返回{to.meta.title-domTitle}作为浏览器的tab页面标题；
  to.meta && (typeof to.meta.title !== 'undefined' && setDocumentTitle(`${i18nRender(to.meta.title)} - ${domTitle}`))
  /* 如果存在Token */
  if (storage.get(ACCESS_TOKEN)) {
    // 如果即将进入的是登录页，则直接进入到系统的默认主页；
    if (to.path === loginRoutePath) {
      next({ path: defaultRoutePath })
      NProgress.done()
    } else {
      // 检查用户的角色为null；
      if (store.getters.roles.length === 0) {
        // 请求用户信息
        store
          .dispatch('GetInfo')
          .then(res => {
            const roles = res.result && res.result.role // 如果没有结果，则roles为空，否则，为用户的role信息；
            // 根据roles权限生成可访问的路由表
            store.dispatch('GenerateRoutes', { roles }).then(() => {
              // 动态添加可访问路由表
              router.addRoutes(store.getters.addRouters)
              // 请求带有 redirect 重定向时，登录自动重定向到该地址
              const redirect = decodeURIComponent(from.query.redirect || to.path)
              if (to.path === redirect) {
                // set the replace: true so the navigation will not leave a history record
                next({ ...to, replace: true })
              } else {
                // 跳转到目的路由
                next({ path: redirect })
              }
            })
          })
          .catch(() => {
            notification.error({
              message: '错误',
              description: '请求用户信息失败，请重试'
            })
            // 获取用户信息失败时，清空历史保留信息,调用登出
            store.dispatch('Logout').then(() => {
              next({ path: loginRoutePath, query: { redirect: to.fullPath } })
            })
          })
      } else {
        next()
      }
    }
  } else {
    if (whiteList.includes(to.name)) {
      // 在免登录白名单，直接进入
      next()
    } else {
      next({ path: loginRoutePath, query: { redirect: to.fullPath } })
      NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
    }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
