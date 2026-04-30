import API_URL, { getHeaders } from './api';

export async function inscribirse(cursoId: string) {
  const res = await fetch(`${API_URL}/cursos/${cursoId}/inscribir`, {
    method: 'POST',
    headers: getHeaders(true),
  });

  return res.json();
}