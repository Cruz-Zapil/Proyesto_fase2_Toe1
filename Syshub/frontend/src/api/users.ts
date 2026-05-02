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