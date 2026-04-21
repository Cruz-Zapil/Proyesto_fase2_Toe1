<template>
  <button
    :to="to"
    :href="href"
    :as="as"
    class="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition-colors"
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
