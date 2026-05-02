<template>
  <div class="relative min-h-[calc(100vh-80px)]">
    <transition name="fade">
      <div v-if="adminUi.menuOpen" class="fixed inset-0 z-40 bg-slate-950/20 backdrop-blur-[2px]" @click="adminUi.closeMenu()"></div>
    </transition>

    <aside
      class="fixed left-0 top-[80px] z-50 h-[calc(100vh-80px)] w-full max-w-sm border-r border-blue-100 bg-white text-slate-800 shadow-2xl transition-transform duration-300 ease-out"
      :class="adminUi.menuOpen ? 'translate-x-0' : '-translate-x-full'"
      aria-label="Menú de administración"
    >
      <div class="flex h-full flex-col">
        <div class="border-b border-blue-100 bg-gradient-to-r from-blue-50 to-white p-6">
          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="text-xs uppercase tracking-[0.25em] text-blue-600">Panel admin</p>
              <h2 class="mt-2 text-2xl font-bold">Administración</h2>
              <p class="mt-2 text-sm text-slate-600">Selecciona una opción para renderizarla en el panel principal.</p>
            </div>
            <button class="text-3xl leading-none text-slate-400 hover:text-blue-600" @click="adminUi.closeMenu()">×</button>
          </div>
        </div>

        <nav class="flex-1 overflow-y-auto bg-gradient-to-b from-white to-blue-50/50 p-4 space-y-2">
          <button
            v-for="item in menuItems"
            :key="item.key"
            class="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition-colors"
            :class="adminUi.activeSection === item.key ? 'bg-blue-600 text-white font-semibold shadow-md' : 'border border-blue-100 bg-white text-slate-700 hover:bg-blue-50'"
            @click="adminUi.selectSection(item.key)"
          >
            <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-lg text-blue-700">{{ item.icon }}</span>
            <span class="flex-1">
              <span class="block text-sm uppercase tracking-[0.14em]">{{ item.label }}</span>
              <span class="block text-xs opacity-70">{{ item.description }}</span>
            </span>
          </button>
        </nav>

        <div class="border-t border-blue-100 bg-white p-4">
          <button class="w-full rounded-2xl border border-blue-100 px-4 py-3 text-sm text-slate-700 hover:bg-blue-50" @click="reloadAll">
            Recargar datos
          </button>
        </div>
      </div>
    </aside>

    <main class="ml-0 space-y-8 px-4 py-6 sm:px-6 lg:px-8">
      <div class="rounded-[2rem] bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 px-6 py-8 text-white shadow-2xl">
        <h1 class="text-4xl font-bold mb-2">🛠️ Administración</h1>
        <p class="max-w-3xl text-blue-50/90">
          Administra solicitudes, divisiones, carreras, cursos y ofertas. El menú esta en la esquina superior izquierda.
        </p>
      </div>

      <div v-if="loading" class="rounded-2xl bg-white p-12 text-center shadow">Cargando administración...</div>
      <div v-else-if="error" class="rounded-2xl border border-red-200 bg-red-50 p-12 text-center text-red-700 shadow">
        {{ error }}
      </div>

      <template v-else>
        <section v-if="adminUi.activeSection === 'overview'" class="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div class="xl:col-span-2 space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="rounded-2xl bg-white p-5 shadow border border-blue-100">
                <p class="text-sm text-slate-500">Usuarios pendientes</p>
                <p class="mt-2 text-3xl font-bold">{{ pendingUsers.length }}</p>
              </div>
              <div class="rounded-2xl bg-white p-5 shadow border border-blue-100">
                <p class="text-sm text-slate-500">Divisiones</p>
                <p class="mt-2 text-3xl font-bold">{{ divisions.length }}</p>
              </div>
              <div class="rounded-2xl bg-white p-5 shadow border border-blue-100">
                <p class="text-sm text-slate-500">Ofertas</p>
                <p class="mt-2 text-3xl font-bold">{{ courseOffers.length }}</p>
              </div>
            </div>

            <section class="rounded-2xl bg-white p-6 shadow space-y-4 border border-blue-100">
              <div class="flex items-center justify-between">
                <h2 class="text-2xl font-semibold">Últimas ofertas</h2>
                <button class="text-sm font-semibold text-blue-700 hover:text-blue-900" @click="adminUi.selectSection('offer')">Crear oferta</button>
              </div>
              <div v-if="!courseOffers.length" class="text-gray-500">Todavía no hay ofertas creadas.</div>
              <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <article v-for="offer in courseOffers.slice(0, 6)" :key="offer.id" class="rounded-2xl border border-blue-100 bg-blue-50/40 p-4">
                  <p class="font-semibold text-slate-900">{{ offer.cursoNombre || offer.cursoId }}</p>
                  <p class="text-sm text-slate-600">{{ offer.carreraNombre || offer.carreraId }}</p>
                  <p class="mt-2 text-xs text-slate-500">
                    Año: {{ offer.anioAcademico || 'N/D' }} · Ciclo: {{ offer.cicloAcademico || 'N/D' }} · Sección: {{ offer.seccion || 'N/D' }} · Cupo: {{ offer.cupo ?? 'N/D' }}
                  </p>
                </article>
              </div>
            </section>
          </div>

          <div class="space-y-6">
            <section class="rounded-2xl bg-white p-6 shadow space-y-4 border border-blue-100">
              <h2 class="text-2xl font-semibold">Pendientes de aprobación</h2>
              <div v-if="!pendingUsers.length" class="text-gray-500">No hay estudiantes pendientes.</div>
              <div v-else class="space-y-3 max-h-[440px] overflow-auto pr-1">
                <div v-for="user in pendingUsers" :key="user.id" class="rounded-xl border border-blue-100 p-4 space-y-3">
                  <div>
                    <p class="font-semibold">{{ user.nombre }} {{ user.apellidos }}</p>
                    <p class="text-sm text-gray-500">{{ user.email }}</p>
                    <p class="text-xs text-gray-400 mt-1">Estado: {{ user.estado }}</p>
                  </div>
                  <div class="flex gap-2">
                    <button class="flex-1 rounded-lg bg-green-600 px-3 py-2 text-sm font-semibold text-white" @click="approve(user.id)">
                      Aprobar
                    </button>
                    <button class="flex-1 rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white" @click="reject(user.id)">
                      Rechazar
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </section>

        <section v-else-if="adminUi.activeSection === 'users'" class="mx-auto max-w-6xl rounded-2xl bg-white p-6 shadow space-y-4 border border-blue-100">
          <div class="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p class="text-sm uppercase tracking-[0.18em] text-slate-500">Usuarios</p>
              <h2 class="text-3xl font-semibold">Lista completa de usuarios</h2>
              <p class="mt-2 text-slate-600">Cambia el estado de cualquier usuario. Si es estudiante, el sistema te pedirá la contraseña del admin.</p>
            </div>
            <span class="rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-700">{{ allUsers.length }} usuarios</span>
          </div>

          <div v-if="!allUsers.length" class="text-gray-500">No hay usuarios registrados.</div>

          <div v-else class="overflow-x-auto rounded-2xl border border-blue-100">
            <table class="min-w-full divide-y divide-blue-100 text-left">
              <thead class="bg-blue-50/60 text-sm uppercase tracking-[0.12em] text-slate-600">
                <tr>
                  <th class="px-4 py-3">Nombre</th>
                  <th class="px-4 py-3">Correo</th>
                  <th class="px-4 py-3">Rol</th>
                  <th class="px-4 py-3">Estado</th>
                  <th class="px-4 py-3">Acción</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-blue-50 bg-white">
                <tr v-for="user in allUsers" :key="user.id" class="align-top">
                  <td class="px-4 py-4">
                    <p class="font-semibold text-slate-900">{{ user.nombre }} {{ user.apellidos }}</p>
                    <p class="text-xs text-slate-500">{{ user.registroAcademico }}</p>
                  </td>
                  <td class="px-4 py-4 text-sm text-slate-700">{{ user.email }}</td>
                  <td class="px-4 py-4 text-sm text-slate-700">{{ user.rolNombre || 'N/D' }}</td>
                  <td class="px-4 py-4">
                    <select v-model="user.estadoEdicion" class="w-full rounded-lg border border-blue-100 px-3 py-2 text-sm">
                      <option v-for="state in userStateOptions" :key="state.value" :value="state.value">{{ state.label }}</option>
                    </select>
                  </td>
                  <td class="px-4 py-4">
                    <button
                      class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                      :disabled="savingUserStateId === user.id || user.estadoEdicion === user.estado"
                      @click="saveUserState(user)"
                    >
                      {{ savingUserStateId === user.id ? 'Guardando...' : 'Guardar estado' }}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section v-else-if="adminUi.activeSection === 'division'" class="mx-auto max-w-4xl rounded-2xl bg-white p-6 shadow space-y-4 border border-blue-100">
          <div>
            <p class="text-sm uppercase tracking-[0.18em] text-slate-500">Catálogo</p>
            <h2 class="text-3xl font-semibold">Crear división</h2>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input v-model="divisionForm.codigo" type="text" placeholder="Código" class="w-full rounded-lg border border-blue-100 px-4 py-3" />
            <input v-model="divisionForm.nombre" type="text" placeholder="Nombre" class="w-full rounded-lg border border-blue-100 px-4 py-3" />
            <textarea v-model="divisionForm.descripcion" rows="4" placeholder="Descripción" class="w-full rounded-lg border border-blue-100 px-4 py-3 md:col-span-2"></textarea>
          </div>
          <div class="flex justify-end">
            <button class="rounded-lg bg-blue-600 px-5 py-2 font-semibold text-white hover:bg-blue-700" :disabled="savingDivision" @click="submitDivision">
              {{ savingDivision ? 'Guardando...' : 'Crear división' }}
            </button>
          </div>
        </section>

        <section v-else-if="adminUi.activeSection === 'career'" class="mx-auto max-w-4xl rounded-2xl bg-white p-6 shadow space-y-4 border border-blue-100">
          <div>
            <p class="text-sm uppercase tracking-[0.18em] text-slate-500">Catálogo</p>
            <h2 class="text-3xl font-semibold">Crear carrera</h2>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input v-model="careerForm.nombre" type="text" placeholder="Nombre" class="w-full rounded-lg border border-blue-100 px-4 py-3" />
            <input v-model="careerForm.codigo" type="text" placeholder="Código (opcional)" class="w-full rounded-lg border border-blue-100 px-4 py-3" />
            <input v-model="careerForm.facultad" type="text" placeholder="Facultad" class="w-full rounded-lg border border-blue-100 px-4 py-3" />
            <select v-model="careerForm.divisionId" class="w-full rounded-lg border border-blue-100 px-4 py-3">
              <option value="">Selecciona división</option>
              <option v-for="division in divisions" :key="division.id" :value="division.id">{{ division.nombre }}</option>
            </select>
          </div>
          <div class="flex justify-end">
            <button class="rounded-lg bg-blue-600 px-5 py-2 font-semibold text-white hover:bg-blue-700" :disabled="savingCareer" @click="submitCareer">
              {{ savingCareer ? 'Guardando...' : 'Crear carrera' }}
            </button>
          </div>
        </section>

        <section v-else-if="adminUi.activeSection === 'course'" class="mx-auto max-w-4xl rounded-2xl bg-white p-6 shadow space-y-4 border border-blue-100">
          <div>
            <p class="text-sm uppercase tracking-[0.18em] text-slate-500">Catálogo</p>
            <h2 class="text-3xl font-semibold">Crear curso</h2>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input v-model="courseForm.nombre" type="text" placeholder="Nombre" class="w-full rounded-lg border border-blue-100 px-4 py-3" />
            <input v-model="courseForm.codigo" type="text" placeholder="Código" class="w-full rounded-lg border border-blue-100 px-4 py-3" />
            <input v-model.number="courseForm.semestre" type="number" min="1" placeholder="Semestre" class="w-full rounded-lg border border-blue-100 px-4 py-3" />
            <select v-model="courseForm.carreraId" class="w-full rounded-lg border border-blue-100 px-4 py-3">
              <option value="">Selecciona carrera</option>
              <option v-for="career in careers" :key="career.id" :value="career.id">{{ career.nombre }}</option>
            </select>
            <textarea v-model="courseForm.descripcion" rows="4" placeholder="Descripción" class="w-full rounded-lg border border-blue-100 px-4 py-3 md:col-span-2"></textarea>
          </div>
          <div class="flex justify-end">
            <button class="rounded-lg bg-blue-600 px-5 py-2 font-semibold text-white hover:bg-blue-700" :disabled="savingCourse" @click="submitCourse">
              {{ savingCourse ? 'Guardando...' : 'Crear curso' }}
            </button>
          </div>
        </section>

        <section v-else-if="adminUi.activeSection === 'offer'" class="mx-auto max-w-5xl space-y-6">
          <div class="rounded-2xl bg-white p-6 shadow space-y-4 border border-blue-100">
            <div>
              <p class="text-sm uppercase tracking-[0.18em] text-slate-500">Académico</p>
              <h2 class="text-3xl font-semibold">Crear oferta de curso</h2>
              <p class="mt-2 text-slate-600">Elige un curso, una sección, el ciclo académico y el año actual para publicar la oferta.</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select v-model="courseOfferForm.cursoId" class="w-full rounded-lg border border-blue-100 px-4 py-3">
                <option value="">Selecciona curso</option>
                <option v-for="course in courses" :key="course.id" :value="course.id">{{ course.nombre }}{{ course.carrera?.nombre ? ` — ${course.carrera.nombre}` : '' }}</option>
              </select>

              <input
                :value="selectedOfferCareerName"
                type="text"
                readonly
                placeholder="La carrera se asigna automáticamente"
                class="w-full rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-slate-700 md:col-span-2"
              />

              <input v-model="courseOfferForm.seccion" type="text" placeholder="Sección" class="w-full rounded-lg border border-blue-100 px-4 py-3" />
              <select v-model="courseOfferForm.cicloAcademico" class="w-full rounded-lg border border-blue-100 px-4 py-3">
                <option value="">Selecciona ciclo académico</option>
                <option v-for="cycle in cycleOptions" :key="cycle.value" :value="cycle.value">{{ cycle.label }}</option>
              </select>

              <input
                :value="currentAcademicYear"
                type="number"
                readonly
                class="w-full rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-slate-700"
              />

              <input v-model.number="courseOfferForm.cupo" type="number" min="0" placeholder="Cupo" class="w-full rounded-lg border border-blue-100 px-4 py-3 md:col-span-2" />
            </div>

            <p v-if="offerFormError" class="text-sm text-red-600">{{ offerFormError }}</p>
            <p v-else-if="duplicateOfferMessage" class="text-sm text-amber-700">{{ duplicateOfferMessage }}</p>

            <div class="flex justify-end">
              <button
                class="rounded-lg bg-blue-600 px-5 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                :disabled="savingOffer || !canSubmitOffer"
                @click="submitCourseOffer"
              >
                {{ savingOffer ? 'Creando...' : 'Crear oferta' }}
              </button>
            </div>
          </div>

          <div class="rounded-2xl bg-white p-6 shadow space-y-4 border border-blue-100">
            <div class="flex items-center justify-between">
              <h3 class="text-2xl font-semibold">Ofertas creadas</h3>
              <span class="rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-700">{{ courseOffers.length }}</span>
            </div>
            <div v-if="!courseOffers.length" class="text-gray-500">Todavía no hay ofertas creadas.</div>
            <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <article v-for="offer in courseOffers" :key="offer.id" class="rounded-2xl border border-blue-100 bg-blue-50/40 p-4">
                <p class="font-semibold text-slate-900">{{ offer.cursoNombre || offer.cursoId }}</p>
                <p class="text-sm text-slate-600">{{ offer.carreraNombre || offer.carreraId }}</p>
                <p class="mt-2 text-xs text-slate-500">
                  Año: {{ offer.anioAcademico || 'N/D' }} · Ciclo: {{ offer.cicloAcademico || 'N/D' }} · Sección: {{ offer.seccion || 'N/D' }} · Cupo: {{ offer.cupo ?? 'N/D' }}
                </p>
              </article>
            </div>
          </div>
        </section>

        <section v-else-if="adminUi.activeSection === 'teacher-requests'" class="mx-auto max-w-5xl rounded-2xl bg-white p-6 shadow space-y-4 border border-blue-100">
          <div>
            <p class="text-sm uppercase tracking-[0.18em] text-slate-500">Aprobaciones</p>
            <h2 class="text-3xl font-semibold">Postulaciones docentes</h2>
          </div>
          <div v-if="!teacherRequests.length" class="text-gray-500">No hay postulaciones docentes pendientes.</div>
          <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <article v-for="request in teacherRequests" :key="request.id" class="rounded-2xl border border-blue-100 p-4">
              <p class="font-semibold">{{ request.docenteNombre }} {{ request.docenteApellidos }}</p>
              <p class="text-sm text-slate-600">{{ request.cursoNombre }}</p>
              <p class="text-xs text-slate-500 mt-2">Rol: {{ request.rolDocente }} · Estado: {{ request.estadoSolicitud }}</p>
              <div class="mt-4 flex gap-2">
                <button class="flex-1 rounded-lg bg-green-600 px-3 py-2 text-sm font-semibold text-white" @click="approveTeacherRequest(request.id)">
                  Aprobar
                </button>
                <button class="flex-1 rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white" @click="rejectTeacherRequest(request.id)">
                  Rechazar
                </button>
              </div>
            </article>
          </div>
        </section>

        <section v-else-if="adminUi.activeSection === 'student-requests'" class="mx-auto max-w-5xl rounded-2xl bg-white p-6 shadow space-y-4 border border-blue-100">
          <div>
            <p class="text-sm uppercase tracking-[0.18em] text-slate-500">Aprobaciones</p>
            <h2 class="text-3xl font-semibold">Solicitudes de estudiantes</h2>
          </div>
          <div v-if="!studentRequests.length" class="text-gray-500">No hay solicitudes estudiantiles pendientes.</div>
          <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <article v-for="request in studentRequests" :key="request.id" class="rounded-2xl border border-blue-100 p-4">
              <p class="font-semibold">{{ request.estudianteNombre }} {{ request.estudianteApellidos }}</p>
              <p class="text-sm text-slate-600">{{ request.cursoNombre }}</p>
              <p class="text-xs text-slate-500 mt-2">Estado: {{ request.estadoSolicitud }} · Inscripción: {{ request.estadoInscripcion }}</p>
              <div class="mt-4 flex gap-2">
                <button class="flex-1 rounded-lg bg-green-600 px-3 py-2 text-sm font-semibold text-white" @click="approveStudentRequest(request.id)">
                  Aprobar
                </button>
                <button class="flex-1 rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white" @click="rejectStudentRequest(request.id)">
                  Rechazar
                </button>
              </div>
            </article>
          </div>
        </section>
      </template>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useAdminUiStore, type AdminSection } from '@/stores/adminUiStore'
import {
  approveStudentRequest as approveStudentRequestApi,
  approveTeacherRequest as approveTeacherRequestApi,
  approveUser,
  createCarrera,
  createCurso,
  createCursoOferta,
  createDivision,
  getAllAdminUsers,
  getCarreras,
  getCursoOfertas,
  getCursos,
  getDivisions,
  getPendingStudentRequests,
  getPendingTeacherRequests,
  getPendingUsers,
  rejectStudentRequest as rejectStudentRequestApi,
  rejectTeacherRequest as rejectTeacherRequestApi,
  rejectUser,
  updateAdminUserState,
} from '@/api/admin'

const adminUi = useAdminUiStore()

const loading = ref(false)
const error = ref<string | null>(null)
const pendingUsers = ref<any[]>([])
const allUsers = ref<any[]>([])
const divisions = ref<any[]>([])
const careers = ref<any[]>([])
const courses = ref<any[]>([])
const courseOffers = ref<any[]>([])
const teacherRequests = ref<any[]>([])
const studentRequests = ref<any[]>([])
const savingDivision = ref(false)
const savingCareer = ref(false)
const savingCourse = ref(false)
const savingOffer = ref(false)
const savingUserStateId = ref<string | null>(null)
const offerFormError = ref<string | null>(null)

const userStateOptions = [
  { value: 'activo', label: 'Activo' },
  { value: 'pendiente', label: 'Pendiente' },
  { value: 'suspendido', label: 'Suspendido' },
  { value: 'eliminado', label: 'Eliminado' },
]

const currentAcademicYear = new Date().getFullYear()
const cycleOptions = [
  { value: 'primero', label: 'Primer - Semestre' },
  { value: 'segundo', label: 'Segundo - Semestre' },
]

const divisionForm = ref({ codigo: '', nombre: '', descripcion: '' })
const careerForm = ref({ nombre: '', codigo: '', facultad: '', divisionId: '' })
const courseForm = ref({ nombre: '', codigo: '', semestre: 1, descripcion: '', carreraId: '' })
const courseOfferForm = ref({
  cursoId: '',
  seccion: '',
  cicloAcademico: '',
  anioAcademico: currentAcademicYear,
  cupo: undefined as number | undefined,
})

const selectedOfferCourse = computed(() =>
  courses.value.find((course) => course.id === courseOfferForm.value.cursoId) || null,
)

const selectedOfferCareerName = computed(() => selectedOfferCourse.value?.carrera?.nombre || 'La carrera se asigna automáticamente')

const normalizedOfferSeccion = computed(() => courseOfferForm.value.seccion.trim().toUpperCase())
const normalizedOfferCycle = computed(() => courseOfferForm.value.cicloAcademico.trim().toLowerCase())

const duplicateOffer = computed(() => {
  if (!selectedOfferCourse.value || !normalizedOfferSeccion.value || !normalizedOfferCycle.value) {
    return null
  }

  return (
    courseOffers.value.find((offer) => {
      return (
        offer.cursoId === selectedOfferCourse.value?.id &&
        String(offer.seccion || '').trim().toUpperCase() === normalizedOfferSeccion.value &&
        String(offer.cicloAcademico || '').trim().toLowerCase() === normalizedOfferCycle.value &&
        Number(offer.anioAcademico) === currentAcademicYear
      )
    }) || null
  )
})

const canSubmitOffer = computed(() => {
  return Boolean(
    selectedOfferCourse.value &&
      normalizedOfferSeccion.value &&
      normalizedOfferCycle.value &&
      courseOfferForm.value.anioAcademico === currentAcademicYear &&
      !duplicateOffer.value,
  )
})

const duplicateOfferMessage = computed(() =>
  duplicateOffer.value ? 'Ya existe una oferta con el mismo curso, ciclo, año y sección.' : '',
)

const menuItems: { key: AdminSection; label: string; description: string; icon: string }[] = [
  { key: 'overview', label: 'Resumen', description: 'Vista general y pendientes', icon: '📊' },
  { key: 'users', label: 'Usuarios', description: 'Tabla y estados de usuarios', icon: '👥' },
  { key: 'division', label: 'División', description: 'Crear división académica', icon: '🏛️' },
  { key: 'career', label: 'Carrera', description: 'Crear carrera nueva', icon: '🎓' },
  { key: 'course', label: 'Curso', description: 'Crear curso base', icon: '📚' },
  { key: 'offer', label: 'Oferta curso', description: 'Crear curso_oferta por ciclo', icon: '🗂️' },
  { key: 'teacher-requests', label: 'Docentes', description: 'Postulaciones por aprobar', icon: '👩‍🏫' },
  { key: 'student-requests', label: 'Estudiantes', description: 'Solicitudes por aprobar', icon: '🧑‍🎓' },
]

async function loadAll() {
  loading.value = true
  error.value = null

  try {
    const [pendingData, usersData, divisionsData, careersData, coursesData, offersData, teacherData, studentData] = await Promise.all([
      getPendingUsers(),
      getAllAdminUsers(),
      getDivisions(),
      getCarreras(),
      getCursos(),
      getCursoOfertas(),
      getPendingTeacherRequests(),
      getPendingStudentRequests(),
    ])

    pendingUsers.value = pendingData
  allUsers.value = usersData.map((user: any) => ({ ...user, estadoEdicion: user.estado }))
    divisions.value = divisionsData
    careers.value = careersData
    courses.value = coursesData
    courseOffers.value = offersData
    teacherRequests.value = teacherData
    studentRequests.value = studentData
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

async function saveUserState(user: any) {
  if (!user.estadoEdicion || user.estadoEdicion === user.estado) return

  let adminPassword: string | undefined
  if (String(user.rolNombre || '').toLowerCase() === 'estudiante') {
    const password = window.prompt(`Ingresa tu contraseña de admin para cambiar el estado de ${user.nombre} ${user.apellidos}`)
    if (!password) return
    adminPassword = password
  }

  savingUserStateId.value = user.id
  try {
    await updateAdminUserState(user.id, {
      estado: user.estadoEdicion,
      adminPassword,
    })
    await loadAll()
  } finally {
    savingUserStateId.value = null
  }
}

async function approveTeacherRequest(id: string) {
  await approveTeacherRequestApi(id)
  await loadAll()
}

async function rejectTeacherRequest(id: string) {
  await rejectTeacherRequestApi(id)
  await loadAll()
}

async function approveStudentRequest(id: string) {
  await approveStudentRequestApi(id)
  await loadAll()
}

async function rejectStudentRequest(id: string) {
  await rejectStudentRequestApi(id)
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

async function submitCourseOffer() {
  offerFormError.value = null

  if (!canSubmitOffer.value) {
    offerFormError.value = duplicateOffer.value
      ? 'Ya existe una oferta con esa combinación.'
      : 'Completa curso, sección, ciclo y año actual.'
    return
  }

  savingOffer.value = true
  try {
    await createCursoOferta({
      cursoId: courseOfferForm.value.cursoId,
      seccion: normalizedOfferSeccion.value,
      cicloAcademico: normalizedOfferCycle.value,
      anioAcademico: courseOfferForm.value.anioAcademico,
      cupo: typeof courseOfferForm.value.cupo === 'number' ? courseOfferForm.value.cupo : undefined,
    })
    courseOfferForm.value = {
      cursoId: '',
      seccion: '',
      cicloAcademico: '',
      anioAcademico: currentAcademicYear,
      cupo: undefined,
    }
    await loadAll()
  } catch (err: any) {
    offerFormError.value = err.message || 'Error al crear la oferta'
  } finally {
    savingOffer.value = false
  }
}

onMounted(loadAll)
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
