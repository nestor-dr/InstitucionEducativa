import api from '../api'

const boletinService = {}

boletinService.crearBoletin = async (boletin) => {return await api.post('/boletines', boletin)}
boletinService.eliminarBoletin = async (boletinId) => {return await api.delete(`/boletines/${boletinId}`)};
boletinService.actualizarBoletin = async (boletin) => {return await api.put('/boletines', boletin)}
boletinService.obtenerBoletines = async () => {return await api.get('/boletines')};
boletinService.obtenerBoletin = async (boletinId) => {return await api.get(`/boletines/${boletinId}`)};

export default boletinService