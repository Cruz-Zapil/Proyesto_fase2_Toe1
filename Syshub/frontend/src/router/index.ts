import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Projects from '@/views/Projects.vue'
import Forums from '@/views/Forums.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/projects', component: Projects },
  { path: '/forums', component: Forums }
]

export default createRouter({
  history: createWebHistory('/'),
  routes
})
