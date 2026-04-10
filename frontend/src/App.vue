<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <nav class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 py-4">
        <div class="flex justify-between items-center">
          <h1 class="text-2xl font-bold text-primary">Syshub</h1>
          <ul class="flex gap-6">
            <li><router-link to="/" class="hover:text-primary">Inicio</router-link></li>
            <li><router-link to="/projects" class="hover:text-primary">Proyectos</router-link></li>
            <li><router-link to="/forums" class="hover:text-primary">Foros</router-link></li>
          </ul>
        </div>
      </div>
    </nav>

    <main class="max-w-7xl mx-auto py-8 px-4">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>
