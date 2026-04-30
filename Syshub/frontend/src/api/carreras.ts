import API_URL from './api';

export async function getCarreras() {
  const res = await fetch(`${API_URL}/carreras`);
  return res.json();
}

export async function getCursosByCarrera(id: string) {
  const res = await fetch(`${API_URL}/carreras/${id}/cursos`);
  return res.json();
}