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

import usuarioService from '../../services/Usuario/usuarioapi';
import CeldaTexto from '../../components/CeldaTexto';

const estiloBoton = (color) => ({
  borderRadius: '5px',
  backgroundColor: color,
  color: 'white',
  margin: '5px',
  boxShadow: '2px 2px 5px rgba(0,0,0,0.2)',
});

export default function ListadoUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  // El usuario logueado no se puede borrar a si mismo
  const sesion = JSON.parse(localStorage.getItem('usuario'));
  const idPropio = sesion && sesion.usuario ? sesion.usuario._id : null;

  const mostrarMensaje = (setMensaje, mensaje) => {
    setMensaje(mensaje);
    setTimeout(() => setMensaje(null), 2000);
  };

  useEffect(() => {
    usuarioService.obtenerUsuarios()
      .then((res) => setUsuarios(res))
      .catch((error) => { setUsuarios([]); mostrarMensaje(setError, error.mensaje); });
  }, []);

  const eliminarUsuario = (usuario) => {
    usuarioService.eliminarUsuario(usuario._id)
      .then(() => {
        setUsuarios((prev) => prev.filter((u) => u._id !== usuario._id));
        mostrarMensaje(setSuccess, 'Usuario eliminado exitosamente.');
      })
      .catch((error) => mostrarMensaje(setError, error.mensaje));
  };

  return (
    <div style={{ width: '100%' }}>
      <Typography variant="h4" style={{ margin: '16px', padding: '20px' }}>
        Lista de Usuarios
      </Typography>

      {error && (
        <Alert message="Error" description={error} type="error" showIcon closable onClose={() => setError(null)} style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 2000 }} />
      )}
      {success && (
        <Alert message="Éxito" description={success} type="success" showIcon style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 2000 }} />
      )}

      <TableContainer component={Paper}>
        {/* Ancho fijo por columna: cada fila queda en una sola linea */}
        <Table style={{ tableLayout: 'fixed', minWidth: 860 }}>
          <TableHead>
            <TableRow style={{ backgroundColor: '#0958d9' }}>
              <TableCell style={{ color: 'white', width: '22%' }}>APELLIDO Y NOMBRE</TableCell>
              <TableCell style={{ color: 'white' }}>EMAIL</TableCell>
              <TableCell style={{ color: 'white', width: 100 }}>ROL</TableCell>
              <TableCell style={{ color: 'white', width: '18%' }}>ALUMNO VINCULADO</TableCell>
              <TableCell align="center" style={{ color: 'white', width: 260 }}>ACCIONES</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {usuarios.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((usuario) => (
              <TableRow key={usuario._id}>
                <CeldaTexto texto={`${usuario.apellido}, ${usuario.nombre}`} style={{ textTransform: 'capitalize' }} />
                <CeldaTexto texto={usuario.email} />
                <CeldaTexto texto={usuario.rol ? usuario.rol.descripcion : '-'} style={{ textTransform: 'capitalize' }} />
                <CeldaTexto
                  texto={usuario.alumno ? `${usuario.alumno.apellido}, ${usuario.alumno.nombre}` : '-'}
                  style={{ textTransform: 'capitalize' }}
                />
                <TableCell align="center" style={{ whiteSpace: 'nowrap' }}>
                  <Button size="small" style={estiloBoton('#73d13d')} onClick={() => navigate(`/Usuarios/Modificar/${usuario._id}`)}>
                    Modificar
                    <div style={{ marginLeft: '4px' }} />
                    <EditIcon fontSize="small" />
                  </Button>
                  <Popconfirm
                    title="Eliminar usuario"
                    description={`¿Seguro que querés eliminar a ${usuario.email}?`}
                    okText="Sí, eliminar"
                    cancelText="Cancelar"
                    onConfirm={() => eliminarUsuario(usuario)}
                    disabled={usuario._id === idPropio}
                  >
                    <Button
                      size="small"
                      disabled={usuario._id === idPropio}
                      title={usuario._id === idPropio ? 'No podés borrar tu propio usuario' : ''}
                      style={{ ...estiloBoton('#ff7875'), opacity: usuario._id === idPropio ? 0.4 : 1 }}
                    >
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
                colSpan={5}
                count={usuarios.length}
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
