import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

import { tituloBoletin } from './titulo';
import './styles.css';

// La "hoja" del boletin: datos del alumno y del curso, cada materia con su nota y el promedio
// La usan Ver Boletin (profesor) y Mi Boletin (alumno)
export default function HojaBoletin({ boletin }) {
  const { alumno, curso } = boletin;

  return (
    <div className="boletin-pagina">
      {/* Solo se ve al imprimir (reemplaza el encabezado del navegador) */}
      <div className="encabezado-impresion">{tituloBoletin(boletin)}</div>
      <Paper className="boletin-hoja" style={{ padding: '30px', marginBottom: '20px', backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
        <Typography variant="h4" align="center" gutterBottom>
          Boletín de Calificaciones
        </Typography>
        <Typography variant="subtitle1" align="center" gutterBottom>
          Institución Educativa
        </Typography>

        {/* Datos del alumno y del curso */}
        <Grid container spacing={1} style={{ margin: '20px 0', textTransform: 'capitalize' }}>
          <Grid item xs={6}>
            <Typography><b>Alumno:</b> {alumno ? `${alumno.apellido}, ${alumno.nombre}` : '-'}</Typography>
            <Typography><b>Legajo:</b> {alumno ? alumno.nroLegajo : '-'}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography><b>Curso:</b> {curso ? curso.nombre : '-'}</Typography>
            <Typography><b>Año:</b> {curso && curso.anio ? curso.anio.nombre : '-'}</Typography>
            <Typography><b>Fecha:</b> {new Date(boletin.createdAt).toLocaleDateString('es-AR')}</Typography>
          </Grid>
        </Grid>

        {/* Notas por materia */}
        <Table size="small">
          <TableHead>
            <TableRow style={{ backgroundColor: '#0958d9' }}>
              <TableCell style={{ color: 'white' }}>MATERIA</TableCell>
              <TableCell align="center" style={{ color: 'white' }}>NOTA</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {boletin.notas.map((item, index) => (
              <TableRow key={item.materia ? item.materia._id : index}>
                <TableCell>{item.materia ? item.materia.nombre : 'Materia eliminada'}</TableCell>
                <TableCell align="center">{item.nota}</TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell style={{ fontWeight: 'bold' }}>PROMEDIO</TableCell>
              <TableCell align="center" style={{ fontWeight: 'bold' }}>{boletin.promedio}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Paper>
    </div>
  );
}
