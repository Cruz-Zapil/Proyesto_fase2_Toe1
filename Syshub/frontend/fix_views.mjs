import fs from 'fs';

for (const view of ['Projects', 'Forums', 'Articles']) {
    const file = `src/views/${view}.vue`;
    if (!fs.existsSync(file)) continue;
    let content = fs.readFileSync(file, 'utf8');

    // 1. Add imports to script setup
    if (!content.includes('import { hideContent }')) {
        content = content.replace(
            "import { useAuthStore } from '../stores/authStore'",
            "import { useAuthStore } from '../stores/authStore'\nimport { hideContent } from '../api/moderation'"
        );
    }
    
    // 2. Add moderation state
    if (!content.includes('const showHideModal = ref(false)')) {
        const stateInject = `
const showHideModal = ref(false)
const hideMotive = ref('')
const itemToHide = ref<{ id: number, type: 'proyecto' | 'foro' | 'articulo' } | null>(null)

const openHideModal = (id: number, type: 'proyecto' | 'foro' | 'articulo') => {
  itemToHide.value = { id, type }
  hideMotive.value = ''
  showHideModal.value = true
}

const closeHideModal = () => {
  showHideModal.value = false
  itemToHide.value = null
  hideMotive.value = ''
}

const submitHide = async () => {
  if (!itemToHide.value || !hideMotive.value) return
  try {
    await hideContent(itemToHide.value.id, itemToHide.value.type as any, hideMotive.value)
    closeHideModal()
    window.location.reload()
  } catch (error) {
    console.error('Error ocultando contenido:', error)
    alert('Error al ocultar el contenido.')
  }
}
`;
        content = content.replace("const authStore = useAuthStore()", "const authStore = useAuthStore()\n" + stateInject);
    }

    // 3. Add Modal to bottom of template
    const modalHTML = `
  <- Hide Modal -->
  <div v-if="showHideModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
        <h2 class="text-xl font-bold text-gray-800">Ocultar Contenido</h2>
        <button @click="closeHideModal" class="text-gray-400 hover:text-gray-600">✕</button>
      </div>
      <div class="p-6 space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Motivo de ocultación</label>
          <select v-model="hideMotive" class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
            <option value="">Seleccione un motivo...</option>
            <option value="Contenido Inapropiado">Contenido Inapropiado</option>
            <option value="Spam / Publicidad">Spam / Publicidad</option>
            <option value="Lenguaje Ofensivo">Lenguaje Ofensivo</option>
            <option value="Plagio o Copia">Plagio o Copia</option>
            <option value="Otro">Otro</option>
          </select>
        </div>
      </div>
      <div class="px-6 py-4 bg-gray-50 flex justify-end gap-3">
        <button @click="closeHideModal" class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors">Cancelar</button>
        <button @click="submitHide" :disabled="!hideMotive" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors disabled:opacity-50">Ocultar Contenido</button>
      </div>
    </div>
  </div>
`;
    // Find last </template>
    const templateEndLastIndex = content.lastIndexOf('</template>');
    if (templateEndLastIndex !== -1 && !content.includes('Ocultar Contenido')) {
        content = content.slice(0, templateEndLastIndex) + modalHTML + '\n</template>' + content.slice(templateEndLastIndex + 11);
    }
    
    // 4. Inject Hide Button Into Cards
    // In Projects: it's inside `<div class="p-6">... <div class="flex justify-between items-center mt-6">`
    if (view === 'Projects' && !content.includes('Ocultar')) {
        content = content.replace(
            `</router-link>\n                        </div>\n                    </div>\n                </div>\n            </div>`,
            `</router-link>\n                            <button v-if="authStore.isModerator" @click.stop.prevent="openHideModal(project.id, 'proyecto')" class="ml-2 text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200">Ocultar</button>\n                        </div>\n                    </div>\n                </div>\n            </div>`
        );
        // Also map to only show unhidden! Wait, the API doesn't filter `oculto=true` by default?
        // By default, the database migration added `oculto BOOLEAN DEFAULT false`. We should filter frontend locally.
        content = content.replace("projects.value = data", "projects.value = data.filter(p => !p.oculto)");
    }
    
    if (view === 'Forums' && !content.includes('Ocultar')) {
        content = content.replace(
            `<span class="px-2 py-1 bg-green-100 text-green-700 rounded-full text-sm">Resuelto</span>\n                                </div>\n                            </div>`,
            `<span class="px-2 py-1 bg-green-100 text-green-700 rounded-full text-sm">Resuelto</span>\n                                </div>\n                                <button v-if="authStore.isModerator" @click.stop.prevent="openHideModal(thread.id, 'foro')" class="mt-2 text-xs bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200 self-start">Ocultar Hilo</button>\n                            </div>`
        );
        content = content.replace("threads.value = data", "threads.value = data.filter(t => !t.oculto)");
    }

    if (view === 'Articles' && !content.includes('Ocultar')) {
         content = content.replace(
            `<a :href="article.link" class="text-blue-600 font-semibold hover:text-blue-700">Leer más →</a>\n                        </div>\n                    </div>\n                </div>`,
            `<a :href="article.link" class="text-blue-600 font-semibold hover:text-blue-700">Leer más →</a>\n                            <button v-if="authStore.isModerator" @click.stop.prevent="openHideModal(article.id, 'articulo')" class="text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200">Ocultar</button>\n                        </div>\n                    </div>\n                </div>`
        );
        content = content.replace("articles.value = data", "articles.value = data.filter(a => !a.oculto)");
    }

    fs.writeFileSync(file, content);
}
console.log('Fixed views successfully');
