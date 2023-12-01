import api from '../api'

const materiaService = {}

materiaService.obtenerMaterias = async () => {return await api.get('/materias')};
materiaService.obtenerMateria = async (materiaId) => {return await api.get(`/materias/${materiaId}`)};

export default materiaService