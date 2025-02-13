import { defineStore } from 'pinia'
import { LocalStorage } from 'quasar'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isLoggedIn: !!LocalStorage.getItem('token'), // ✅ 讀取 LocalStorage 設定初始值
  }),

  actions: {
    login(token) {
      LocalStorage.set('token', token)
      this.isLoggedIn = true // ✅ 更新狀態
    },
    logout() {
      LocalStorage.remove('token')
      this.isLoggedIn = false // ✅ 更新狀態
    },
  },
})
