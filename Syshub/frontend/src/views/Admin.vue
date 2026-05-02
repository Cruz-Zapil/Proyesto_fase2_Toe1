<template>
  <div class="space-y-8">
    <div class="flex justify-between items-start md:items-center flex-col md:flex-row gap-4">
      <div>
        <h1 class="text-4xl font-bold mb-2">🛠️ Administración</h1>
        <p class="text-gray-600">Aprueba estudiantes y gestiona divisiones, carreras y cursos</p>
      </div>
      <button
        class="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
        @click="reloadAll"
      >
        Recargar datos
      </button>
    </div>

    <div v-if="loading" class="bg-gray-100 rounded-lg p-12 text-center">Cargando administración...</div>
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-12 text-center text-red-700">{{ error }}</div>

    <div v-else class="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <div class="xl:col-span-1 space-y-6">
        <section class="bg-white rounded-2xl shadow p-6 space-y-4">
          <h2 class="text-2xl font-semibold">Pendientes de aprobación</h2>
          <div v-if="!pendingUsers.length" class="text-gray-500">No hay estudiantes pendientes.</div>
          <div v-else class="space-y-3">
            <div v-for="user in pendingUsers" :key="user.id" class="border rounded-xl p-4 space-y-3">
              <div>
                <p class="font-semibold">{{ user.nombre }} {{ user.apellidos }}</p>
                <p class="text-sm text-gray-500">{{ user.email }}</p>
                <p class="text-xs text-gray-400 mt-1">Estado: {{ user.estado }}</p>
              </div>
              <div class="flex gap-2">
                <button class="flex-1 px-3 py-2 rounded-lg bg-green-600 text-white text-sm font-semibold" @click="approve(user.id)">
                  Aprobar
                </button>
                <button class="flex-1 px-3 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold" @click="reject(user.id)">
                  Rechazar
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div class="xl:col-span-2 space-y-6">
        <section class="bg-white rounded-2xl shadow p-6 space-y-4">
          <h2 class="text-2xl font-semibold">Crear división</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input v-model="divisionForm.codigo" type="text" placeholder="Código" class="w-full px-4 py-3 border rounded-lg" />
            <input v-model="divisionForm.nombre" type="text" placeholder="Nombre" class="w-full px-4 py-3 border rounded-lg" />
            <textarea v-model="divisionForm.descripcion" rows="3" placeholder="Descripción" class="w-full px-4 py-3 border rounded-lg md:col-span-2"></textarea>
          </div>
          <div class="flex justify-end">
            <button class="px-5 py-2 rounded-lg bg-blue-600 text-white font-semibold" :disabled="savingDivision" @click="submitDivision">
              {{ savingDivision ? 'Guardando...' : 'Crear división' }}
            </button>
          </div>
        </section>

        <section class="bg-white rounded-2xl shadow p-6 space-y-4">
          <h2 class="text-2xl font-semibold">Crear carrera</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input v-model="careerForm.nombre" type="text" placeholder="Nombre" class="w-full px-4 py-3 border rounded-lg" />
            <input v-model="careerForm.codigo" type="text" placeholder="Código (opcional)" class="w-full px-4 py-3 border rounded-lg" />
            <input v-model="careerForm.facultad" type="text" placeholder="Facultad" class="w-full px-4 py-3 border rounded-lg" />
            <select v-model="careerForm.divisionId" class="w-full px-4 py-3 border rounded-lg">
              <option value="">Selecciona división</option>
              <option v-for="division in divisions" :key="division.id" :value="division.id">{{ division.nombre }}</option>
            </select>
          </div>
          <div class="flex justify-end">
            <button class="px-5 py-2 rounded-lg bg-blue-600 text-white font-semibold" :disabled="savingCareer" @click="submitCareer">
              {{ savingCareer ? 'Guardando...' : 'Crear carrera' }}
            </button>
          </div>
        </section>

        <section class="bg-white rounded-2xl shadow p-6 space-y-4">
          <h2 class="text-2xl font-semibold">Crear curso</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input v-model="courseForm.nombre" type="text" placeholder="Nombre" class="w-full px-4 py-3 border rounded-lg" />
            <input v-model="courseForm.codigo" type="text" placeholder="Código" class="w-full px-4 py-3 border rounded-lg" />
            <input v-model.number="courseForm.semestre" type="number" min="1" placeholder="Semestre" class="w-full px-4 py-3 border rounded-lg" />
            <select v-model="courseForm.carreraId" class="w-full px-4 py-3 border rounded-lg">
              <option value="">Selecciona carrera</option>
              <option v-for="career in careers" :key="career.id" :value="career.id">{{ career.nombre }}</option>
            </select>
            <textarea v-model="courseForm.descripcion" rows="3" placeholder="Descripción" class="w-full px-4 py-3 border rounded-lg md:col-span-2"></textarea>
          </div>
          <div class="flex justify-end">
            <button class="px-5 py-2 rounded-lg bg-blue-600 text-white font-semibold" :disabled="savingCourse" @click="submitCourse">
              {{ savingCourse ? 'Guardando...' : 'Crear curso' }}
            </button>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import {
  approveUser,
  createCarrera,
  createCurso,
  createDivision,
  getAllAdminUsers,
  getCarreras,
  getCursos,
  getDivisions,
  getPendingUsers,
  rejectUser,
} from '@/api/admin'

const loading = ref(false)
const error = ref<string | null>(null)
const pendingUsers = ref<any[]>([])
const divisions = ref<any[]>([])
const careers = ref<any[]>([])
const courses = ref<any[]>([])
const savingDivision = ref(false)
const savingCareer = ref(false)
const savingCourse = ref(false)

const divisionForm = ref({ codigo: '', nombre: '', descripcion: '' })
const careerForm = ref({ nombre: '', codigo: '', facultad: '', divisionId: '' })
const courseForm = ref({ nombre: '', codigo: '', semestre: 1, descripcion: '', carreraId: '' })

async function loadAll() {
  loading.value = true
  error.value = null

  try {
    const [pendingData, divisionsData, careersData, coursesData] = await Promise.all([
      getPendingUsers(),
      getDivisions(),
      getCarreras(),
      getCursos(),
    ])

    pendingUsers.value = pendingData
    divisions.value = divisionsData
    careers.value = careersData
    courses.value = coursesData
  } catch (err: any) {
    error.value = err.message || 'Error al cargar administración'
  } finally {
    loading.value = false
  }
}

async function reloadAll() {
  await loadAll()
}

async function approve(id: string) {
  await approveUser(id)
  await loadAll()
}

async function reject(id: string) {
  await rejectUser(id)
  await loadAll()
}

async function submitDivision() {
  if (!divisionForm.value.codigo || !divisionForm.value.nombre) return

  savingDivision.value = true
  try {
    await createDivision({
      codigo: divisionForm.value.codigo,
      nombre: divisionForm.value.nombre,
      descripcion: divisionForm.value.descripcion || undefined,
    })
    divisionForm.value = { codigo: '', nombre: '', descripcion: '' }
    await loadAll()
  } finally {
    savingDivision.value = false
  }
}

async function submitCareer() {
  if (!careerForm.value.nombre || !careerForm.value.divisionId) return

  savingCareer.value = true
  try {
    await createCarrera({
      nombre: careerForm.value.nombre,
      codigo: careerForm.value.codigo || undefined,
      facultad: careerForm.value.facultad || undefined,
      divisionId: careerForm.value.divisionId,
    })
    careerForm.value = { nombre: '', codigo: '', facultad: '', divisionId: '' }
    await loadAll()
  } finally {
    savingCareer.value = false
  }
}

async function submitCourse() {
  if (!courseForm.value.nombre || !courseForm.value.codigo || !courseForm.value.carreraId) return

  savingCourse.value = true
  try {
    await createCurso({
      nombre: courseForm.value.nombre,
      codigo: courseForm.value.codigo,
      semestre: Number(courseForm.value.semestre),
      descripcion: courseForm.value.descripcion || undefined,
      carreraId: courseForm.value.carreraId,
    })
    courseForm.value = { nombre: '', codigo: '', semestre: 1, descripcion: '', carreraId: '' }
    await loadAll()
  } finally {
    savingCourse.value = false
  }
}

onMounted(loadAll)
</script>