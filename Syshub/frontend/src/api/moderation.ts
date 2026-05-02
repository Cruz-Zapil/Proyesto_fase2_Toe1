import API_URL, { getHeaders } from './api'
import axios from 'axios'

export async function hideContent(tipoContenido: string, contenidoId: string, motivo: string) {
  const { data } = await axios.post(`${API_URL}/moderation/hide`, {
    tipoContenido,
    contenidoId,
    motivo
  }, {
    headers: getHeaders()
  })
  return data
}

export async function restoreContent(tipoContenido: string, contenidoId: string) {
  const { data } = await axios.post(`${API_URL}/moderation/restore`, {
    tipoContenido,
    contenidoId
  }, {
    headers: getHeaders()
  })
  return data
}
