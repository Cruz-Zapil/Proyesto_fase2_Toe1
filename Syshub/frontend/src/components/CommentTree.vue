<template>
  <div :class="wrapperClass" class="space-y-3">
    <div class="border rounded-xl p-4 bg-gray-50">
      <div class="flex justify-between gap-3 mb-2">
        <div>
          <p class="font-semibold">{{ comment.usuarioNombre }} {{ comment.usuarioApellidos }}</p>
          <p class="text-xs text-gray-500">{{ comment.estado }}</p>
        </div>
      </div>

      <p class="text-gray-700 whitespace-pre-line">{{ comment.contenido }}</p>

      <div class="mt-3 flex items-center gap-3 text-sm">
        <button
          class="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-green-50 text-green-700 font-semibold hover:bg-green-100 transition-colors"
          @click="$emit('like', comment.id)"
        >
          <span aria-hidden="true">👍</span>
          <span>{{ comment.votoNeto }}</span>
        </button>

        <button
          class="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-red-50 text-red-700 font-semibold hover:bg-red-100 transition-colors"
          @click="$emit('dislike', comment.id)"
        >
          <span aria-hidden="true">👎</span>
        </button>

        <button
          class="inline-flex items-center px-3 py-1 rounded-lg bg-blue-50 text-blue-700 font-semibold hover:bg-blue-100 transition-colors"
          @click="openReply"
        >
          Responder
        </button>
      </div>

      <div v-if="isReplying" class="mt-4 space-y-3 rounded-lg border border-blue-200 bg-blue-50 p-3">
        <textarea
          v-model="replyText"
          rows="3"
          class="w-full rounded-lg border border-blue-200 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Escribe tu respuesta..."
        />

        <div class="flex justify-end gap-2">
          <button class="px-3 py-1 rounded-lg border border-gray-300 text-gray-700" @click="cancelReply">Cancelar</button>
          <button class="px-3 py-1 rounded-lg bg-blue-600 text-white font-semibold" :disabled="!replyText.trim()" @click="submitReply">
            Responder
          </button>
        </div>
      </div>
    </div>

    <div v-if="children.length" class="space-y-3">
      <CommentTree
        v-for="child in children"
        :key="child.id"
        :comment="child"
        :children="child.children || []"
        :depth="depthValue + 1"
        @submit-reply="$emit('submit-reply', $event)"
        @like="$emit('like', $event)"
        @dislike="$emit('dislike', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

interface CommentNode {
  id: string
  usuarioNombre: string
  usuarioApellidos: string
  contenido: string
  estado: string
  votoNeto: number
  children?: CommentNode[]
}

const props = defineProps<{
  comment: CommentNode
  children: CommentNode[]
  depth?: number
}>()

const emit = defineEmits<{
  (e: 'reply', comment: CommentNode): void
  (e: 'submit-reply', payload: { parentId: string; text: string }): void
  (e: 'like', id: string): void
  (e: 'dislike', id: string): void
}>()

const isReplying = ref(false)
const replyText = ref('')
const depthValue = computed(() => props.depth ?? 0)
const wrapperClass = computed(() =>
  depthValue.value === 0 ? 'relative' : 'relative ml-8 pl-6 border-l border-gray-200',
)

function cancelReply() {
  isReplying.value = false
  replyText.value = ''
}

function submitReply() {
  if (!replyText.value.trim()) return
  emit('submit-reply', {
    parentId: props.comment.id,
    text: replyText.value,
  })
  cancelReply()
}

function openReply() {
  isReplying.value = true
}
</script>
