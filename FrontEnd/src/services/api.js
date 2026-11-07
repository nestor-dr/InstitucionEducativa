import axios from 'axios'
import { obtenerSesion, cerrarSesion } from './sesion'

const api = axios.create({
  // URL del back tomada de FrontEnd/.env
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 1000 * 15, // 15 sec
})

// Antes de cada pedido agrega el token guardado al loguearse
api.interceptors.request.use(
  (config) => {
    const sesion = obtenerSesion()
    if (sesion && sesion.token) {
      config.headers.Authorization = `Bearer ${sesion.token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error.response ? error.response.status : null

    // Token vencido o invalido: se cierra la sesion y vuelve al login
    if (status === 401 && obtenerSesion()) {
      cerrarSesion()
      window.location.href = '/'
    }

    // Deja en error.mensaje el texto que mando el back para mostrarlo en pantalla
    const data = error.response ? error.response.data : null
    if (typeof data === 'string' && data && !data.startsWith('<')) {
      error.mensaje = data
    } else if (data && data.mensaje) {
      error.mensaje = data.mensaje
    } else if (!error.response) {
      error.mensaje = 'No se puede conectar con el servidor. Intentá de nuevo más tarde.'
    } else {
      error.mensaje = 'Ocurrió un error inesperado'
    }

    return Promise.reject(error)
  }
)

export default api
