import api from '../api'

const cursoService = {}

cursoService.crearCurso = async (curso) => {return await api.post('/cursos', curso)}
cursoService.eliminarCurso = async (cursoId) => {return await api.delete(`/cursos/${cursoId}`)}
cursoService.actualizarCurso = async (cursoId, curso) => {return await api.put(`/cursos/${cursoId}`, curso)}
cursoService.obtenerCursos = async () => {return await api.get('/cursos')};
// Una pagina del listado: { pagina, limite, buscar } -> { datos, total, pagina, limite }
cursoService.obtenerCursosPaginado = async (parametros) => {return await api.get('/cursos', { params: parametros })};
cursoService.obtenerCurso = async (cursoId) => {return await api.get(`/cursos/${cursoId}`)};

cursoService.obtenerMateriasPorCurso = async (cursoId) => {
    const response = await api.get(`/cursos/${cursoId}`);
    if (!response) {
        throw new Error('Error al obtener la lista de materias');
    }
    return response.materias;
}

export default cursoService