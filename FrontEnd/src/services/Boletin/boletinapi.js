import api from '../api'

const boletinService = {}

boletinService.crearBoletin = async (boletin) => {return await api.post('/boletines', boletin)}
boletinService.eliminarBoletin = async (boletinId) => {return await api.delete(`/boletines/${boletinId}`)};
boletinService.actualizarBoletin = async (boletinId, notas) => {return await api.put(`/boletines/${boletinId}`, { notas })}
boletinService.obtenerBoletines = async () => {return await api.get('/boletines')};
// Una pagina del listado: { pagina, limite, buscar } -> { datos, total, pagina, limite }
boletinService.obtenerBoletinesPaginado = async (parametros) => {return await api.get('/boletines', { params: parametros })};
boletinService.obtenerBoletin = async (boletinId) => {return await api.get(`/boletines/${boletinId}`)};
boletinService.obtenerBoletinesDeAlumno = async (alumnoId) => {return await api.get(`/boletines/alumno/${alumnoId}`)};
boletinService.obtenerMisBoletines = async () => {return await api.get('/boletines/mio')};

export default boletinService