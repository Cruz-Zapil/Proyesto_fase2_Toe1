import API_URL, { getHeaders } from './api'

export async function getProjects() {
  const res = await fetch(`${API_URL}/projects`, {
    headers: getHeaders(),
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.message || 'Error al obtener proyectos')
  }

  return data
}

export async function getAreasTecnicas() {
  const res = await fetch(`${API_URL}/projects/areas-tecnicas`, {
    headers: getHeaders(),
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.message || 'Error al obtener categorías')
  }

  return data
}

export async function getEtiquetas() {
  const res = await fetch(`${API_URL}/projects/etiquetas`, {
    headers: getHeaders(),
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.message || 'Error al obtener etiquetas')
  }

  return data
}

export async function getTecnologias() {
  const res = await fetch(`${API_URL}/projects/tecnologias`, {
    headers: getHeaders(),
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.message || 'Error al obtener tecnologías')
  }

  return data
}

export async function getMisCursos() {
  const res = await fetch(`${API_URL}/projects/mis-cursos`, {
    headers: getHeaders(true),
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.message || 'Error al obtener cursos del usuario')
  }

  return data
}

export async function createProject(payload: any) {
  const res = await fetch(`${API_URL}/projects`, {
    method: 'POST',
    headers: getHeaders(true),
    body: JSON.stringify(payload),
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.message || 'Error al crear proyecto')
  }

  return data
}

export default getProjects
