import { defineStore } from 'pinia'
import { login as loginApi, logout as logoutApi } from '@/api/auth'

const TOKEN_KEY = 'battery_token'
const USER_KEY = 'battery_username'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: sessionStorage.getItem(TOKEN_KEY) || '',
    username: sessionStorage.getItem(USER_KEY) || ''
  }),
  getters: {
    isLoggedIn: (state) => Boolean(state.token)
  },
  actions: {
    async login(username, password) {
      const data = await loginApi({ username, password })
      this.token = data.token
      this.username = data.username
      sessionStorage.setItem(TOKEN_KEY, data.token)
      sessionStorage.setItem(USER_KEY, data.username)
    },
    async logout() {
      try {
        await logoutApi()
      } catch (_) {
        /* 退出失败也不阻塞本地清理 */
      }
      this.token = ''
      this.username = ''
      sessionStorage.removeItem(TOKEN_KEY)
      sessionStorage.removeItem(USER_KEY)
    }
  }
})
