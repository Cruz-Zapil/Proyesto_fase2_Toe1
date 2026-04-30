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

export default getProjects
