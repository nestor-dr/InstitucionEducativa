import api from '../api'

const cursoService = {}

cursoService.crearCurso = async (curso) => {return await api.post('/cursos', curso)}
cursoService.eliminarCurso = async (cursoId) => {return await api.delete(`/cursos/${cursoId}`)}
cursoService.actualizarCurso = async (curso) => {return await api.put('/cursos', curso)}
cursoService.obtenerCursos = async () => {return await api.get('/cursos')};
cursoService.obtenerCurso = async (cursoId) => {return await api.get(`/cursos/${cursoId}`)};

cursoService.obtenerMateriasPorCurso = async (cursoId) => {
    const response = await api.get(`/cursos/${cursoId}`);
    if (!response) {
        throw new Error('Error al obtener la lista de materias');
    }
    return response.materias;
}

export default cursoService