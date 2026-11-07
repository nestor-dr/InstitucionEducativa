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
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import { useState } from 'react'
import {  Alert  } from 'antd';
import cursoService from '../../services/Curso/cursoapi';
import CeldaTexto from '../../components/CeldaTexto';
import CampoBusqueda from '../../components/CampoBusqueda';
import useListadoPaginado from '../../hooks/useListadoPaginado';
import Typography from '@mui/material/Typography';
import miImagen from '../../images/Fondo1.jpg';
import Button from '@mui/material/Button';

function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
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

export default function ListadoCurso() {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Busqueda y paginacion las hace el back: aca solo se pide la pagina que se ve
  const listado = useListadoPaginado(cursoService.obtenerCursosPaginado);

  const eliminarCurso = async (curso) => {
    try {
      console.log(curso);    
      await cursoService.eliminarCurso(curso._id)
        .then((res) => {
          console.log('Curso eliminado exitosamente:', res);
          setSuccess('Curso eliminado exitosamente.');

          // Se vuelve a pedir la pagina para que el total y la paginacion queden bien
          listado.recargar();

        })
        .catch((error) => {
          console.error('Error al eliminar curso:', error);
          setError(error.mensaje);
        });
    } catch (error) {
      console.error('Error al eliminar curso:', error);
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
      <div style={{ position: 'absolute', top: 110, opacity: 0.1}}>
        <img src={miImagen} alt="Descripción de la imagen" style={{ maxWidth: '100%' }} />
      </div>
      <div>
      <Typography variant="h4" style={{ margin: '16px', padding: '20px'}}>
         Lista de Cursos
      </Typography>
      <CampoBusqueda
        valor={listado.busqueda}
        alCambiar={listado.setBusqueda}
        placeholder="Buscar por nombre de curso (ej: 1.001)"
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
       <Table style={{ tableLayout: 'fixed', minWidth: 760 }}>
      <TableHead >
           <TableRow style={{ backgroundColor: '#0958d9'}}>
             <TableCell style={{ color: 'white', width: 110 }}>CURSO</TableCell>
             <TableCell style={{ color: 'white' }}>MATERIAS</TableCell>
             <TableCell style={{ color: 'white', width: 170 }}>AÑO</TableCell>
             <TableCell align="center" style={{ color: 'white', width: 140 }}>ACCIONES</TableCell>
           </TableRow>
        </TableHead>
        <TableBody>
          {!listado.cargando && listado.datos.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} align="center">
                {listado.busqueda ? 'No hay cursos que coincidan con la búsqueda.' : 'Todavía no hay cursos cargados.'}
              </TableCell>
            </TableRow>
          )}
          {listado.datos.map((curso) => (
            <TableRow key={curso._id}>
              <CeldaTexto texto={curso.nombre} />
              {/* Las materias en una linea; si no entran, se ven todas al pasar el mouse */}
              <CeldaTexto
                texto={curso.materias && curso.materias.length > 0
                  ? `(${curso.materias.length}) ${curso.materias.map((materia) => materia.nombre).join(', ')}`
                  : 'Sin materias asignadas'}
              />
              <CeldaTexto texto={curso.anio && curso.anio.nombre ? curso.anio.nombre : 'Sin año asignado'} />
              <TableCell align="center" style={{ whiteSpace: 'nowrap' }}>
              <Button 
                type="primary" 
                size = "small" 
                style={{ 
                  borderRadius: '5px', 
                  backgroundColor: '#91caff', 
                  color: 'white', margin: '5px', 
                  boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.2)'  
                }} onClick={() => eliminarCurso(curso)}>
              Eliminar 
              <div style={{ marginLeft: '4px' }} />
              <DeleteIcon />
              </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              colSpan={4}
              count={listado.total}
              rowsPerPage={listado.limite}
              page={listado.pagina}
              SelectProps={{
                inputProps: {
                  'aria-label': 'rows per page',
                },
                native: true,
              }}
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
  </div>
  );
}