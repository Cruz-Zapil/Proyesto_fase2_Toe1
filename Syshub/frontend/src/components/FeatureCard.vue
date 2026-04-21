<template>
  <div class="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-6 border-t-4" :style="{ borderTopColor: color }">
    <div class="text-4xl mb-4">{{ icon }}</div>
    <h3 class="text-xl font-bold mb-2">{{ title }}</h3>
    <p class="text-gray-600">{{ description }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  icon: string
  title: string
  description: string
  color: string
}>()
</script>
