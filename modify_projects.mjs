import fs from 'fs'

const path = '/home/CruzZapil/Escritorio/Proyecto final/Teo1/Syshub/frontend/src/views/Projects.vue'
let content = fs.readFileSync(path, 'utf8')

// Add imports
content = content.replace(
  "import { ref, computed, onMounted } from 'vue'",
  "import { ref, computed, onMounted } from 'vue'\nimport { useAuthStore } from '@/stores/authStore'\nimport { hideContent } from '@/api/moderation'"
)

// Add store and state
content = content.replace(
  "const error = ref<string | null>(null)",
  "const error = ref<string | null>(null)\n\nconst authStore = useAuthStore()\n\nconst showHideModal = ref(false)\nconst selectedProjectToHide = ref<string | null>(null)\nconst hideMotive = ref('')"
)

// Add methods
content = content.replace(
  "async function load() {",
  `const openHideModal = (projectId) => {
  selectedProjectToHide.value = projectId
  hideMotive.value = 'Inapropiado'
  showHideModal.value = true
}

const closeHideModal = () => {
  showHideModal.value = false
  selectedProjectToHide.value = null
  hideMotive.value = ''
}

const confirmHide = async () => {
  if (!selectedProjectToHide.value) return
  try {
    await hideContent('proyecto', selectedProjectToHide.value, hideMotive.value)
    alert('Proyecto ocultado correctamente')
    closeHideModal()
    load() // Reload
  } catch (err) {
    alert('Error al ocultar')
  }
}

async function load() {`
)

// Filter out hidden projects (if backend doesn't filter them yet)
// Let's assume the backend already filters them or we filter by `p.oculto !== true`
content = content.replace(
  "if (searchQuery.value) {",
  "filtered = filtered.filter(p => !p.oculto)\n\n  if (searchQuery.value) {"
)

// Add button to the card
const footerStr = `<div class="px-6 py-4 bg-gray-50 border-t flex gap-2">
          <router-link :to="\`/projects/\${project.id}\`" class="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm font-semibold text-center">
            Ver Proyecto
          </router-link>
          <button class="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors text-sm font-semibold">
            ⭐ Guardar
          </button>
        </div>`

const newFooterStr = `<div class="px-6 py-4 bg-gray-50 border-t flex flex-col gap-2">
          <div class="flex gap-2">
            <router-link :to="\`/projects/\${project.id}\`" class="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm font-semibold text-center">
              Ver Proyecto
            </router-link>
            <button class="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors text-sm font-semibold">
              ⭐ Guardar
            </button>
          </div>
          <button v-if="authStore.isModerator" @click="openHideModal(project.id)" class="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm font-semibold">
            Ocultar Contenido
          </button>
        </div>`

content = content.replace(footerStr, newFooterStr)

// Add modal at the end of the template (before </template>)
const modalStr = `
    <- Hide Modal -->
    <div v-if="showHideModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h2 class="text-xl font-bold text-gray-800">Ocultar Proyecto</h2>
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
  </div>
</template>`

content = content.replace("  </div>\n</template>", modalStr)

fs.writeFileSync(path, content)
