import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Popconfirm } from 'antd';

import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';

import materiaService from '../../services/Materia/materiaapi';

const estiloBoton = (color) => ({
  borderRadius: '5px',
  backgroundColor: color,
  color: 'white',
  margin: '5px',
  boxShadow: '2px 2px 5px rgba(0,0,0,0.2)',
});

export default function ListadoMaterias() {
  const [materias, setMaterias] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const mostrarMensaje = (setMensaje, mensaje) => {
    setMensaje(mensaje);
    setTimeout(() => setMensaje(null), 2000);
  };

  useEffect(() => {
    materiaService.obtenerMaterias()
      .then((res) => setMaterias(res))
      .catch((error) => { setMaterias([]); mostrarMensaje(setError, error.mensaje); });
  }, []);

  // Borra la materia (el back no deja si esta asignada a un curso)
  const eliminarMateria = (materia) => {
    materiaService.eliminarMateria(materia._id)
      .then(() => {
        setMaterias((prev) => prev.filter((m) => m._id !== materia._id));
        mostrarMensaje(setSuccess, 'Materia eliminada exitosamente.');
      })
      .catch((error) => mostrarMensaje(setError, error.mensaje));
  };

  return (
    <div style={{ width: '100%', maxWidth: '800px' }}>
      <Typography variant="h4" style={{ margin: '16px', padding: '20px' }}>
        Lista de Materias
      </Typography>

      {error && (
        <Alert message="Error" description={error} type="error" showIcon closable onClose={() => setError(null)} style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 2000 }} />
      )}
      {success && (
        <Alert message="Éxito" description={success} type="success" showIcon style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 2000 }} />
      )}

      <Button style={estiloBoton('#0958d9')} onClick={() => navigate('/Materias/Crear')}>
        Nueva materia
        <div style={{ marginLeft: '4px' }} />
        <AddIcon fontSize="small" />
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: '#0958d9' }}>
              <TableCell style={{ color: 'white' }}>NOMBRE</TableCell>
              <TableCell align="right" style={{ color: 'white' }}>ACCIONES</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {materias.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((materia) => (
              <TableRow key={materia._id}>
                <TableCell>{materia.nombre}</TableCell>
                <TableCell align="right" style={{ whiteSpace: 'nowrap' }}>
                  <Button size="small" style={estiloBoton('#73d13d')} onClick={() => navigate(`/Materias/Modificar/${materia._id}`)}>
                    Modificar
                    <div style={{ marginLeft: '4px' }} />
                    <EditIcon fontSize="small" />
                  </Button>
                  <Popconfirm
                    title="Eliminar materia"
                    description={`¿Seguro que querés eliminar ${materia.nombre}?`}
                    okText="Sí, eliminar"
                    cancelText="Cancelar"
                    onConfirm={() => eliminarMateria(materia)}
                  >
                    <Button size="small" style={estiloBoton('#ff7875')}>
                      Eliminar
                      <div style={{ marginLeft: '4px' }} />
                      <DeleteIcon fontSize="small" />
                    </Button>
                  </Popconfirm>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                count={materias.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(event, nuevaPagina) => setPage(nuevaPagina)}
                onRowsPerPageChange={(event) => { setRowsPerPage(parseInt(event.target.value, 10)); setPage(0); }}
                labelRowsPerPage="Filas por página"
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </div>
  );
}
