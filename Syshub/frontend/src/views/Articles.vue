<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="flex justify-between items-start md:items-center flex-col md:flex-row gap-4">
      <div>
        <h1 class="text-4xl font-bold mb-2">📝 Artículos</h1>
        <p class="text-gray-600">Comparte y descubre artículos sobre tecnología y educación</p>
      </div>
      <button
        v-if="isAuthenticated"
        @click="showCreateForm = !showCreateForm"
        class="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
      >
        + Nuevo Artículo
      </button>
    </div>

    <!-- Create Article Form -->
    <div v-if="showCreateForm && isAuthenticated" class="bg-white p-6 rounded-2xl shadow-md space-y-4">
      <h2 class="text-2xl font-semibold">Crear artículo</h2>
      <div class="space-y-4">
        <input
          v-model="newArticle.titulo"
          type="text"
          placeholder="Título del artículo"
          class="w-full px-4 py-3 border rounded-lg"
        />

        <input
          v-model="newArticle.slug"
          type="text"
          placeholder="URL amigable (ej: mi-primer-articulo)"
          class="w-full px-4 py-3 border rounded-lg"
        />

        <textarea
          v-model="newArticle.resumen"
          rows="3"
          placeholder="Resumen del artículo"
          class="w-full px-4 py-3 border rounded-lg"
        ></textarea>

        <textarea
          v-model="newArticle.contenido_html"
          rows="10"
          placeholder="Contenido del artículo (HTML)"
          class="w-full px-4 py-3 border rounded-lg font-mono text-sm"
        ></textarea>

        <input
          v-model="newArticle.imagen_portada"
          type="text"
          placeholder="URL de imagen de portada (opcional)"
          class="w-full px-4 py-3 border rounded-lg"
        />

        <div class="space-y-2">
          <p class="text-sm font-semibold text-gray-700">Etiquetas</p>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
            <label
              v-for="tag in etiquetas"
              :key="tag.id"
              class="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50"
            >
              <input v-model="newArticle.etiquetaIds" type="checkbox" :value="tag.id" />
              <span class="text-sm">{{ tag.nombre }}</span>
            </label>
          </div>
        </div>

        <div class="flex justify-end gap-3">
          <button
            @click="showCreateForm = false"
            class="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 font-semibold"
          >
            Cancelar
          </button>
          <button
            @click="submitArticle"
            :disabled="creating"
            class="px-5 py-2 rounded-lg bg-blue-600 text-white font-semibold disabled:opacity-50"
          >
            {{ creating ? 'Creando...' : 'Crear Artículo' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Filters and Search -->
    <div class="bg-white p-6 rounded-lg shadow-md space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar artículos..."
          class="w-full px-4 py-2 border rounded-lg"
        />

        <select v-model="selectedTag" class="w-full px-4 py-2 border rounded-lg">
          <option value="">Todas las etiquetas</option>
          <option v-for="tag in etiquetas" :key="tag.id" :value="tag.nombre">{{ tag.nombre }}</option>
        </select>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="bg-gray-100 rounded-lg p-12 text-center">
      <div class="text-4xl mb-4 animate-pulse">⏳</div>
      <h3 class="text-2xl font-bold mb-2">Cargando artículos</h3>
      <p class="text-gray-600">Un momento mientras traemos los artículos</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-12 text-center text-red-700">
      <h3 class="text-2xl font-bold mb-2">Error al cargar</h3>
      <p>{{ error }}</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="!articles.length" class="bg-gray-100 rounded-lg p-12 text-center">
      <div class="text-6xl mb-4">📚</div>
      <h3 class="text-2xl font-bold mb-2">No hay artículos aún</h3>
      <p class="text-gray-600 mb-6">Sé el primero en compartir un artículo</p>
    </div>

    <!-- No Results -->
    <div v-else-if="!filteredArticles.length" class="bg-gray-100 rounded-lg p-12 text-center">
      <div class="text-6xl mb-4">🔎</div>
      <h3 class="text-2xl font-bold mb-2">No encontramos coincidencias</h3>
      <p class="text-gray-600">Prueba con otra búsqueda</p>
    </div>

    <!-- Articles Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <router-link
        v-for="article in filteredArticles"
        :key="article.id"
        :to="`/articles/${article.id}`"
        class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden flex flex-col group"
      >
        <!-- Image -->
        <div v-if="article.imagen_portada" class="h-48 bg-gradient-to-r from-blue-500 to-blue-600 overflow-hidden">
          <img
            :src="article.imagen_portada"
            :alt="article.titulo"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
        </div>
        <div v-else class="h-48 bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white">
          <div class="text-4xl">📝</div>
        </div>

        <!-- Content -->
        <div class="p-6 flex-grow flex flex-col">
          <h3 class="text-xl font-bold mb-2 line-clamp-2">{{ article.titulo }}</h3>
          <p class="text-gray-600 mb-3 line-clamp-2">{{ article.resumen }}</p>

          <!-- Tags -->
          <div class="flex flex-wrap gap-2 mb-4">
            <span
              v-for="tag in article.etiquetas || []"
              :key="`${article.id}-${tag.id}`"
              class="px-2 py-1 rounded-full text-xs bg-blue-50 text-blue-700"
            >
              #{{ tag.nombre }}
            </span>
          </div>

          <div class="flex items-center justify-between text-sm text-gray-500 mt-auto pt-4 border-t">
            <span>{{ article.autor_nombre }}</span>
            <span>👁 {{ article.vistas }}</span>
          </div>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { getArticles, createArticle, getArticleEtiquetas } from '@/api/articles'

const auth = useAuthStore()
const isAuthenticated = computed(() => !!auth.isAuthenticated)

const searchQuery = ref('')
const selectedTag = ref('')
const articles = ref<any[]>([])
const etiquetas = ref<any[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const creating = ref(false)
const showCreateForm = ref(false)

const newArticle = ref({
  titulo: '',
  slug: '',
  resumen: '',
  contenido_html: '',
  imagen_portada: '',
  etiquetaIds: [] as string[],
})

async function loadArticles() {
  loading.value = true
  error.value = null

  try {
    const [articlesData, tagsData] = await Promise.all([getArticles(true), getArticleEtiquetas()])
    articles.value = articlesData
    etiquetas.value = tagsData
  } catch (err: any) {
    error.value = err.message || 'Error al cargar artículos'
  } finally {
    loading.value = false
  }
}

async function submitArticle() {
  if (!newArticle.value.titulo || !newArticle.value.slug) {
    error.value = 'Requiere título y URL amigable'
    return
  }

  creating.value = true
  error.value = null

  try {
    await createArticle({
      titulo: newArticle.value.titulo,
      slug: newArticle.value.slug,
      resumen: newArticle.value.resumen,
      contenido_html: newArticle.value.contenido_html || '<p>Sin contenido</p>',
      imagen_portada: newArticle.value.imagen_portada || null,
      etiquetaIds: newArticle.value.etiquetaIds,
    })

    newArticle.value = {
      titulo: '',
      slug: '',
      resumen: '',
      contenido_html: '',
      imagen_portada: '',
      etiquetaIds: [],
    }
    showCreateForm.value = false
    await loadArticles()
  } catch (err: any) {
    error.value = err.message || 'No se pudo crear el artículo'
  } finally {
    creating.value = false
  }
}

const filteredArticles = computed(() => {
  let filtered = [...articles.value]

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      a =>
        a.titulo?.toLowerCase().includes(q) ||
        a.resumen?.toLowerCase().includes(q) ||
        a.autor_nombre?.toLowerCase().includes(q),
    )
  }

  if (selectedTag.value) {
    filtered = filtered.filter((a: any) => (a.etiquetas || []).some((tag: any) => tag.nombre === selectedTag.value))
  }

  return filtered
})

onMounted(() => {
  loadArticles()
})
</script>
