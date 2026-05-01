<template>
    <div class="space-y-8">
        <div class="flex justify-between items-start md:items-center flex-col md:flex-row gap-4">
            <div>
                <h1 class="text-4xl font-bold mb-2">💬 Foros de Discusión</h1>
                <p class="text-gray-600">Participa en discusiones, vota respuestas y aprende de la comunidad</p>
            </div>
            <button class="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
                @click="showCreateForm = !showCreateForm">
                + Nueva Discusión
            </button>
        </div>

        <div v-if="showCreateForm" class="bg-white p-6 rounded-2xl shadow-md space-y-4">
            <h2 class="text-2xl font-semibold">Crear discusión</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input v-model="newThread.title" type="text" placeholder="Título"
                    class="w-full px-4 py-3 border rounded-lg md:col-span-2" />

                <select v-model="newThread.cursoId" class="w-full px-4 py-3 border rounded-lg md:col-span-2">
                    <option value="">Sin curso asociado</option>
                    <option v-for="curso in cursosInscritos" :key="curso.id" :value="curso.id">{{ curso.nombre }}
                    </option>
                </select>

                <textarea v-model="newThread.contenido" rows="5" placeholder="Contenido"
                    class="w-full px-4 py-3 border rounded-lg md:col-span-2"></textarea>
            </div>

            <div class="space-y-2">
                <p class="text-sm font-semibold text-gray-700">Etiquetas</p>
                <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
                    <label v-for="tag in etiquetas" :key="tag.id"
                        class="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50">
                        <input v-model="newThread.etiquetaIds" type="checkbox" :value="tag.id" />
                        <span class="text-sm">{{ tag.nombre }}</span>
                    </label>
                </div>
            </div>

            <div class="flex justify-end">
                <button class="px-5 py-2 rounded-lg bg-blue-600 text-white font-semibold" :disabled="creating"
                    @click="submitThread">
                    {{ creating ? 'Creando...' : 'Publicar' }}
                </button>
            </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow-md space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input v-model="searchQuery" type="text" placeholder="Buscar temas..."
                    class="w-full px-4 py-2 border rounded-lg" />

                <select v-model="selectedTag" class="w-full px-4 py-2 border rounded-lg">
                    <option value="">Todas las etiquetas</option>
                    <option v-for="tag in etiquetas" :key="tag.id" :value="tag.nombre">{{ tag.nombre }}</option>
                </select>

                <select v-model="sortBy" class="w-full px-4 py-2 border rounded-lg">
                    <option value="recent">Más Recientes</option>
                    <option value="popular">Más Comentados</option>
                    <option value="trending">Mejor score</option>
                    <option value="unanswered">Sin Responder</option>
                </select>
            </div>
        </div>

        <div v-if="loading" class="bg-gray-100 rounded-lg p-12 text-center">Cargando foros...</div>
        <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-12 text-center text-red-700">{{ error
            }}</div>

        <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div class="lg:col-span-1 space-y-4">
                <div v-if="!filteredThreads.length" class="bg-gray-100 rounded-lg p-8 text-center">No hay discusiones
                    aún</div>

                <button v-for="thread in filteredThreads" :key="thread.id"
                    class="w-full text-left bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-4 border-l-4 border-blue-500"
                    :class="selectedThreadId === thread.id ? 'ring-2 ring-blue-500' : ''"
                    @click="openThread(thread.id)">
                    <div class="flex justify-between gap-3 mb-2">
                        <h3 class="font-semibold text-gray-900 line-clamp-2">{{ thread.titulo }}</h3>
                        <span class="text-xs px-2 py-1 rounded-full bg-gray-100">{{ thread.estado }}</span>
                    </div>
                    <p class="text-sm text-gray-600 line-clamp-2 mb-3">{{ thread.contenido }}</p>

                    <div class="flex flex-wrap gap-1 mb-3">
                        <span v-for="tag in thread.etiquetas || []" :key="`${thread.id}-${tag.id}`"
                            class="px-2 py-1 rounded-full text-xs bg-blue-50 text-blue-700">
                            #{{ tag.nombre }}
                        </span>
                    </div>

                    <div class="flex items-center justify-between text-xs text-gray-500">
                        <span>{{ thread.autorNombre }} {{ thread.autorApellidos }}</span>
                        <span>{{ thread.comentariosCount }} comentarios</span>
                    </div>
                    <div class="mt-3 flex items-center justify-between text-sm">
                        <span class="font-semibold text-blue-600">Like {{ thread.score }}</span>
                        <span class="text-gray-500">👁 {{ thread.vistas }}</span>
                    </div>
                </button>
            </div>

            <div class="lg:col-span-2 space-y-4">
                <div v-if="!selectedThread" class="bg-white rounded-2xl shadow p-8 text-gray-600 text-center">Selecciona
                    un hilo para ver el detalle</div>

                <template v-else>
                    <div class="bg-white rounded-2xl shadow p-8 space-y-4">
                        <div>
                            <h2 class="text-3xl font-bold">{{ selectedThread.titulo }}</h2>
                            <p class="text-gray-500 mt-1">por {{ selectedThread.autorNombre }} {{
                                selectedThread.autorApellidos }}</p>
                        </div>

                        <p class="text-gray-700 whitespace-pre-line">{{ selectedThread.contenido }}</p>

                        <div class="flex flex-wrap gap-2">
                            <span v-for="tag in selectedThread.etiquetas || []"
                                :key="`detail-${selectedThread.id}-${tag.id}`"
                                class="px-2 py-1 rounded-full text-xs bg-blue-50 text-blue-700">
                                #{{ tag.nombre }}
                            </span>
                        </div>

                        <div class="flex flex-wrap gap-2 text-sm text-gray-500">
                            <span>Estado: {{ selectedThread.estado }}</span>
                            <span>·</span>
                            <span>Curso: {{ selectedThread.cursoNombre || 'Sin curso' }}</span>
                            <span>·</span>
                            <span>Vistas: {{ selectedThread.vistas }}</span>
                        </div>

                        <div class="flex items-center gap-4 pt-2 border-t border-gray-200">
                            <button @click="likeSelectedThread" class="flex items-center gap-2 text-2xl hover:scale-110 transition-transform">👍 {{ selectedThread.score }}</button>
                            <button @click="dislikeSelectedThread" class="flex items-center gap-2 text-2xl hover:scale-110 transition-transform">👎</button>
                        </div>
                    </div>



                    <div class="bg-white rounded-2xl shadow p-6 space-y-4">
                        <h3 class="text-xl font-semibold">Comentarios ({{ comments.length }})</h3>
                        <div v-if="!comments.length" class="text-gray-500">Aún no hay comentarios.</div>
                        <div v-else class="space-y-4">
                            <CommentTree v-for="comment in commentTree" :key="comment.id" :comment="comment"
                                :children="comment.children || []" @reply="startReply" @submit-reply="submitInlineReply"
                                @like="likeCommentById" @dislike="dislikeCommentById" />
                        </div>
                    </div>



                    <div class="bg-white rounded-2xl shadow p-6 space-y-4">
                        <h3 class="text-xl font-semibold">Responder</h3>
                        <div v-if="replyingTo"
                            class="rounded-lg bg-blue-50 p-3 text-sm text-blue-700 flex items-center justify-between gap-3">
                            <span>Respondiendo a {{ replyingTo.usuarioNombre }} {{ replyingTo.usuarioApellidos }}</span>
                            <button class="font-semibold" @click="clearReply">Cancelar</button>
                        </div>
                        <textarea v-model="newComment" rows="4" class="w-full px-4 py-3 border rounded-lg"
                            placeholder="Escribe un comentario..."></textarea>
                        <div class="flex justify-end">
                            <button class="px-5 py-2 rounded-lg bg-blue-600 text-white font-semibold"
                                :disabled="commenting" @click="submitComment">
                                {{ commenting ? 'Publicando...' : 'Comentar' }}
                            </button>
                        </div>
                    </div>

                </template>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import CommentTree from '@/components/CommentTree.vue'
import {
    createComment,
    createThread,
    getComments,
    getForumEtiquetas,
    getMisCursosInscritos,
    getThread,
    getThreads,
    likeComment,
    likeThread,
    dislikeComment,
    dislikeThread,
    voteComment,
    voteThread,
} from '@/api/forums'

const searchQuery = ref('')
const selectedTag = ref('')
const sortBy = ref('recent')
const loading = ref(false)
const error = ref<string | null>(null)
const threads = ref<any[]>([])
const comments = ref<any[]>([])
const commentTree = ref<any[]>([])
const etiquetas = ref<any[]>([])
const cursosInscritos = ref<any[]>([])
const selectedThreadId = ref<string>('')
const selectedThread = ref<any>(null)
const replyingTo = ref<any>(null)
const showCreateForm = ref(false)
const creating = ref(false)
const commenting = ref(false)
const newComment = ref('')
const newThread = ref({
    title: '',
    contenido: '',
    cursoId: '',
    etiquetaIds: [] as string[],
})

async function loadThreads() {
    loading.value = true
    error.value = null

    try {
        const [threadsData, tagsData, cursosData] = await Promise.all([
            getThreads(),
            getForumEtiquetas(),
            getMisCursosInscritos(),
        ])

        threads.value = threadsData
        etiquetas.value = tagsData
        cursosInscritos.value = cursosData

        if (!selectedThreadId.value && threads.value.length) {
            await openThread(threads.value[0].id)
        } else if (selectedThreadId.value) {
            await openThread(selectedThreadId.value)
        }
    } catch (err: any) {
        error.value = err.message || 'Error al cargar foros'
    } finally {
        loading.value = false
    }
}

async function openThread(id: string) {
    selectedThreadId.value = id
    selectedThread.value = await getThreadDetail(id)
    comments.value = await getComments(id)
    commentTree.value = buildCommentTree(comments.value)
}

async function getThreadDetail(id: string) {
    const thread = threads.value.find(t => t.id === id)
    if (thread) return thread

    return getThread(id)
}

async function submitThread() {
    creating.value = true
    error.value = null

    try {
        const created = await createThread({
            titulo: newThread.value.title,
            contenido: newThread.value.contenido,
            cursoId: newThread.value.cursoId || null,
            etiquetaIds: newThread.value.etiquetaIds,
        })

        newThread.value = { title: '', contenido: '', cursoId: '', etiquetaIds: [] }
        showCreateForm.value = false
        await loadThreads()
        await openThread(created.id)
    } catch (err: any) {
        error.value = err.message || 'No se pudo crear el hilo'
    } finally {
        creating.value = false
    }
}

async function submitComment() {
    if (!selectedThreadId.value) return
    commenting.value = true

    try {
        await createComment(selectedThreadId.value, {
            contenido: newComment.value,
            padreId: replyingTo.value?.id || null,
        })
        newComment.value = ''
        replyingTo.value = null
        comments.value = await getComments(selectedThreadId.value)
        commentTree.value = buildCommentTree(comments.value)
        selectedThread.value = await getThreadDetail(selectedThreadId.value)
    } catch (err: any) {
        error.value = err.message || 'No se pudo crear el comentario'
    } finally {
        commenting.value = false
    }
}

async function likeSelectedThread() {
    if (!selectedThreadId.value) return
    await likeThread(selectedThreadId.value)
    await loadThreads()
    selectedThread.value = await getThreadDetail(selectedThreadId.value)
}

async function dislikeSelectedThread() {
    if (!selectedThreadId.value) return
    await dislikeThread(selectedThreadId.value)
    await loadThreads()
    selectedThread.value = await getThreadDetail(selectedThreadId.value)
}

function startReply(comment: any) {
    replyingTo.value = comment
    newComment.value = `@${comment.usuarioNombre} ${comment.usuarioApellidos} `
}

async function submitInlineReply(payload: { parentId: string; text: string }) {
    if (!selectedThreadId.value) return

    await createComment(selectedThreadId.value, {
        contenido: payload.text,
        padreId: payload.parentId,
    })

    comments.value = await getComments(selectedThreadId.value)
    commentTree.value = buildCommentTree(comments.value)
    selectedThread.value = await getThreadDetail(selectedThreadId.value)
}

function clearReply() {
    replyingTo.value = null
    newComment.value = ''
}

async function likeCommentById(commentId: string) {
    await likeComment(commentId)
    comments.value = await getComments(selectedThreadId.value)
    commentTree.value = buildCommentTree(comments.value)
}

async function dislikeCommentById(commentId: string) {
    await dislikeComment(commentId)
    comments.value = await getComments(selectedThreadId.value)
    commentTree.value = buildCommentTree(comments.value)
}

function buildCommentTree(flatComments: any[]) {
    const map = new Map<string, any>()
    const roots: any[] = []

    flatComments.forEach(comment => {
        map.set(comment.id, { ...comment, children: [] })
    })

    flatComments.forEach(comment => {
        const node = map.get(comment.id)
        if (comment.padreId && map.has(comment.padreId)) {
            map.get(comment.padreId).children.push(node)
        } else {
            roots.push(node)
        }
    })

    return roots
}

const filteredThreads = computed(() => {
    let filtered = [...threads.value]

    if (searchQuery.value) {
        const q = searchQuery.value.toLowerCase()
        filtered = filtered.filter(
            t =>
                t.titulo?.toLowerCase().includes(q) ||
                t.contenido?.toLowerCase().includes(q) ||
                `${t.autorNombre || ''} ${t.autorApellidos || ''}`.toLowerCase().includes(q),
        )
    }

    if (selectedTag.value) {
        filtered = filtered.filter((t: any) => (t.etiquetas || []).some((tag: any) => tag.nombre === selectedTag.value))
    }

    if (sortBy.value === 'popular') {
        filtered.sort((a, b) => Number(b.comentariosCount || 0) - Number(a.comentariosCount || 0))
    } else if (sortBy.value === 'trending') {
        filtered.sort((a, b) => Number(b.score || 0) - Number(a.score || 0))
    } else if (sortBy.value === 'unanswered') {
        filtered = filtered.filter(t => Number(t.comentariosCount || 0) === 0)
    } else {
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }

    return filtered
})

onMounted(loadThreads)
</script>
