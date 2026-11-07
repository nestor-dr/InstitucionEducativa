import api from '../api'

const anioService = {}

anioService.obtenerAnios = async () => {return await api.get('/anios')};
anioService.obtenerAnio = async (anioId) => {return await api.get(`/anios/${anioId}`)};
anioService.crearAnio = async (anio) => {return await api.post('/anios', anio)};
anioService.actualizarAnio = async (anioId, anio) => {return await api.put(`/anios/${anioId}`, anio)};
anioService.eliminarAnio = async (anioId) => {return await api.delete(`/anios/${anioId}`)};

export default anioService