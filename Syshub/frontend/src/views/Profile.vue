<template>
  <div class="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow mt-8">
    <h1 class="text-2xl font-bold mb-6">Mi Perfil</h1>

    <div v-if="loading" class="text-gray-500">Cargando datos del perfil...</div>

    <div v-else-if="user" class="space-y-6">
      <!-- Datos de solo lectura -->
      <div class="bg-gray-50 p-4 rounded border border-gray-200">
        <h2 class="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Información Académica (Solo lectura)</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-600">Nombres y Apellidos</label>
            <p class="mt-1 text-gray-900">{{ user.nombre }} {{ user.apellidos }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-600">Email Académico</label>
            <p class="mt-1 text-gray-900">{{ user.email }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-600">Registro Académico</label>
            <p class="mt-1 text-gray-900">{{ user.registro_academico || 'N/A' }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-600">Rol Sistema</label>
            <p class="mt-1 text-gray-900 capitalize">{{ auth.roleName || 'Usuario' }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-600">Estado de cuenta</label>
            <p class="mt-1 text-gray-900 capitalize">
              <span class="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                {{ user.estado }}
              </span>
            </p>
          </div>
        </div>
        <p class="text-xs text-gray-500 mt-4 italic">* El nombre, apellidos y rol no pueden ser modificados. Si existe un error, comuníquese con administración.</p>
      </div>

      <!-- Formulario para campos editables -->
      <form @submit.prevent="handleUpdate" class="bg-white p-4 rounded border border-gray-200">
        <h2 class="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Datos de Contacto y Seguridad</h2>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
            <input 
              v-model="editForm.telefono" 
              type="text" 
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
              placeholder="Ej. +502 12345678"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nueva Contraseña (Opcional)</label>
            <input 
              v-model="editForm.password" 
              type="password" 
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
              placeholder="Dejar en blanco para no cambiar"
            />
            <p class="text-xs text-gray-500 mt-1">Mínimo 6 caracteres.</p>
          </div>

          <div v-if="successMsg" class="p-3 bg-green-50 text-green-700 rounded">
            {{ successMsg }}
          </div>
          <div v-if="errorMsg" class="p-3 bg-red-50 text-red-700 rounded">
            {{ errorMsg }}
          </div>

          <button 
            type="submit" 
            :disabled="updating"
            class="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {{ updating ? 'Guardando...' : 'Guardar Cambios' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { updateProfile } from '@/api/users'

const auth = useAuthStore()

const loading = ref(true)
const updating = ref(false)
const user = ref<any>(null)

const editForm = ref({
  telefono: '',
  password: ''
})

const successMsg = ref('')
const errorMsg = ref('')

onMounted(async () => {
  try {
    // Si no ha cargado el usuario, forzamos la carga.
    if (!auth.user) {
      await auth.loadUser()
    }
    user.value = auth.user
    
    // Poblamos el formulario 
    if (user.value) {
      editForm.value.telefono = user.value.telefono || ''
    }
  } catch (err: any) {
    errorMsg.value = err.message || 'Error al cargar perfil'
  } finally {
    loading.value = false
  }
})

const handleUpdate = async () => {
  successMsg.value = ''
  errorMsg.value = ''
  
  // Validaciones locales básicas
  if (editForm.value.password && editForm.value.password.length < 6) {
    errorMsg.value = 'La contraseña debe tener al menos 6 caracteres'
    return
  }

  updating.value = true
  try {
    const payload: any = {}
    if (editForm.value.telefono !== user.value.telefono) {
      payload.telefono = editForm.value.telefono
    }
    if (editForm.value.password) {
      payload.password = editForm.value.password
    }
    
    // Si no hay cambios
    if (Object.keys(payload).length === 0) {
      successMsg.value = 'No hay cambios para guardar'
      updating.value = false
      return
    }

    await updateProfile(user.value.id, payload)
    
    // Actualizamos el estado local sin recargar para no perder UX
    if (payload.telefono) user.value.telefono = payload.telefono
    
    editForm.value.password = ''
    successMsg.value = 'Perfil actualizado exitosamente'
  } catch (err: any) {
    errorMsg.value = err.message || 'Error al actualizar perfil'
  } finally {
    updating.value = false
  }
}
</script>