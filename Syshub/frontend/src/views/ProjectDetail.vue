<template>
  <div class="max-w-5xl mx-auto py-8 px-4 space-y-8">
    <div v-if="loading" class="bg-white rounded-2xl shadow p-8 text-center text-gray-600">
      Cargando proyecto...
    </div>

    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-2xl p-6 text-red-700">
      {{ error }}
    </div>

    <template v-else-if="project">
      <div class="bg-white rounded-2xl shadow p-8 space-y-4">
        <div class="flex flex-col gap-2">
          <p class="text-sm text-gray-500">Proyecto</p>
          <h1 class="text-4xl font-bold text-gray-900">{{ project.titulo }}</h1>
          <p class="text-gray-600">por {{ authorName }}</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div class="bg-gray-50 rounded-xl p-4">
            <p class="text-gray-500 mb-1">Área técnica</p>
            <p class="font-semibold">{{ project.areaTecnicaNombre || 'Sin área' }}</p>
          </div>
          <div class="bg-gray-50 rounded-xl p-4">
            <p class="text-gray-500 mb-1">Estado</p>
            <p class="font-semibold capitalize">{{ project.estado }}</p>
          </div>
          <div class="bg-gray-50 rounded-xl p-4">
            <p class="text-gray-500 mb-1">Visibilidad</p>
            <p class="font-semibold capitalize">{{ project.visibilidad }}</p>
          </div>
        </div>

        <div>
          <h2 class="text-xl font-semibold mb-2">Descripción</h2>
          <p class="text-gray-700 whitespace-pre-line">{{ project.descripcion }}</p>
        </div>
      </div>

      <div class="bg-white rounded-2xl shadow p-8 space-y-4">
        <div class="flex items-center justify-between gap-4">
          <h2 class="text-2xl font-semibold">Archivos adjuntos</h2>
          <span class="text-sm text-gray-500">{{ files.length }} archivo(s)</span>
        </div>

        <div v-if="!files.length" class="rounded-xl border border-dashed border-gray-300 p-6 text-gray-500">
          Este proyecto todavía no tiene archivos cargados.
        </div>

        <div v-else class="grid gap-3">
          <a
            v-for="file in files"
            :key="file.id"
            :href="fileUrl(file.url_storage)"
            target="_blank"
            rel="noreferrer"
            class="flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3 hover:bg-gray-50 transition-colors"
          >
            <div>
              <p class="font-medium text-gray-900">{{ file.nombre_original }}</p>
              <p class="text-sm text-gray-500">{{ formatBytes(file.tamano_bytes) }} · {{ file.tipo_mime || 'archivo' }}</p>
            </div>
            <span class="text-sm font-semibold text-blue-600">Abrir</span>
          </a>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { getProjectFiles } from '@/api/projects'
import API_URL from '@/api/api'

const route = useRoute()
const loading = ref(true)
const error = ref<string | null>(null)
const project = ref<any>(null)
const files = ref<any[]>([])

const authorName = computed(() => {
  if (!project.value) return 'Desconocido'
  return [project.value.autorNombre, project.value.autorApellidos].filter(Boolean).join(' ') || project.value.autorId || 'Desconocido'
})

function fileUrl(urlStorage: string) {
  const base = API_URL.replace('/api/v1', '')
  return `${base}${urlStorage}`
}

function formatBytes(bytes?: number) {
  if (bytes === null || bytes === undefined) return 'Tamaño desconocido'
  const units = ['B', 'KB', 'MB', 'GB']
  let value = bytes
  let unit = 0
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024
    unit += 1
  }
  return `${value.toFixed(value >= 10 || unit === 0 ? 0 : 1)} ${units[unit]}`
}

async function load() {
  loading.value = true
  error.value = null

  try {
    const res = await fetch(`${API_URL}/projects/${route.params.id}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
      },
    })
    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.message || 'No se pudo cargar el proyecto')
    }

    project.value = data
    files.value = await getProjectFiles(String(route.params.id))
  } catch (err: any) {
    error.value = err.message || 'No se pudo cargar el proyecto'
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>