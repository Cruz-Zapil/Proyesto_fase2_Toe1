<template>
  <div class="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow">
    <h1 class="text-2xl font-bold mb-6">Mi Perfil</h1>

    <div v-if="loading">Cargando...</div>

    <div v-else>
      <p><strong>Nombre:</strong> {{ user.nombre }} {{ user.apellidos }}</p>
      <p><strong>Email:</strong> {{ user.email }}</p>
      <p><strong>Estado:</strong> {{ user.estado }}</p>
      <p><strong>Rol:</strong> {{ user.rolId }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/authStore'

const auth = useAuthStore()

const loading = ref(true)
const user = ref<any>(null)

onMounted(async () => {
  try {
    await auth.fetchUser()
    user.value = auth.user
  } finally {
    loading.value = false
  }
})
</script>