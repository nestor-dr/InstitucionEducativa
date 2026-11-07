import api from '../api'

const materiaService = {}

materiaService.obtenerMaterias = async () => {return await api.get('/materias')};
materiaService.obtenerMateria = async (materiaId) => {return await api.get(`/materias/${materiaId}`)};
materiaService.crearMateria = async (materia) => {return await api.post('/materias', materia)};
materiaService.actualizarMateria = async (materiaId, materia) => {return await api.put(`/materias/${materiaId}`, materia)};
materiaService.eliminarMateria = async (materiaId) => {return await api.delete(`/materias/${materiaId}`)};

export default materiaService