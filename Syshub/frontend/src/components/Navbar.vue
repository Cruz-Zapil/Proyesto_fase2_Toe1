<template>
  <nav class="bg-white shadow-md sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 py-4">
      <div class="flex justify-between items-center">
        <div class="flex items-center gap-3">
          <button
            v-if="isAdminRoute"
            class="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-blue-200 bg-blue-50 text-blue-700 shadow-sm transition-colors hover:bg-blue-100"
            :aria-label="adminUi.menuOpen ? 'Cerrar menú de administración' : 'Abrir menú de administración'"
            @click="adminUi.toggleMenu()"
          >
            <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <path d="M4 6h16" />
              <path d="M4 12h16" />
              <path d="M4 18h16" />
            </svg>
          </button>

          <!-- Logo -->
          <router-link to="/" class="flex items-center gap-2 group">
            <div class="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Syshub
            </div>
          </router-link>
        </div>

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
          <li>
            <router-link
              to="/articles"
              class="text-gray-700 hover:text-blue-600 transition font-medium"
              :class="{ 'text-blue-600 border-b-2 border-blue-600': isActive('/articles') }"
            >
              Artículos
            </router-link>
          </li>
          <li v-if="showAdminLink">
            <router-link
              to="/admin"
              class="text-gray-700 hover:text-blue-600 transition font-medium"
              :class="{ 'text-blue-600 border-b-2 border-blue-600': isActive('/admin') }"
            >
              Admin
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
              to="/admin"
              v-if="showAdminLink"
              class="text-gray-700 hover:text-blue-600 transition font-medium px-4 py-2 md:hidden"
            >
              Admin
            </router-link>
            <router-link
              to="/my-content"
              v-if="showStudentLinks || showTeacherLinks"
              class="text-gray-700 hover:text-blue-600 transition font-medium px-4 py-2"
            >
              Mi contenido
            </router-link>
            <router-link
              to="/profile"
              v-if="showStudentLinks || showTeacherLinks"
              class="text-gray-700 hover:text-blue-600 transition font-medium px-4 py-2"
            >
              Mi perfil
            </router-link>

            <!-- Mostrar nombre del usuario -->
            <span class="text-sm font-semibold text-gray-800 ml-2" v-if="auth.user?.nombre">
              Hola, {{ auth.user.nombre }}
            </span>

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
import { useAdminUiStore } from '@/stores/adminUiStore'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const adminUi = useAdminUiStore()

// 📍 Ruta activa
const isActive = (path: string) => route.path === path

// 📍 Detectar si estás en admin
const isAdminRoute = computed(() => route.path.startsWith('/admin'))

// ✅ Comprobar vista de estudiante/admin/mod
const showAdminLink = computed(() => auth.isAdmin)
const showStudentLinks = computed(() => auth.roleName === 'estudiante')
const showTeacherLinks = computed(() => auth.roleName === 'docente' || auth.roleName === 'auxiliar')

const isAuthenticated = computed(() => auth.isAuthenticated)

// Scroll opcional
const scrollToSection = (id: string) => {
  const element = document.getElementById(id)
  if (element) element.scrollIntoView({ behavior: 'smooth' })
}

// 🚪 Logout
const handleLogout = () => {
  auth.logout()
  router.push('/')
}
</script>
