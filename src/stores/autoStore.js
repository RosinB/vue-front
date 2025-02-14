import { defineStore } from 'pinia'
import { LocalStorage } from 'quasar'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isLoggedIn: !!LocalStorage.getItem('token'), // ✅ 讀取 LocalStorage 設定初始值
    roles: JSON.parse(LocalStorage.getItem('roles') || '[]'), // ✅ 讀取 LocalStorage
  }),
  getters: {
    hasRole: (state) => (role) => state.roles.includes(role), // ✅ 角色檢查函式
  },
  actions: {
    login(token, roles) {
      LocalStorage.set('token', token)
      LocalStorage.set('roles', JSON.stringify(roles)) // ✅ 存入 LocalStorage
      this.isLoggedIn = true // ✅ 更新狀態
      this.roles = roles // ✅ 更新 Pinia 狀態
    },
    logout() {
      LocalStorage.remove('token')
      LocalStorage.remove('roles') // ✅ 清除角色資訊

      this.isLoggedIn = false // ✅ 更新狀態
      this.roles = []
    },
  },
})
