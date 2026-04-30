<template>
  <nav class="flex gap-4">
    <router-link to="/">Inicio</router-link>

    <!-- 🔐 SOLO SI ESTÁ LOGUEADO -->
    <template v-if="auth.isAuthenticated">
      <router-link to="/projects">Proyectos</router-link>
      <router-link to="/forums">Foros</router-link>
      <router-link to="/profile">Perfil</router-link>
      <router-link to="/my-content">Mi Material</router-link>

      <button @click="auth.logout()">Logout</button>
    </template>

    <!-- 👤 NO LOGUEADO -->
    <template v-else>
      <router-link to="/login">Login</router-link>
      <router-link to="/register">Register</router-link>
    </template>
  </nav>
</template>

<script setup>
import { useAuthStore } from '@/stores/authStore'
const auth = useAuthStore()
</script>

<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore'

const auth = useAuthStore()

const handleLogout = () => {
  auth.logout()
}
</script>