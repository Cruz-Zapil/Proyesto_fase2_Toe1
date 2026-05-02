import API_URL, { getHeaders } from './api'

async function requestJson(url: string, options: RequestInit = {}) {
  const response = await fetch(url, {
    ...options,
    headers: getHeaders(true),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Error en admin')
  }

  return data
}

export function getPendingUsers() {
  return requestJson(`${API_URL}/admin/pendientes`)
}

export function getAllAdminUsers() {
  return requestJson(`${API_URL}/admin/users`)
}

export function getDivisions() {
  return requestJson(`${API_URL}/admin/divisions`)
}

export function getCarreras() {
  return requestJson(`${API_URL}/admin/carreras`)
}

export function getCursos() {
  return requestJson(`${API_URL}/admin/cursos`)
}

export function approveUser(id: string) {
  return requestJson(`${API_URL}/admin/users/${id}/aprobar`, { method: 'PUT' })
}

export function rejectUser(id: string) {
  return requestJson(`${API_URL}/admin/users/${id}/rechazar`, { method: 'PUT' })
}

export function createDivision(payload: { codigo: string; nombre: string; descripcion?: string }) {
  return requestJson(`${API_URL}/admin/divisions`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function createCarrera(payload: { nombre: string; codigo?: string; facultad?: string; divisionId: string }) {
  return requestJson(`${API_URL}/admin/carreras`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function createCurso(payload: {
  nombre: string
  codigo: string
  semestre: number
  descripcion?: string
  carreraId: string
  activo?: boolean
}) {
  return requestJson(`${API_URL}/admin/cursos`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}