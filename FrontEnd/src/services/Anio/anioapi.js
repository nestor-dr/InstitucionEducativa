import api from '../api'

const anioService = {}

anioService.obtenerAnios = async () => {return await api.get('/anios')};
anioService.obtenerAnio = async (anioId) => {return await api.get(`/anios/${anioId}`)};

export default anioService