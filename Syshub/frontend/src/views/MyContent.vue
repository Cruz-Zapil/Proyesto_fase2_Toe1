<template>
  <div class="max-w-6xl mx-auto bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
    <h1 class="text-3xl font-extrabold text-gray-900 mb-8 text-center">Mi Contenido y Actividad</h1>

    <div v-if="loading" class="text-center py-10 text-gray-500">
      <svg class="animate-spin h-8 w-8 text-blue-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
      </svg>
      Cargando tu actividad...
    </div>

    <!-- Error -->
    <div v-else-if="errorMsg" class="bg-red-50 text-red-700 p-4 rounded-lg shadow max-w-2xl mx-auto">
      {{ errorMsg }}
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      <!-- Columna Principal: Proyectos, Foros y Articulos -->
      <div class="lg:col-span-2 space-y-8">
        
        <!-- Mis Proyectos -->
        <section class="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div class="flex justify-between items-center mb-4 border-b pb-2">
            <h2 class="text-xl font-bold text-gray-800 flex items-center gap-2">
              <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
              Mis Proyectos
            </h2>
            <span class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">{{ contenido.proyectos?.length || 0 }}</span>
          </div>
          
          <div v-if="!contenido.proyectos?.length" class="text-gray-500 italic py-4 text-center">
            Aún no has publicado ningún proyecto.
          </div>
          <ul v-else class="space-y-3">
            <li v-for="proyecto in contenido.proyectos" :key="proyecto.id" class="p-4 border rounded hover:bg-gray-50 transition cursor-pointer">
              <h3 class="font-semibold text-blue-700">{{ proyecto.titulo }}</h3>
              <p class="text-sm text-gray-600 line-clamp-2 mt-1">{{ proyecto.descripcion }}</p>
              <div class="flex items-center gap-4 mt-3 text-xs text-gray-500">
                <span class="flex items-center gap-1">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                  {{ new Date(proyecto.created_at).toLocaleDateString() }}
                </span>
                <span class="px-2 py-0.5 bg-gray-100 rounded-full font-medium capitalize">{{ proyecto.estado }}</span>
              </div>
            </li>
          </ul>
        </section>

        <!-- Mis Foros -->
        <section class="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div class="flex justify-between items-center mb-4 border-b pb-2">
            <h2 class="text-xl font-bold text-gray-800 flex items-center gap-2">
              <svg class="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"></path></svg>
              Mis Hilos en Foros
            </h2>
            <span class="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">{{ contenido.foros?.length || 0 }}</span>
          </div>
          
          <div v-if="!contenido.foros?.length" class="text-gray-500 italic py-4 text-center">
            No has creado discusiones en foros todavía.
          </div>
          <ul v-else class="space-y-3">
            <li v-for="foro in contenido.foros" :key="foro.id" class="p-4 border rounded hover:bg-gray-50 transition cursor-pointer">
              <h3 class="font-semibold text-purple-700">{{ foro.titulo }}</h3>
              <p class="text-sm text-gray-600 line-clamp-1 mt-1">{{ foro.contenido }}</p>
              <div class="flex items-center gap-4 mt-3 text-xs text-gray-500">
                <span class="flex items-center gap-1">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                  {{ new Date(foro.created_at).toLocaleDateString() }}
                </span>
              </div>
            </li>
          </ul>
        </section>

        <!-- Mis Articulos -->
        <section class="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div class="flex justify-between items-center mb-4 border-b pb-2">
            <h2 class="text-xl font-bold text-gray-800 flex items-center gap-2">
              <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              Mis Artículos
            </h2>
            <span class="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">{{ contenido.articulos?.length || 0 }}</span>
          </div>
          
          <div v-if="!contenido.articulos?.length" class="text-gray-500 italic py-4 text-center">
            No tienes artículos redactados.
          </div>
          <ul v-else class="space-y-3">
            <li v-for="articulo in contenido.articulos" :key="articulo.id" class="p-4 border rounded hover:bg-gray-50 transition cursor-pointer border-l-4 border-l-green-500">
              <h3 class="font-semibold text-green-700">{{ articulo.titulo }}</h3>
              <div class="flex items-center justify-between mt-3 text-xs text-gray-500">
                <span class="flex items-center gap-1">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                  {{ new Date(articulo.created_at).toLocaleDateString() }}
                </span>
                <span class="px-2 py-0.5 bg-gray-100 rounded-full font-medium capitalize">{{ articulo.estado ? 'Publicado' : 'Borrador' }}</span>
              </div>
            </li>
          </ul>
        </section>

      </div>

      <!-- Columna Lateral: Notificaciones -->
      <div class="lg:col-span-1">
        <section class="bg-white p-6 rounded-lg shadow-sm border border-gray-100 sticky top-24">
          <div class="flex justify-between items-center mb-4 border-b pb-2">
            <h2 class="text-xl font-bold text-gray-800 flex items-center gap-2">
              <svg class="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
              Notificaciones
            </h2>
            <span class="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold" v-if="unreadCount > 0">{{ unreadCount }}</span>
          </div>
          
          <div v-if="!contenido.notificaciones?.length" class="text-gray-500 text-sm italic py-4 text-center">
            No tienes notificaciones nuevas.
          </div>
          
          <ul v-else class="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            <li v-for="notificacion in contenido.notificaciones" :key="notificacion.id" 
                class="p-3 border rounded-lg text-sm transition"
                :class="notificacion.leido ? 'bg-white opacity-70' : 'bg-yellow-50 border-yellow-200'">
              
              <div class="flex items-start gap-3">
                <!-- Icono segun tipo -->
                <div class="mt-1">
                  <span v-if="notificacion.tipo === 'voto'" class="text-red-500">❤️</span>
                  <span v-else-if="notificacion.tipo === 'comentario'" class="text-blue-500">💬</span>
                  <span v-else-if="notificacion.tipo === 'mención'" class="text-purple-500">@</span>
                  <span v-else class="text-gray-500">🔔</span>
                </div>
                
                <div class="flex-1">
                  <p class="text-gray-800" :class="{ 'font-semibold': !notificacion.leido }">
                    {{ notificacion.mensaje }}
                  </p>
                  <p class="text-xs text-gray-500 mt-1 flex items-center justify-between">
                    {{ timeAgo(notificacion.created_at) }}
                    <span v-if="!notificacion.leido" class="h-2 w-2 bg-red-500 rounded-full"></span>
                  </p>
                </div>
              </div>
            </li>
          </ul>
        </section>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { getMyContent } from '@/api/users'

const loading = ref(true)
const errorMsg = ref('')
const contenido = ref<any>({
  proyectos: [],
  foros: [],
  articulos: [],
  notificaciones: []
})

const unreadCount = computed(() => {
  return contenido.value.notificaciones?.filter((n: any) => !n.leido).length || 0
})

onMounted(async () => {
  try {
    const data = await getMyContent()
    contenido.value = data
  } catch (err: any) {
    errorMsg.value = err.message || 'Ocurrió un error al cargar tu contenido.'
  } finally {
    loading.value = false
  }
})

// Función simple para 'Hace X tiempo'
const timeAgo = (dateStr: string) => {
  const diff = Date.now() - new Date(dateStr).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 60) return `Hace ${minutes} min`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `Hace ${hours} h`
  const days = Math.floor(hours / 24)
  if (days === 1) return `Ayer`
  return `Hace ${days} días`
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
</style>