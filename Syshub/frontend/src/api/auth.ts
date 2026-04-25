import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1'

export async function registerUser(data: {
  nombre: string
  email: string
  password: string
  carreraId: string  // ← cambiado de carrera a carreraId
}) {
  const res = await axios.post(`${API_URL}/auth/register`, data)
  return res.data
}

export async function getCarreras(): Promise<{ id: string; nombre: string }[]> {
  const res = await axios.get(`${API_URL}/carreras`)
  return res.data
}