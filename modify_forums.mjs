import fs from 'fs'

const path = '/home/CruzZapil/Escritorio/Proyecto final/Teo1/Syshub/frontend/src/views/Forums.vue'
let content = fs.readFileSync(path, 'utf8')

// Add imports for store and api
if (!content.includes('useAuthStore')) {
  content = content.replace(
    "import { useForumsStore } from '../stores/ForumsStore'",
    "import { useForumsStore } from '../stores/ForumsStore'\nimport { useAuthStore } from '@/stores/authStore'\nimport { hideContent } from '@/api/moderation'"
  )
}

if (!content.includes('authStore')) {
  // Try to find a place after useForumsStore()
  content = content.replace(
    "const forumsStore = useForumsStore()",
    "const forumsStore = useForumsStore()\nconst authStore = useAuthStore()\n\nconst showHideModal = ref(false)\nconst selectedThreadToHide = ref(null)\nconst hideMotive = ref('Inapropiado')"
  )
}

// Add hide logic
if (!content.includes('confirmHide')) {
  content = content.replace(
    "const createThread = async () => {",
    `const openHideModal = (threadId) => {
  selectedThreadToHide.value = threadId
  hideMotive.value = 'Inapropiado'
  showHideModal.value = true
}

const closeHideModal = () => {
  showHideModal.value = false
  selectedThreadToHide.value = null
  hideMotive.value = ''
}

const confirmHide = async () => {
  if (!selectedThreadToHide.value) return
  try {
    await hideContent('hilo', selectedThreadToHide.value, hideMotive.value)
    alert('Hilo ocultado correctamente')
    closeHideModal()
    await forumsStore.fetchThreads() // recargar
    selectedThread.value = null
  } catch (err) {
    alert('Error al ocultar')
  }
}

const createThread = async () => {`
  )
}

// Filter thread mapping so we ignore those marked as oculto? Actually the backend should probably do it or we do it here. 
// "const filteredThreads = computed(() => {"
content = content.replace(
  "const filteredThreads = computed(() => {\n    let filtered = forumsStore.threads",
  "const filteredThreads = computed(() => {\n    let filtered = forumsStore.threads.filter(t => !t.oculto)"
)

// Add hide button inside thread card
const buttonStr = `                <button v-for="thread in filteredThreads" :key="thread.id"
                    @click="selectThread(thread)"
                    class="w-full text-left bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div class="flex justify-between items-start mb-2">`

const newButtonStr = `                <div v-for="thread in filteredThreads" :key="thread.id" class="w-full bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col overflow-hidden">
                    <button @click="selectThread(thread)" class="w-full text-left p-6">
                        <div class="flex justify-between items-start mb-2">`

// Let's manually write a proper replacement for the thread card. In Forums.vue it might look like a single `<button v-for...`
content = content.replace(/<button v-for="thread in filteredThreads"[\s\S]*?<\/button>/m, (match) => {
  // Let's modify match cautiously or just do a regex replace
  let newMatch = match.replace('<button v-for="thread in filteredThreads"', '<div v-for="thread in filteredThreads"')
  newMatch = newMatch.replace('@click="selectThread(thread)"', '')
  newMatch = newMatch.replace('class="w-full text-left bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">', 'class="w-full bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col relative">\n<div @click="selectThread(thread)" class="cursor-pointer">')
  newMatch = newMatch.replace('</button>', '</div>\n<div v-if="authStore.isModerator" class="mt-4"><button @click.stop="openHideModal(thread.id)" class="px-4 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700">Ocultar Hilo</button></div>\n</div>')
  return newMatch
})

// Add Hide Modal
const modalStr = `
    <- Hide Modal -->
    <div v-if="showHideModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h2 class="text-xl font-bold text-gray-800">Ocultar Hilo</h2>
          <button @click="closeHideModal" class="text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </div>
        <div class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Motivo</label>
            <select v-model="hideMotive" class="w-full px-4 py-2 border rounded-lg focus:ring focus:border-blue-300">
              <option value="Inapropiado">Contenido Inapropiado</option>
              <option value="Spam">Spam</option>
              <option value="Plagio">Plagio</option>
              <option value="Ofensivo">Lenguaje Ofensivo</option>
              <option value="Otro">Otro</option>
            </select>
          </div>
        </div>
        <div class="px-6 py-4 bg-gray-50 flex justify-end gap-3">
          <button @click="closeHideModal" class="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium">Cancelar</button>
          <button @click="confirmHide" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors">
            Confirmar Ocultar
          </button>
        </div>
      </div>
    </div>
</template>
`

if (!content.includes('Ocultar Hilo</h2>')) {
  // Be careful to inject before the final </template> which might be at the end of the file.
  // Actually, wait, let's find the last </template>
  const tmplEnd = content.lastIndexOf('</template>')
  if (tmplEnd !== -1) {
      content = content.substring(0, tmplEnd) + modalStr + content.substring(tmplEnd + 11)
  }
}

fs.writeFileSync(path, content)
