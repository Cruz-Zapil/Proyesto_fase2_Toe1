import API_URL, { getHeaders } from './api'

export async function getThreads() {
  const res = await fetch(`${API_URL}/forums/threads`, {
    headers: getHeaders(),
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Error al obtener hilos')
  return data
}

export async function getForumEtiquetas() {
  const res = await fetch(`${API_URL}/forums/etiquetas`, {
    headers: getHeaders(),
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Error al obtener etiquetas del foro')
  return data
}

export async function getMisCursosInscritos() {
  const res = await fetch(`${API_URL}/forums/mis-cursos-inscritos`, {
    headers: getHeaders(true),
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Error al obtener cursos inscritos')
  return data
}

export async function getThread(id: string) {
  const res = await fetch(`${API_URL}/forums/threads/${id}`, {
    headers: getHeaders(),
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Error al obtener hilo')
  return data
}

export async function getComments(threadId: string) {
  const res = await fetch(`${API_URL}/forums/threads/${threadId}/comments`, {
    headers: getHeaders(),
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Error al obtener comentarios')
  return data
}

export async function createThread(payload: any) {
  const res = await fetch(`${API_URL}/forums/threads`, {
    method: 'POST',
    headers: getHeaders(true),
    body: JSON.stringify(payload),
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Error al crear hilo')
  return data
}

export async function createComment(threadId: string, payload: any) {
  const res = await fetch(`${API_URL}/forums/threads/${threadId}/comments`, {
    method: 'POST',
    headers: getHeaders(true),
    body: JSON.stringify(payload),
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Error al crear comentario')
  return data
}

export async function voteThread(threadId: string, vote: 1 | -1) {
  const res = await fetch(`${API_URL}/forums/threads/${threadId}/vote`, {
    method: 'POST',
    headers: getHeaders(true),
    body: JSON.stringify({ vote }),
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Error al votar hilo')
  return data
}

export async function likeThread(threadId: string) {
  const res = await fetch(`${API_URL}/forums/threads/${threadId}/like`, {
    method: 'POST',
    headers: getHeaders(true),
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Error al dar like al hilo')
  return data
}

export async function dislikeThread(threadId: string) {
  const res = await fetch(`${API_URL}/forums/threads/${threadId}/dislike`, {
    method: 'POST',
    headers: getHeaders(true),
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Error al dar dislike al hilo')
  return data
}

export async function voteComment(commentId: string, vote: 1 | -1) {
  const res = await fetch(`${API_URL}/forums/comments/${commentId}/vote`, {
    method: 'POST',
    headers: getHeaders(true),
    body: JSON.stringify({ vote }),
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Error al votar comentario')
  return data
}

export async function likeComment(commentId: string) {
  const res = await fetch(`${API_URL}/forums/comments/${commentId}/like`, {
    method: 'POST',
    headers: getHeaders(true),
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Error al dar like al comentario')
  return data
}

export async function dislikeComment(commentId: string) {
  const res = await fetch(`${API_URL}/forums/comments/${commentId}/dislike`, {
    method: 'POST',
    headers: getHeaders(true),
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Error al dar dislike al comentario')
  return data
}
