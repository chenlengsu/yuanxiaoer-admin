import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      // hidden: true,
      path: 'dashboard',
      name: '首页',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },
  {
    path: '/company',
    component: Layout,
    redirect: '/company',
    name: '公司项目',
    meta: { title: '公司项目', icon: 'tree' },
    children: [{
      path: '',
      name: '公司项目',
      component: () => import('@/views/company/index'),
      meta: { title: '公司项目', icon: 'company', x: 0, y: 0, keepAlive: true }
    }, {
      path: '/company/menu',
      name: '菜单相关',
      component: () => import('@/views/company/menu/index'),
      meta: { title: '菜单配置', icon: 'menu', keepAlive: false, activeMenu: '/company' },
      hidden: true
    }, {
      path: '/company/role',
      name: '角色管理',
      component: () => import('@/views/company/role/index'),
      meta: { title: '角色管理', icon: 'role', keepAlive: false, activeMenu: '/company' },
      hidden: true
    }]
  },
  // {
  //   path: '/company/menu',
  //   component: Layout,
  //   redirect: '/company/menu',
  //   children: [{
  //     path: '',
  //     name: '项目菜单',
  //     component: () => import('@/views/company/menu/index'),
  //     meta: { title: '菜单', icon: 'company' }
  //   }]
  // },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
