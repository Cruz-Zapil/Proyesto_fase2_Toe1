import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Projects from '@/views/Projects.vue'
import Forums from '@/views/Forums.vue'
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/projects', component: Projects, meta: { requiresAuth: true } },
  { path: '/forums', component: Forums, meta: { requiresAuth: true } },
  { path: '/login', component: Login },
  { path: '/register', component: Register }
]

const router = createRouter({
  history: createWebHistory('/'),
  routes
})

// Guard global para proteger rutas
import { useAuthStore } from '@/stores/authStore'
router.beforeEach((to, from, next) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})

export default router
