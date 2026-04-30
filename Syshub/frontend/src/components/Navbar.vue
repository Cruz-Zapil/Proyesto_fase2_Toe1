<template>
  <nav class="bg-white shadow-md sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 py-4">
      <div class="flex justify-between items-center">
        <!-- Logo -->
        <router-link to="/" class="flex items-center gap-2 group">
          <div class="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Syshub
          </div>
        </router-link>

        <!-- Menu Central -->
        <ul class="hidden md:flex gap-8 items-center">
          <li>
            <router-link
              to="/"
              class="text-gray-700 hover:text-blue-600 transition font-medium"
              :class="{ 'text-blue-600 border-b-2 border-blue-600': isActive('/') }"
            >
              Inicio
            </router-link>
          </li>
          <li>
            <router-link
              to="/projects"
              class="text-gray-700 hover:text-blue-600 transition font-medium"
              :class="{ 'text-blue-600 border-b-2 border-blue-600': isActive('/projects') }"
            >
              Proyectos
            </router-link>
          </li>
          <li>
            <router-link
              to="/forums"
              class="text-gray-700 hover:text-blue-600 transition font-medium"
              :class="{ 'text-blue-600 border-b-2 border-blue-600': isActive('/forums') }"
            >
              Foros
            </router-link>
          </li>
        </ul>

        <!-- Botones de Autenticación -->
        <div class="flex gap-4 items-center">

          <template v-if="!isAuthenticated">
            <router-link
              to="/login"
              class="px-6 py-2 text-blue-600 font-semibold rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition"
            >
              Iniciar Sesión
            </router-link>
            <router-link
              to="/register"
              class="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition shadow-md"
            >
              Registrarse
            </router-link>
          </template>
          <template v-else>
            <router-link
              to="/my-content"
              class="text-gray-700 hover:text-blue-600 transition font-medium px-4 py-2"
            >
              Mi contenido
            </router-link>
            <router-link
              to="/profile"
              class="text-gray-700 hover:text-blue-600 transition font-medium px-4 py-2"
            >
              Mi perfil
            </router-link>
            <button
              @click="handleLogout"
              class="px-4 py-2 text-sm text-gray-600 hover:text-red-600 transition"
            >
              Cerrar sesión
            </button>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'
import { useAuthStore } from '@/stores/authStore'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const isActive = (path: string) => route.path === path

const scrollToSection = (id: string) => {
  const element = document.getElementById(id)
  if (element) element.scrollIntoView({ behavior: 'smooth' })
}

const isAuthenticated = computed(() => !!auth.isAuthenticated)

const handleLogout = () => {
  auth.logout()
  router.push('/')
}
</script>
