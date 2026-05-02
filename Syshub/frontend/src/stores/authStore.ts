import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login as apiLogin } from '../api/auth'
import { getMe } from '../api/users'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<any>(null)
  const token = ref<string | null>(localStorage.getItem('token'))

  // ✅ Mejor como computed (siempre sincronizado con token)
  const isAuthenticated = computed(() => !!token.value)

  // 🧠 Obtener nombre de rol de forma segura
  const roleName = computed(() => {
    const rawRole =
      user.value?.rolNombre ||
      user.value?.rol?.nombre ||
      user.value?.rol ||
      ''

    return String(rawRole).trim().toLowerCase()
  })

  // 🔐 Saber si es admin
  const isAdmin = computed(() => {
    return user.value?.esAdmin === true ||
           roleName.value === 'admin' ||
           roleName.value.includes('administrador')
  })

  // 🔐 Saber si es moderador
  const isModerator = computed(() => {
    return roleName.value === 'moderador' ||
           roleName.value.includes('moderador')
  })

  // 🔐 LOGIN
  async function login(email: string, password: string) {
    const data = await apiLogin(email, password)

    if (!data.access_token) {
      throw new Error('Credenciales incorrectas')
    }

    token.value = data.access_token
    localStorage.setItem('token', data.access_token)

    await loadUser()
  }

  // 👤 Cargar usuario desde backend
  async function loadUser() {
    if (!token.value) return

    try {
      const profile = await getMe()

      if (!profile?.id) {
        throw new Error('Perfil inválido')
      }

      // Fallback: algunos despliegues no devuelven rolNombre en /users/me
      if (profile && !profile.rolNombre && profile.id) {
        try {
          const { getAllAdminUsers } = await import('../api/admin')
          const users = await getAllAdminUsers()
          const current = Array.isArray(users)
            ? users.find((u: any) => u.id === profile.id)
            : null

          if (current?.rolNombre) {
            profile.rolNombre = current.rolNombre
          }
        } catch {
          // ignorar si no tiene permisos
        }
      }

      user.value = profile
    } catch (error) {
      logout()
    }
  }

  // 🚪 LOGOUT
  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
  }

  return {
    user,
    token,
    isAuthenticated,
    roleName,
    isAdmin,
    isModerator,
    login,
    loadUser,
    logout,
  }
})