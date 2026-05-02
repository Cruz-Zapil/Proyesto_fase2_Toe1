import API_URL, { getHeaders } from './api';

export async function getMe() {
  const res = await fetch(`${API_URL}/users/me`, {
    headers: getHeaders(true),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.message || 'Error al obtener perfil');
  }

  return data;
}

export async function updateProfile(id: string, payload: { telefono?: string, password?: string }) {
  const res = await fetch(`${API_URL}/users/${id}`, {
    method: 'PUT',
    headers: getHeaders(true),
    body: JSON.stringify(payload)
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.message || 'Error al actualizar perfil');
  }

  return data;
}

export async function getMyContent() {
  const res = await fetch(`${API_URL}/users/me/content`, {
    headers: getHeaders(true),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.message || 'Error al obtener mi contenido');
  }

  return data;
}