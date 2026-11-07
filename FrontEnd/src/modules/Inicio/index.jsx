import Typography from '@mui/material/Typography';
import miImagen from '../../images/Fondo 6.png';

// Texto de bienvenida segun el rol
const descripcionPorRol = {
  admin: 'Desde el menú podés administrar alumnos, cursos, materias y años.',
  profesor: 'Desde el menú podés generar, ver, editar e imprimir los boletines de los alumnos.',
  alumno: 'Desde el menú podés ver e imprimir tu boletín de calificaciones.',
};

function Inicio() {
  const sesion = JSON.parse(localStorage.getItem('usuario'));
  const usuario = sesion && sesion.usuario ? sesion.usuario : {};

  return(
    <div style={{ textAlign: 'center' }}>
      <Typography variant="h4">
        Bienvenido/a, <span style={{ textTransform: 'capitalize' }}>{usuario.nombre}</span>
      </Typography>
      <Typography variant="subtitle1" style={{ marginBottom: '20px' }}>
        {descripcionPorRol[usuario.rol]}
      </Typography>
      <img
        src={miImagen}
        alt="Institución Educativa"
        style={{ maxWidth: '100%', height: '50vh', objectFit: 'contain' }}
      />
    </div>
  );
}

export default Inicio
