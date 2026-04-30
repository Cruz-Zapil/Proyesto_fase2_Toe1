import API_URL, {getHeaders} from './api'
import axios from 'axios'


export async function login(email: string, password: string) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();


    if (!res.ok) {
    throw new Error(data.message || 'Error al iniciar sesión');
  }

  if (data.access_token) {
    localStorage.setItem('token', data.access_token);
  }

  return data;
}


export async function getMe() {
  const token = localStorage.getItem('token')

  const res = await fetch(`${API_URL}/users/me`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.message || 'Error al obtener usuario')
  }

  return data
}


export async function registerUser(data: {
  nombre: string
  apellidos: string
  telefono: string
  registro_academico: string
  email: string
  password: string
  carreraId: string
}) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    const message = Array.isArray(result.message)
      ? result.message.join(', ')
      : result.message

    throw new Error(message || 'Error en registro')
  }

  return result; // ✅ correcto
}


export async function getCarreras(): Promise<{ id: string; nombre: string }[]> {
  const res = await axios.get(`${API_URL}/carreras`)
  return res.data
}