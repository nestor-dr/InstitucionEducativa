import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Alert, Button, Space } from 'antd';
import { PrinterOutlined, EditOutlined, ArrowLeftOutlined } from '@ant-design/icons';

import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

import boletinService from '../../services/Boletin/boletinapi';
import './styles.css';

export default function VerBoletin() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [boletin, setBoletin] = useState(null);
  const [error, setError] = useState(null);

  // Trae el boletin por el id de la URL
  useEffect(() => {
    boletinService.obtenerBoletin(id)
      .then((res) => setBoletin(res))
      .catch((error) => setError(error.mensaje));
  }, [id]);

  if (error) {
    return (
      <div>
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 2000 }}
        />
        <Button type="primary" onClick={() => navigate('/Boletines/Listado')}>Volver al listado</Button>
      </div>
    );
  }

  if (!boletin) {
    return <Typography>Cargando boletín...</Typography>;
  }

  const { alumno, curso } = boletin;

  return (
    <div style={{ width: '100%', maxWidth: '800px' }}>
      <Space className="no-imprimir" style={{ marginBottom: '16px' }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/Boletines/Listado')}>Volver</Button>
        <Button icon={<EditOutlined />} onClick={() => navigate(`/Boletines/Editar/${boletin._id}`)}>Editar notas</Button>
        <Button type="primary" icon={<PrinterOutlined />} onClick={() => window.print()}>Imprimir</Button>
      </Space>

      <Paper className="boletin-hoja" style={{ padding: '30px', backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
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
            {boletin.notas.map((item) => (
              <TableRow key={item.materia ? item.materia._id : item._id}>
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
