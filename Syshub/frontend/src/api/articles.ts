import API_URL, { getHeaders } from './api'

export async function getArticles(publicadoOnly = true) {
  const response = await fetch(`${API_URL}/articles?publicadoOnly=${publicadoOnly}`, {
    method: 'GET',
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error('Error al obtener artículos');
  return response.json();
}

export async function getArticle(id: string) {
  const response = await fetch(`${API_URL}/articles/${id}`, {
    method: 'GET',
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error('Error al obtener el artículo');
  return response.json();
}

export async function getArticleBySlug(slug: string) {
  const response = await fetch(`${API_URL}/articles/slug/${slug}`, {
    method: 'GET',
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error('Error al obtener el artículo');
  return response.json();
}

export async function createArticle(data: any) {
  const response = await fetch(`${API_URL}/articles`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Error al crear artículo');
  return response.json();
}

export async function updateArticle(id: string, data: any) {
  const response = await fetch(`${API_URL}/articles/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Error al actualizar artículo');
  return response.json();
}

export async function publishArticle(id: string) {
  const response = await fetch(`${API_URL}/articles/${id}/publish`, {
    method: 'POST',
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error('Error al publicar artículo');
  return response.json();
}

export async function deleteArticle(id: string) {
  const response = await fetch(`${API_URL}/articles/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error('Error al eliminar artículo');
  return response.json();
}

export async function getArticleEtiquetas() {
  const response = await fetch(`${API_URL}/articles/etiquetas`, {
    method: 'GET',
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error('Error al obtener etiquetas');
  return response.json();
}
