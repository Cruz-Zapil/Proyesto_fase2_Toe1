<template>
  <div class="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
    <h1 class="text-3xl font-bold mb-2">Iniciar Sesión</h1>
    <p class="text-gray-600 mb-8">Accede a tu cuenta de Syshub</p>

    <form @submit.prevent="handleLogin" class="space-y-6">
      <!-- Email -->
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
          Correo Electrónico
        </label>
        <input id="email" v-model="formData.email" type="email" required
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          placeholder="tu@email.com" />
      </div>

      <!-- Password -->
      <div>
        <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
          Contraseña
        </label>
        <input id="password" v-model="formData.password" type="password" required
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          placeholder="••••••••" />
      </div>

      <!-- Remember me -->
      <div class="flex items-center">
        <input id="remember" v-model="formData.rememberMe" type="checkbox" class="h-4 w-4 text-blue-600 rounded" />
        <label for="remember" class="ml-2 text-sm text-gray-600">
          Recuérdame
        </label>
      </div>

      <!-- Submit Button -->
      <button type="submit"
        class="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors">
        Iniciar Sesión
      </button>

      <p v-if="error" class="text-red-500 text-sm text-center">
        {{ error }}
      </p>
    </form>

    <!-- Divider -->
    <div class="my-8 flex items-center">
      <div class="flex-grow border-t border-gray-300"></div>
      <span class="px-4 text-gray-500 text-sm">o</span>
      <div class="flex-grow border-t border-gray-300"></div>
    </div>

    <!-- Social Login (Placeholder) -->
    <button
      class="w-full bg-gray-100 text-gray-800 font-semibold py-3 rounded-lg hover:bg-gray-200 transition-colors mb-4">
      Continuar con Google
    </button>

    <!-- Sign Up Link -->
    <div class="text-center mt-8">
      <p class="text-gray-600">
        ¿No tienes cuenta?
        <router-link to="/register" class="text-blue-600 font-bold hover:underline">
          Registrarse
        </router-link>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

const formData = ref({
  email: '',
  password: '',
  rememberMe: false
})

const error = ref('')

const handleLogin = async () => {
  try {
   
    await authStore.login(
      formData.value.email,
      formData.value.password
    )

    router.push('/')
  } catch (err: any) {
    alert('Error al iniciar sesión: ' + (err.response?.data?.message || err.message))
  }
}
</script>