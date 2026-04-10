<template>
  <div>
    <h1 class="text-3xl font-bold mb-6">Proyectos</h1>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div class="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
        <h3 class="text-xl font-bold mb-2">Proyecto 1</h3>
        <p class="text-gray-600 mb-4">Descripción del proyecto...</p>
        <div class="flex gap-2">
          <span class="px-3 py-1 bg-primary text-white rounded-full text-sm">Vue</span>
          <span class="px-3 py-1 bg-secondary text-white rounded-full text-sm">Desarrollo</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// TODO: Cargar proyectos desde API
</script>
