import { defineRouter } from '#q-app/wrappers'
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from 'vue-router'
import routes from './routes'
import { LocalStorage } from 'quasar'

export default defineRouter(function () {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    history: createHistory(process.env.VUE_ROUTER_BASE),
  })
  Router.beforeEach((to, from, next) => {
    const userRoles = JSON.parse(LocalStorage.getItem('roles')) || [] // 從 localStorage 取得角色
    console.log(userRoles)
    const isAuthenticated = !!LocalStorage.getItem('userId') // 是否已登入
    const requiredRoles = to.meta.roles || [] // 取得路由需要的角色

    // 🔸 檢查是否需要登入
    if (to.meta.requiresAuth) {
      if (!isAuthenticated) {
        return next('/login') // 沒登入，跳轉登入頁
      }

      // 🔸 檢查是否有足夠的權限
      if (requiredRoles.length > 0 && !userRoles.some((role) => requiredRoles.includes(role))) {
        return next('/') // 沒權限，回首頁
      }
    }

    next() // 通過
  })
  return Router
})
