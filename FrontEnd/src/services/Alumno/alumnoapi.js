import api from '../api'

const alumnoService = {}

alumnoService.crearAlumno = async (alumno) => {return await api.post('/alumnos', alumno)}
alumnoService.eliminarAlumno = async (alumnoId) => {return await api.delete(`/alumnos/${alumnoId}`)};
alumnoService.actualizarAlumno = async (alumno) => {return await api.put('/alumnos', alumno)}
alumnoService.obtenerAlumnos = async () => {return await api.get('/alumnos')};
alumnoService.obtenerAlumno = async () => {return await api.get('/alumnos/:id')};

alumnoService.obtenerLegajos = async () => {
      const response = await api.get('/alumnos');
      
      if (!response) {
        throw new Error('Error al obtener la lista de legajos');
      }
      const legajos = response.map(alumno => alumno.nroLegajo);
      return legajos;
  }

alumnoService.obtenerAlumnoPorLegajo = async (Legajo) =>{
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