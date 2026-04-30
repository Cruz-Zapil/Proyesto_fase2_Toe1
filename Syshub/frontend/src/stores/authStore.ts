import { defineStore } from 'pinia'
import { ref } from 'vue'
import { login as apiLogin } from '../api/auth'
import { getMe } from '../api/users'
import { l } from 'node_modules/vite/dist/node/types.d-aGj9QkWt'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<any>(null)
  const token = ref<string | null>(localStorage.getItem('token'))

  const isAuthenticated = ref(!!token.value)

  // 🔐 LOGIN REAL
  async function login(email: string, password: string) {
    const data = await apiLogin(email, password)

    if (!data.access_token) {
      throw new Error('Credenciales incorrectas')
    }

    token.value = data.access_token
    localStorage.setItem('token', data.access_token)

    user.value = data.user
    isAuthenticated.value = true
  }

  // 👤 TRAER USUARIO DESDE BACKEND
  async function loadUser() {
    if (!token.value) return

    try {
      user.value = await getMe()
      isAuthenticated.value = true
    } catch (error) {
      logout()
    }
  }

  // 🚪 LOGOUT
  function logout() {
    token.value = null
    user.value = null
    isAuthenticated.value = false
    localStorage.removeItem('token')
  }




  return {
    user,
    token,
    isAuthenticated,
    login,
    loadUser,
    logout,
  }
})