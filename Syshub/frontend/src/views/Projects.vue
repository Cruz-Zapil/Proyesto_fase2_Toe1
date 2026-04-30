<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="flex justify-between items-start md:items-center flex-col md:flex-row gap-4">
      <div>
        <h1 class="text-4xl font-bold mb-2">📚 Repositorio de Proyectos</h1>
        <p class="text-gray-600">Descubre, comparte y colabora en proyectos académicos</p>
      </div>
      <router-link
        to="/login"
        class="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
      >
        + Nuevo Proyecto
      </router-link>
    </div>

    <!-- Filters and Search -->
    <div class="bg-white p-6 rounded-lg shadow-md space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Search -->
        <div>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar proyectos..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>

        <!-- Category Filter -->
        <div>
          <select
            v-model="selectedCategory"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          >
            <option value="">Todas las categorías</option>
            <option value="web">Desarrollo Web</option>
            <option value="mobile">Mobile</option>
            <option value="backend">Backend</option>
            <option value="ia">Inteligencia Artificial</option>
            <option value="otro">Otro</option>
          </select>
        </div>

        <!-- Sort -->
        <div>
          <select
            v-model="sortBy"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          >
            <option value="recent">Más Recientes</option>
            <option value="popular">Más Populares</option>
            <option value="trending">Tendencia</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="!projects.length" class="bg-gray-100 rounded-lg p-12 text-center">
      <div class="text-6xl mb-4">🎓</div>
      <h3 class="text-2xl font-bold mb-2">No hay proyectos aún</h3>
      <p class="text-gray-600 mb-6">Sé el primero en compartir un proyecto con la comunidad</p>
      <router-link
        to="/login"
        class="inline-block px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
      >
        Iniciar Sesión para Crear Proyecto
      </router-link>
    </div>

    <!-- Projects Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="(project, index) in filteredProjects"
        :key="index"
        class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden flex flex-col"
      >
        <!-- Project Header -->
        <div class="bg-gradient-to-r from-blue-500 to-blue-600 p-4 text-white">
          <h3 class="text-xl font-bold">{{ project.name }}</h3>
          <p class="text-sm opacity-90">por {{ project.author }}</p>
        </div>

        <!-- Project Body -->
        <div class="p-6 flex-grow">
          <p class="text-gray-600 mb-4">{{ project.description }}</p>
          
          <!-- Tags -->
          <div class="flex flex-wrap gap-2 mb-4">
            <span
              v-for="tag in project.tags"
              :key="tag"
              class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold"
            >
              {{ tag }}
            </span>
          </div>

          <!-- Stats -->
          <div class="grid grid-cols-2 gap-4 text-center py-4 border-t border-gray-200">
            <div>
              <div class="text-2xl font-bold text-blue-600">{{ project.stars }}</div>
              <p class="text-xs text-gray-600">⭐ Estrellas</p>
            </div>
            <div>
              <div class="text-2xl font-bold text-purple-600">{{ project.collaborators }}</div>
              <p class="text-xs text-gray-600">👥 Colaboradores</p>
            </div>
          </div>
        </div>

        <!-- Project Footer -->
        <div class="px-6 py-4 bg-gray-50 border-t flex gap-2">
          <button class="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm font-semibold">
            Ver Proyecto
          </button>
          <button class="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors text-sm font-semibold">
            ⭐ Guardar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getProjects } from '@/api/projects'

const searchQuery = ref('')
const selectedCategory = ref('')
const sortBy = ref('recent')

const projects = ref<any[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

async function load() {
  loading.value = true
  error.value = null
  try {
    const data = await getProjects()
    // Map backend fields to UI-friendly shape
    projects.value = data.map((p: any) => ({
      id: p.id,
      name: p.titulo || p.nombre || 'Sin título',
      author: p.autorId || 'Desconocido',
      description: p.descripcion || '',
      tags: p.stack_tecnologico ? p.stack_tecnologico.split(',').map((s: string) => s.trim()) : [],
      stars: p.rating || 0,
      collaborators: p.vistas || 0,
      category: p.area_tecnica || ''
    }))
  } catch (err: any) {
    error.value = err.message || 'Error al cargar proyectos'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  load()
})

const filteredProjects = computed(() => {
  let filtered = projects.value

  // Filter by search
  if (searchQuery.value) {
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  // Filter by category
  if (selectedCategory.value) {
    filtered = filtered.filter(p => p.category === selectedCategory.value)
  }

  // Sort
  if (sortBy.value === 'popular') {
    filtered.sort((a, b) => b.stars - a.stars)
  }

  return filtered
})
</script>
