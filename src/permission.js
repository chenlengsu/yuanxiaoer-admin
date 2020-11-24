import router from './router'
import store from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { Message } from 'element-ui'
import { getToken } from '@/utils/auth' // get token from cookie
import { getAsyncRoutes } from '@/utils/asyncRouter' // get token from cookie
// import { asyncRoutes } from '@/router' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()
  // console.log(hasToken)
  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      const hasGetUserInfo = store.getters.name
      // console.log(hasGetUserInfo)
      // return false
      if (hasGetUserInfo) {
        // console.log(window.sessionStorage.getItem('routePath'))
        // const routePath = window.sessionStorage.getItem('routePath')
        next()
        // if (routePath == null) {
        //   next()
        // } else {
        //   next()
        //   // next({ path: routePath })
        // }
        // next(window.sessionStorage.getItem('routePath'))
      } else {
        try {
          // get user info
          const routers = await store.dispatch('user/getInfo')
          // console.log(routers)
          const accessRoutes = getAsyncRoutes(routers)
          // console.log(accessRoutes)
          // 动态添加格式化过的路由
          router.addRoutes(accessRoutes)
          // console.log(router)
          next({ ...to, replace: true })
          // next()
        } catch (error) {
          next(`/login?redirect=${to.path}`)
          NProgress.done()
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          console.log(error)
          Message.error('Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
