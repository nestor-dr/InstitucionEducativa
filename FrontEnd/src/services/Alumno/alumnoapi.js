import api from '../api'

const alumnoService = {}

alumnoService.crearAlumno = async (alumno) => {return await api.post('/alumnos', alumno)}
alumnoService.eliminarAlumno = async (alumnoId) => {return await api.delete(`/alumnos/${alumnoId}`)};
alumnoService.actualizarAlumno = async (alumnoId, alumno) => {return await api.put(`/alumnos/${alumnoId}`, alumno)}
alumnoService.obtenerAlumnos = async () => {return await api.get('/alumnos')};
alumnoService.obtenerAlumno = async (alumnoId) => {return await api.get(`/alumnos/${alumnoId}`)};
// Alumnos que todavia no tienen usuario (incluir: el alumno del usuario que se esta editando)
alumnoService.obtenerAlumnosSinUsuario = async (incluir = '') => {return await api.get('/alumnos', { params: { sinUsuario: true, incluir } })};

alumnoService.obtenerAlumnoLegajo = async (Legajo) =>{
    const response = await api.get('/alumnos');
    console.log(response)
    if (!response) {
        throw new Error('Error al obtener la lista de legajos');
    }
    const alumnoElegido = response.find(alumno => alumno.nroLegajo === Legajo)

    console.log(alumnoElegido)
    return alumnoElegido;
}

export default alumnoService