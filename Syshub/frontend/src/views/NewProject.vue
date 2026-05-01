<template>
  <div class="max-w-5xl mx-auto py-8 px-4">
    <div class="mb-8">
      <h1 class="text-4xl font-bold mb-2">Crear Nuevo Proyecto</h1>
      <p class="text-gray-600">Comparte tu proyecto académico con la comunidad. Llena todos los detalles para publicarlo.</p>
    </div>

    <form class="bg-white rounded-2xl shadow-md p-6 md:p-8 space-y-8" @submit.prevent="handleSubmit">
      <!-- SECCIÓN 1: INFORMACIÓN BÁSICA -->
      <div class="border-b pb-6">
        <h2 class="text-2xl font-semibold mb-6 text-gray-800">Información Básica</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Título -->
          <div class="md:col-span-2">
            <label class="block text-sm font-semibold text-gray-700 mb-2">Título *</label>
            <input
              v-model="form.titulo"
              type="text"
              required
              maxlength="255"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="Ej. Sistema de gestión académica"
            />
            <p class="text-xs text-gray-500 mt-1">{{ form.titulo.length }}/255 caracteres</p>
          </div>

          <!-- Descripción -->
          <div class="md:col-span-2">
            <label class="block text-sm font-semibold text-gray-700 mb-2">Descripción *</label>
            <textarea
              v-model="form.descripcion"
              required
              rows="6"
              maxlength="5000"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
              placeholder="Describe el problema, objetivo, metodología y resultados del proyecto..."
            />
            <p class="text-xs text-gray-500 mt-1">{{ form.descripcion.length }}/5000 caracteres</p>
          </div>

          <!-- Área Técnica -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Área Técnica *</label>
            <select
              v-model="form.areaTecnica"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="">Selecciona una categoría</option>
              <option v-for="area in areasTecnicas" :key="area.id" :value="area.id">
                {{ area.nombre }}
              </option>
            </select>
          </div>

          <!-- Curso Asociado -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Curso Asociado (opcional)</label>
            <select
              v-model="form.cursoId"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="">Ninguno</option>
              <option v-for="c in misCursos" :key="c.id" :value="c.id">{{ c.nombre }}</option>
            </select>
            <p class="text-xs text-gray-500 mt-1">Se listan los cursos asociados a tu cuenta</p>
          </div>
        </div>
      </div>

      <!-- SECCIÓN 2: TECNOLOGÍAS Y ETIQUETAS -->
      <div class="border-b pb-6">
        <h2 class="text-2xl font-semibold mb-6 text-gray-800">Tecnologías y Etiquetas</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Tecnologías -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Tecnologías Utilizadas</label>
            <div class="border border-gray-300 rounded-lg p-3 max-h-48 overflow-y-auto bg-gray-50">
              <div v-if="loading" class="text-gray-500 text-sm">Cargando...</div>
              <div v-else-if="tecnologias.length === 0" class="text-gray-500 text-sm">No hay tecnologías disponibles</div>
              <div v-else class="space-y-2">
                <label v-for="tech in tecnologias" :key="tech.id" class="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-1 rounded">
                  <input
                    type="checkbox"
                    :value="tech.id"
                    v-model="form.tecnologiaIds"
                    class="w-4 h-4 rounded border-gray-300"
                  />
                  <span class="text-sm text-gray-700">{{ tech.nombre }}</span>
                </label>
              </div>
            </div>
            <p class="text-xs text-gray-500 mt-2">{{ form.tecnologiaIds.length }} seleccionadas</p>
          </div>

          <!-- Etiquetas -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Etiquetas</label>
            <div class="border border-gray-300 rounded-lg p-3 max-h-48 overflow-y-auto bg-gray-50">
              <div v-if="loading" class="text-gray-500 text-sm">Cargando...</div>
              <div v-else-if="etiquetas.length === 0" class="text-gray-500 text-sm">No hay etiquetas disponibles</div>
              <div v-else class="space-y-2">
                <label v-for="tag in etiquetas" :key="tag.id" class="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-1 rounded">
                  <input
                    type="checkbox"
                    :value="tag.id"
                    v-model="form.etiquetaIds"
                    class="w-4 h-4 rounded border-gray-300"
                  />
                  <span class="text-sm text-gray-700">{{ tag.nombre }}</span>
                  <span class="text-xs text-gray-400">({{ tag.usoCount }})</span>
                </label>
              </div>
            </div>
            <p class="text-xs text-gray-500 mt-2">{{ form.etiquetaIds.length }} seleccionadas</p>
          </div>

          <!-- Archivos -->
          <div class="md:col-span-2 mt-4">
            <label class="block text-sm font-semibold text-gray-700 mb-2">Archivos </label>
            <input type="file" multiple @change="onFilesChange" class="w-full" />
            <div v-if="selectedFiles.length" class="mt-2 space-y-1">
              <div v-for="(f, i) in selectedFiles" :key="i" class="text-sm text-gray-700">
                {{ f.name }} — {{ Math.round(f.size/1024) }} KB
              </div>
            </div>
            <p class="text-xs text-gray-500 mt-1">Se subirán los archivos después de crear el proyecto.</p>
          </div>

        </div>
      </div>

      <!-- SECCIÓN 3: CONFIGURACIÓN DEL PROYECTO -->
      <div class="border-b pb-6">
        <h2 class="text-2xl font-semibold mb-6 text-gray-800">Configuración</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Estado -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Estado *</label>
            <select
              v-model="form.estado"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="borrador">📝 Borrador</option>
              <option value="publicado">🚀 Publicado</option>
            </select>
            <p class="text-xs text-gray-500 mt-1">El estado determina si el proyecto es visible para otros</p>
          </div>

          <!-- Visibilidad -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Visibilidad *</label>
            <select
              v-model="form.visibilidad"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="publico">🌐 Público</option>
              <option value="privado">🔒 Privado</option>
            </select>
            <p class="text-xs text-gray-500 mt-1">Los proyectos privados solo son visibles para ti</p>
          </div>
        </div>
      </div>

      <!-- MENSAJES DE ERROR -->
      <div v-if="error" class="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 flex items-start gap-3">
        <span class="text-xl">⚠️</span>
        <div>
          <p class="font-semibold">Error</p>
          <p class="text-sm">{{ error }}</p>
        </div>
      </div>

      <!-- BOTONES DE ACCIÓN -->
      <div class="flex flex-col sm:flex-row gap-3 sm:justify-end pt-4 border-t">
        <router-link
          to="/projects"
          class="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 text-center font-semibold hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </router-link>
        <button
          type="submit"
          :disabled="loading"
          class="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <span v-if="loading">⏳</span>
          <span>{{ loading ? 'Creando...' : 'Crear Proyecto' }}</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { createProject, getAreasTecnicas, getEtiquetas, getTecnologias, getMisCursos } from '@/api/projects'
import API_URL from '@/api/api'

const router = useRouter()
const loading = ref(false)
const error = ref<string | null>(null)
const areasTecnicas = ref<any[]>([])
const etiquetas = ref<any[]>([])
const tecnologias = ref<any[]>([])
const misCursos = ref<any[]>([])
const selectedFiles = ref<File[]>([])

const form = reactive({
  titulo: '',
  descripcion: '',
  areaTecnica: '',
  cursoId: '',
  estado: 'borrador',
  visibilidad: 'publico',
  etiquetaIds: [] as string[],
  tecnologiaIds: [] as string[],
})

async function loadData() {
  try {
    const [areas, tags, techs, cursos] = await Promise.all([
      getAreasTecnicas(),
      getEtiquetas(),
      getTecnologias(),
      getMisCursos(),
    ])

    areasTecnicas.value = areas
    etiquetas.value = tags
    tecnologias.value = techs
    misCursos.value = cursos
  } catch (err: any) {
    error.value = err.message || 'Error al cargar los datos'
  }
}

function onFilesChange(e: Event) {
  const input = e.target as HTMLInputElement
  if (!input.files) return
  selectedFiles.value = Array.from(input.files)
}

async function uploadFiles(projectId: string) {
  if (!selectedFiles.value.length) return
  const token = localStorage.getItem('token')

  for (const file of selectedFiles.value) {
    const fd = new FormData()
    fd.append('file', file)

    const res = await fetch(`${API_URL}/projects/${projectId}/files`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      body: fd,
    })

    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      throw new Error(data.message || 'Error subiendo archivos')
    }
  }
}

async function handleSubmit() {
  loading.value = true
  error.value = null

  // Validaciones básicas
  if (!form.titulo.trim()) {
    error.value = 'El título es obligatorio'
    loading.value = false
    return
  }

  if (!form.descripcion.trim()) {
    error.value = 'La descripción es obligatoria'
    loading.value = false
    return
  }

  if (!form.areaTecnica) {
    error.value = 'Debes seleccionar un área técnica'
    loading.value = false
    return
  }

    try {
    const payload = {
      titulo: form.titulo.trim(),
      descripcion: form.descripcion.trim(),
      areaTecnica: form.areaTecnica,
      cursoId: form.cursoId || null,
      estado: form.estado,
      visibilidad: form.visibilidad,
      etiquetaIds: form.etiquetaIds,
      tecnologiaIds: form.tecnologiaIds,
    }

    const created = await createProject(payload)

    // Si seleccionó archivos, subirlos al endpoint de archivos
    if (selectedFiles.value.length) {
      await uploadFiles(created.id)
    }

    router.push('/projects')
  } catch (err: any) {
    error.value = err.message || 'No se pudo crear el proyecto'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
/* Scrollbar personalizado */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
