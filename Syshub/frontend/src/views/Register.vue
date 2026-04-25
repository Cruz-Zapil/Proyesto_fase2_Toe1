<template>
  <div class="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
    <h1 class="text-3xl font-bold mb-2">Crear Cuenta</h1>
    <p class="text-gray-600 mb-8">Únete a la comunidad de Syshub</p>

    <form @submit.prevent="handleRegister" class="space-y-6">
      <!-- Full Name -->
      <div>
        <label for="fullname" class="block text-sm font-medium text-gray-700 mb-2">
          Nombre Completo
        </label>
        <input
          id="fullname"
          v-model="formData.fullname"
          type="text"
          required
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          placeholder="Juan Pérez"
        />
      </div>

      <!-- Email -->
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
          Correo Electrónico
        </label>
        <input
          id="email"
          v-model="formData.email"
          type="email"
          required
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          placeholder="tu@email.com"
        />
      </div>

      <!-- Carrera -->
      <div>
        <label for="carrera" class="block text-sm font-medium text-gray-700 mb-2">
          Carrera
        </label>
        <select
          id="carrera"
          v-model="formData.carreraId"
          required
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        >
          <option value="" disabled>
            {{ loadingCarreras ? 'Cargando carreras...' : 'Selecciona tu carrera' }}
          </option>
          <option
            v-for="carrera in carreras"
            :key="carrera.id"
            :value="carrera.id"
          >
            {{ carrera.nombre }}
          </option>
        </select>
      </div>

      <!-- Password -->
      <div>
        <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
          Contraseña
        </label>
        <input
          id="password"
          v-model="formData.password"
          type="password"
          required
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          placeholder="••••••••"
        />
      </div>

      <!-- Confirm Password -->
      <div>
        <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-2">
          Confirmar Contraseña
        </label>
        <input
          id="confirmPassword"
          v-model="formData.confirmPassword"
          type="password"
          required
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          placeholder="••••••••"
        />
      </div>

      <!-- Terms -->
      <div class="flex items-start">
        <input
          id="terms"
          v-model="formData.acceptTerms"
          type="checkbox"
          required
          class="h-4 w-4 text-blue-600 rounded mt-1"
        />
        <label for="terms" class="ml-3 text-sm text-gray-600">
          Acepto los términos y condiciones de Syshub
        </label>
      </div>

      <!-- Submit -->
      <button
        type="submit"
        class="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Crear Cuenta
      </button>
    </form>

    <div class="text-center mt-8">
      <p class="text-gray-600">
        ¿Ya tienes cuenta?
        <router-link to="/login" class="text-blue-600 font-bold hover:underline">
          Iniciar sesión
        </router-link>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { registerUser, getCarreras } from '@/api/auth'

const carreras = ref<{ id: string; nombre: string }[]>([])
const loadingCarreras = ref(false)

const formData = ref({
  fullname: '',
  email: '',
  carreraId: '',   // ← UUID de la carrera seleccionada
  password: '',
  confirmPassword: '',
  acceptTerms: false,
})

onMounted(async () => {
  loadingCarreras.value = true
  try {
    carreras.value = await getCarreras()
  } catch {
    alert('Error al cargar las carreras')
  } finally {
    loadingCarreras.value = false
  }
})

const handleRegister = async () => {
  if (formData.value.password !== formData.value.confirmPassword) {
    alert('Las contraseñas no coinciden')
    return
  }

  try {
    const payload = {
      nombre: formData.value.fullname,
      email: formData.value.email,
      password: formData.value.password,
      carreraId: formData.value.carreraId  // ← UUID al backend
    }
    await registerUser(payload)
    alert('¡Registro exitoso! Ahora puedes iniciar sesión.')
  } catch (err: any) {
    alert(err?.response?.data?.message || 'Error al registrar usuario')
  }
}
</script>