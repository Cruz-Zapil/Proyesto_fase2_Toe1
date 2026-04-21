<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="flex justify-between items-start md:items-center flex-col md:flex-row gap-4">
      <div>
        <h1 class="text-4xl font-bold mb-2">💬 Foros de Discusión</h1>
        <p class="text-gray-600">Participa en discusiones, resuelve dudas y aprende de la comunidad</p>
      </div>
      <router-link
        to="/login"
        class="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
      >
        + Nueva Discusión
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
            placeholder="Buscar temas..."
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
            <option value="general">General</option>
            <option value="duda">Dudas</option>
            <option value="ayuda">Pedir Ayuda</option>
            <option value="recurso">Recursos</option>
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
            <option value="popular">Más Comentados</option>
            <option value="trending">Tendencia</option>
            <option value="unanswered">Sin Responder</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="!threads.length" class="bg-gray-100 rounded-lg p-12 text-center">
      <div class="text-6xl mb-4">🤷</div>
      <h3 class="text-2xl font-bold mb-2">No hay discusiones aún</h3>
      <p class="text-gray-600 mb-6">Sé el primero en iniciar una discusión</p>
      <router-link
        to="/login"
        class="inline-block px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
      >
        Iniciar Sesión para Participar
      </router-link>
    </div>

    <!-- Threads List -->
    <div v-else class="space-y-4">
      <div
        v-for="(thread, index) in filteredThreads"
        :key="index"
        class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden flex items-start gap-4 p-6 border-l-4 hover:scale-102"
        :style="{ borderLeftColor: getCategoryColor(thread.category) }"
      >
        <!-- Stats Column -->
        <div class="flex-shrink-0 text-center min-w-24">
          <div class="text-3xl font-bold text-blue-600">{{ thread.replies }}</div>
          <p class="text-sm text-gray-600">Respuestas</p>
        </div>

        <!-- Content Column -->
        <div class="flex-grow">
          <div class="flex items-start justify-between gap-4 mb-2">
            <h3 class="text-xl font-bold text-gray-900 hover:text-blue-600 cursor-pointer">
              {{ thread.title }}
            </h3>
            <span
              class="flex-shrink-0 px-3 py-1 text-xs font-semibold rounded-full"
              :class="thread.isAnswered ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'"
            >
              {{ thread.isAnswered ? '✓ Resuelto' : 'Sin Resolver' }}
            </span>
          </div>

          <p class="text-gray-600 mb-3">{{ thread.preview }}</p>

          <div class="flex flex-wrap gap-2 mb-4">
            <span
              v-for="tag in thread.tags"
              :key="tag"
              class="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-semibold"
            >
              {{ tag }}
            </span>
          </div>

          <div class="flex items-center justify-between text-sm text-gray-500">
            <div class="flex items-center gap-4">
              <span>👤 {{ thread.author }}</span>
              <span>📅 {{ thread.date }}</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-yellow-500">👁️ {{ thread.views }}</span>
              <span>Vistas</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const searchQuery = ref('')
const selectedCategory = ref('')
const sortBy = ref('recent')

interface Thread {
  id: number
  title: string
  preview: string
  author: string
  date: string
  replies: number
  views: number
  tags: string[]
  category: string
  isAnswered: boolean
}

// Mock data - Será reemplazado por llamadas a la API
const threads = ref<Thread[]>([
  {
    id: 1,
    title: '¿Cómo instalar y configurar NestJS correctamente?',
    preview: 'Tengo problemas al instalar NestJS. ¿Alguien puede guiarme paso a paso?',
    author: 'Juan Pérez',
    date: 'Hace 2 horas',
    replies: 5,
    views: 34,
    tags: ['NestJS', 'Instalación', 'Tutorial'],
    category: 'duda',
    isAnswered: true
  },
  {
    id: 2,
    title: 'Mejor forma de estructurar un proyecto Vue.js grande',
    preview: 'Estoy trabajando en un proyecto grande con Vue 3. ¿Cuál es la mejor estructura de carpetas?',
    author: 'María García',
    date: 'Hace 4 horas',
    replies: 12,
    views: 89,
    tags: ['Vue.js', 'Arquitectura', 'Best Practices'],
    category: 'recurso',
    isAnswered: true
  },
  {
    id: 3,
    title: '¿Alguien necesita colaborador para proyecto de React?',
    preview: 'Estoy buscando colaboradores para un proyecto interesante de React + Node.js',
    author: 'Carlos López',
    date: 'Hace 6 horas',
    replies: 3,
    views: 45,
    tags: ['React', 'Colaboración', 'Oportunidad'],
    category: 'general',
    isAnswered: false
  },
  {
    id: 4,
    title: 'Error 404 en rutas de Express.js',
    preview: 'Mi servidor Express retorna 404 en todas las rutas. ¿Qué estoy haciendo mal?',
    author: 'Ana Martínez',
    date: 'Hace 1 día',
    replies: 8,
    views: 76,
    tags: ['Express.js', 'Backend', 'Debugging'],
    category: 'ayuda',
    isAnswered: true
  }
])

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    general: '#3b82f6',
    duda: '#f59e0b',
    ayuda: '#ef4444',
    recurso: '#10b981',
    otro: '#8b5cf6'
  }
  return colors[category] || '#3b82f6'
}

const filteredThreads = computed(() => {
  let filtered = threads.value

  // Filter by search
  if (searchQuery.value) {
    filtered = filtered.filter(
      t =>
        t.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        t.preview.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  // Filter by category
  if (selectedCategory.value) {
    filtered = filtered.filter(t => t.category === selectedCategory.value)
  }

  // Sort
  if (sortBy.value === 'popular') {
    filtered.sort((a, b) => b.replies - a.replies)
  } else if (sortBy.value === 'unanswered') {
    filtered = filtered.filter(t => !t.isAnswered)
  }

  return filtered
})
</script>
