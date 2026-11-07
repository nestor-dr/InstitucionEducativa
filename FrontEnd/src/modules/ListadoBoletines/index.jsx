import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Popconfirm } from 'antd';

import boletinService from '../../services/Boletin/boletinapi';
import CeldaTexto from '../../components/CeldaTexto';
import CampoBusqueda from '../../components/CampoBusqueda';
import useListadoPaginado from '../../hooks/useListadoPaginado';
import miImagen from '../../images/Fondo1.jpg';

function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => { onPageChange(event, 0); };
  const handleBackButtonClick = (event) => { onPageChange(event, page - 1); };
  const handleNextButtonClick = (event) => { onPageChange(event, page + 1); };
  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton onClick={handleFirstPageButtonClick} disabled={page === 0} aria-label="first page">
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton onClick={handleNextButtonClick} disabled={page >= Math.ceil(count / rowsPerPage) - 1} aria-label="next page">
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton onClick={handleLastPageButtonClick} disabled={page >= Math.ceil(count / rowsPerPage) - 1} aria-label="last page">
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

const estiloBoton = (color) => ({
  borderRadius: '5px',
  backgroundColor: color,
  color: 'white',
  margin: '5px',
  boxShadow: '2px 2px 5px rgba(0,0,0,0.2)',
});

export default function ListadoBoletines() {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  // Busqueda y paginacion las hace el back: aca solo se pide la pagina que se ve
  const listado = useListadoPaginado(boletinService.obtenerBoletinesPaginado);

  const eliminarBoletin = async (boletin) => {
    try {
      await boletinService.eliminarBoletin(boletin._id);
      setSuccess('Boletín eliminado exitosamente.');
      // Se vuelve a pedir la pagina para que el total y la paginacion queden bien
      listado.recargar();
    } catch (error) {
      console.error('Error al eliminar boletín:', error);
      setError(error.mensaje);
    } finally {
      setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 2000);
    }
  };

  return (
    <div style={{ position: 'relative', overflow: 'hidden', width: '100%' }}>
      <div style={{ position: 'absolute', top: 110, opacity: 0.1 }}>
        <img src={miImagen} alt="Fondo" style={{ maxWidth: '100%' }} />
      </div>

      <Typography variant="h4" style={{ margin: '16px', padding: '20px' }}>
        Lista de Boletines
      </Typography>

      <CampoBusqueda
        valor={listado.busqueda}
        alCambiar={listado.setBusqueda}
        placeholder="Buscar por alumno, legajo o curso"
      />

      {(error || listado.error) && (
        <Alert
          message="Error"
          description={error || listado.error}
          type="error"
          showIcon
          closable
          onClose={() => { setError(null); listado.setError(null); }}
          style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 2000 }}
        />
      )}

      {success && (
        <Alert
          message="Éxito"
          description={success}
          type="success"
          showIcon
          style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 2000 }}
        />
      )}

      <TableContainer component={Paper}>
        {/* Ancho fijo por columna: cada fila queda en una sola linea */}
        <Table style={{ tableLayout: 'fixed', minWidth: 900 }}>
          <TableHead>
            <TableRow style={{ backgroundColor: '#0958d9' }}>
              <TableCell style={{ color: 'white' }}>ALUMNO</TableCell>
              <TableCell style={{ color: 'white', width: 90 }}>LEGAJO</TableCell>
              <TableCell style={{ color: 'white', width: '20%' }}>CURSO</TableCell>
              <TableCell align="center" style={{ color: 'white', width: 105 }}>PROMEDIO</TableCell>
              <TableCell style={{ color: 'white', width: 100 }}>FECHA</TableCell>
              <TableCell align="center" style={{ color: 'white', width: 330 }}>ACCIONES</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!listado.cargando && listado.datos.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  {listado.busqueda ? 'No hay boletines que coincidan con la búsqueda.' : 'Todavía no hay boletines cargados.'}
                </TableCell>
              </TableRow>
            )}
            {listado.datos.map((boletin) => (
              <TableRow key={boletin._id}>
                <CeldaTexto
                  texto={boletin.alumno ? `${boletin.alumno.apellido}, ${boletin.alumno.nombre}` : 'Alumno no encontrado'}
                  style={{ textTransform: 'capitalize' }}
                />
                <CeldaTexto texto={boletin.alumno ? boletin.alumno.nroLegajo : '-'} />
                <CeldaTexto
                  texto={`${boletin.curso ? boletin.curso.nombre : 'Curso no encontrado'}${boletin.curso && boletin.curso.anio ? ` (${boletin.curso.anio.nombre})` : ''}`}
                />
                <CeldaTexto texto={boletin.promedio} align="center" style={{ fontWeight: 'bold' }} />
                <CeldaTexto texto={new Date(boletin.createdAt).toLocaleDateString('es-AR')} />
                <TableCell align="center" style={{ whiteSpace: 'nowrap' }}>
                  <Button size="small" style={estiloBoton('#4096ff')} onClick={() => navigate(`/Boletines/Ver/${boletin._id}`)}>
                    Ver
                    <div style={{ marginLeft: '4px' }} />
                    <VisibilityIcon fontSize="small" />
                  </Button>
                  <Button size="small" style={estiloBoton('#73d13d')} onClick={() => navigate(`/Boletines/Editar/${boletin._id}`)}>
                    Editar
                    <div style={{ marginLeft: '4px' }} />
                    <EditIcon fontSize="small" />
                  </Button>
                  <Popconfirm
                    title="Eliminar boletín"
                    description="¿Seguro que querés eliminar este boletín?"
                    okText="Sí, eliminar"
                    cancelText="Cancelar"
                    onConfirm={() => eliminarBoletin(boletin)}
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
                colSpan={6}
                count={listado.total}
                rowsPerPage={listado.limite}
                page={listado.pagina}
                SelectProps={{ inputProps: { 'aria-label': 'rows per page' }, native: true }}
                onPageChange={listado.cambiarPagina}
                onRowsPerPageChange={listado.cambiarLimite}
                ActionsComponent={TablePaginationActions}
                labelRowsPerPage="Filas por página"
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </div>
  );
}
