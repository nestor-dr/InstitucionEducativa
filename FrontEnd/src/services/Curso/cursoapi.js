import api from '../api'

const cursoService = {}

cursoService.crearCurso = async (curso) => {return await api.post('/cursos', curso)}
cursoService.eliminarCurso = async (curso) => {return await api.delete('/cursos/:id', curso)}
cursoService.actualizarCurso = async (curso) => {return await api.put('/cursos/:id', curso)}
cursoService.obtenerCursos = async () => {return await api.get('/cursos')};
cursoService.obtenerCurso = async () => {return await api.get('/cursos/:id')};

export default cursoService