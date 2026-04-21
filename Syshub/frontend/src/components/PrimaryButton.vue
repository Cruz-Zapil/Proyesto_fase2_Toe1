<template>
  <button
    :to="to"
    :href="href"
    :as="as"
    class="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
  >
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    to?: string
    href?: string
    as?: string
  }>(),
  { as: 'button' }
)
</script>
