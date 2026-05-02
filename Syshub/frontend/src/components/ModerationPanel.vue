<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-bold text-gray-800">Contenido Oculto</h2>
      <button @click="loadData" class="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-2">
        <span>🔄</span> Actualizar
      </button>
    </div>

    <div v-if="loading" class="text-center py-10">Cargando...</div>
    <div v-else-if="!items.length" class="text-center py-10 text-gray-500 bg-gray-50 rounded-xl border border-gray-100">No hay contenido oculto por revisar.</div>
    <div v-else class="grid grid-cols-1 gap-4">
      <div v-for="item in items" :key="item.reporte_id" class="bg-white rounded-xl shadow-sm border border-red-100 p-5">
        <div class="flex justify-between items-start gap-4">
          <div>
            <div class="flex items-center gap-2 mb-2">
              <span class="px-2 py-1 text-xs rounded uppercase font-semibold tracking-wider" 
                    :class="{
                      'bg-purple-100 text-purple-700': item.tipo_contenido === 'proyecto',
                      'bg-blue-100 text-blue-700': item.tipo_contenido === 'articulo',
                      'bg-green-100 text-green-700': item.tipo_contenido === 'hilo'
                    }">
                {{ item.tipo_contenido }}
              </span>
              <span class="text-sm text-gray-500">Ocultado por: <span class="font-semibold">{{ item.moderador_nombre }}</span></span>
            </div>
            <h3 class="text-lg font-semibold">{{ item.titulo_contenido }}</h3>
            <p class="text-red-700 mt-2 font-medium bg-red-50 p-2 rounded inline-block text-sm">
              Motivo: {{ item.motivo }}
            </p>
          </div>
          
          <div class="flex gap-2">
            <button @click="restore(item)" class="px-4 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition">
              Restaurar
            </button>
            <button @click="forceDelete(item)" class="px-4 py-2 bg-gray-800 text-white rounded text-sm hover:bg-gray-900 transition">
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/api/api'

const items = ref<any[]>([])
const loading = ref(false)

const loadData = async () => {
  loading.value = true
  try {
    const { data } = await api.get('/moderation/hidden-content')
    items.value = data || []
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const restore = async (item: any) => {
  if (!confirm('¿Seguro que quieres restaurar este contenido y hacerlo público otra vez?')) return
  try {
    await api.post('/moderation/restore', {
      tipoContenido: item.tipo_contenido,
      contenidoId: item.contenido_id
    })
    alert('Restaurado')
    loadData()
  } catch (error) {
    alert('Error')
  }
}

const forceDelete = async (item: any) => {
  if (!confirm('¿Seguro que quieres eliminar definitivamente este contenido?')) return
  try {
    await api.post('/moderation/delete', {
      tipoContenido: item.tipo_contenido,
      contenidoId: item.contenido_id
    })
    alert('Eliminado')
    loadData()
  } catch (error) {
    alert('Error')
  }
}

onMounted(() => {
  loadData()
})
</script>
