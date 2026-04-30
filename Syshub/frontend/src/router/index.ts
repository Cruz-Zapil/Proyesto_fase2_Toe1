import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Projects from '@/views/Projects.vue'
import Forums from '@/views/Forums.vue'
import Login from '@/views/Identidad/Login.vue'
import Register from '@/views/Identidad/Register.vue'
import Profile from '@/views/Profile.vue'
import MyContent from '@/views/MyContent.vue'

const routes = [
  { path: '/', component: Home },

  // 🔐 privadas
  { path: '/projects', component: Projects, meta: { requiresAuth: true } },
  { path: '/forums', component: Forums, meta: { requiresAuth: true } },
  { path: '/profile', component: Profile, meta: { requiresAuth: true } },
  { path: '/my-content', component: MyContent, meta: { requiresAuth: true } },

  // públicas
  { path: '/login', component: Login },
  { path: '/register', component: Register }
]

const router = createRouter({
  history: createWebHistory('/'),
  routes
})

import { useAuthStore } from '@/stores/authStore'

router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore()

  // 🔥 si hay token pero no user → cargar usuario
  if (auth.token && !auth.user) {
    await auth.loadUser()
  }

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})

export default router