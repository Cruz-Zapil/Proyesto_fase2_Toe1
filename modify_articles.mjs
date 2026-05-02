import fs from 'fs'

const path = '/home/CruzZapil/Escritorio/Proyecto final/Teo1/Syshub/frontend/src/views/Articles.vue'
let content = fs.readFileSync(path, 'utf8')

// Add imports for store and api
if (!content.includes('useAuthStore')) {
  content = content.replace(
    "import { useArticlesStore } from '../stores/articlesStore'",
    "import { useArticlesStore } from '../stores/articlesStore'\nimport { useAuthStore } from '@/stores/authStore'\nimport { hideContent } from '@/api/moderation'"
  )
}

if (!content.includes('authStore')) {
  content = content.replace(
    "const articlesStore = useArticlesStore()",
    "const articlesStore = useArticlesStore()\nconst authStore = useAuthStore()\n\nconst showHideModal = ref(false)\nconst selectedArticleToHide = ref(null)\nconst hideMotive = ref('Inapropiado')"
  )
}

// Add hide logic
if (!content.includes('confirmHide')) {
  // Try finding create logic
  content = content.replace(
    "const toggleForm = () => {",
    `const openHideModal = (articleId) => {
  selectedArticleToHide.value = articleId
  hideMotive.value = 'Inapropiado'
  showHideModal.value = true
}

const closeHideModal = () => {
  showHideModal.value = false
  selectedArticleToHide.value = null
  hideMotive.value = ''
}

const confirmHide = async () => {
  if (!selectedArticleToHide.value) return
  try {
    await hideContent('articulo', selectedArticleToHide.value, hideMotive.value)
    alert('Artículo ocultado correctamente')
    closeHideModal()
    await fetchArticles() // recargar
  } catch (err) {
    alert('Error al ocultar')
  }
}

const toggleForm = () => {`
  )
}

// Update card wrapper
const articleCardStr = /<router-link[\s\S]*?v-for="article in filteredArticles"[\s\S]*?to="`\/articles\/\${article\.id}`"[\s\S]*?class="[^"]*group">/m

content = content.replace(articleCardStr, `<div
        v-for="article in filteredArticles"
        :key="article.id"
        class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden flex flex-col group relative"
      >
        <router-link :to="\`/articles/\${article.id}\`" class="block w-full flex-grow">`)


const cardEndStr = `          <div class="flex items-center justify-between text-sm text-gray-500 mt-auto pt-4 border-t">
            <span>{{ article.autor_nombre }}</span>
            <span>👁 {{ article.vistas }}</span>
          </div>
        </div>
      </router-link>`

const newCardEndStr = `          <div class="flex items-center justify-between text-sm text-gray-500 mt-auto pt-4 border-t">
            <span>{{ article.autor_nombre }}</span>
            <span>👁 {{ article.vistas }}</span>
          </div>
        </div>
      </router-link>
      <div v-if="authStore.isModerator" class="px-6 py-4 bg-gray-50 border-t mt-auto">
        <button @click.stop="openHideModal(article.id)" class="w-full px-4 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700 font-semibold transition-colors">
          Ocultar Artículo
        </button>
      </div>`

content = content.replace(cardEndStr, newCardEndStr)

// Change filtering
content = content.replace(
  "const filteredArticles = computed(() => {\n  let filtered = articles.value",
  "const filteredArticles = computed(() => {\n  let filtered = articles.value.filter(a => !a.oculto)"
)


// Add Modal
const modalStr = `
    <- Hide Modal -->
    <div v-if="showHideModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h2 class="text-xl font-bold text-gray-800">Ocultar Artículo</h2>
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
const tmplEnd = content.lastIndexOf('</template>')
if (tmplEnd !== -1 && !content.includes('Ocultar Artículo</h2>')) {
  // It is safe to use replace since we already verified the end
  content = content.substring(0, tmplEnd) + modalStr + content.substring(tmplEnd + 11)
}

// Update the inner `</router-link>` which is actually the first `</router-link>` wrapper in the file for articles grids right?
// Wait, we need to make sure we close the `</div>` that we opened instead of `<router-link ... class="...group">`.
const endGridLoop = `      </div>
    </div>
  </div>
</template>`

// The structure is:
// <div v-for="...">
//   <router-link>
//   </router-link>
//   <div v-if="authStore.isModerator">...</div>
// </div> <- missing this closing div -->
// Wait, `router-link` is replaced by `div`.
// And I didn't replace the closing `</router-link>`. So it is `</router-link>`. I need to add `</div>` to match the custom top `<div>`.
const toReplaceMatch2 = `      <div v-if="authStore.isModerator" class="px-6 py-4 bg-gray-50 border-t mt-auto">
        <button @click.stop="openHideModal(article.id)" class="w-full px-4 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700 font-semibold transition-colors">
          Ocultar Artículo
        </button>
      </div>`

content = content.replace(toReplaceMatch2, toReplaceMatch2 + '\n      </div>')


fs.writeFileSync(path, content)
