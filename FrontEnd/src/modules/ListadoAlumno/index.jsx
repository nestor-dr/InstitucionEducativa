import * as React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
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
import { useState, useEffect } from 'react'
import { Form, Alert  } from 'antd';
import alumnoService from '../../services/Alumno/alumnoapi';
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

export default function ListadoAlumno() {
  const [page, setPage] = React.useState(0);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [form] = Form.useForm();
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [alumnos, setAlumnos] = useState([])

  useEffect(() => {
    alumnoService.obtenerAlumnos().then(res => 
      setAlumnos(res))
    }, [])

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - alumnos.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const eliminarAlumno = async (alumno) => {
    try {
      console.log(alumno);
      // Llama a la función del servicio alumnoService para eliminar el alumno
      await alumnoService.eliminarAlumno(alumno._id)
        .then((res) => {
          console.log('Alumno eliminado exitosamente:', res);
          setSuccess('Alumno eliminado exitosamente.');

          // Actualiza la lista de alumnos en el estado excluyendo el alumno eliminado
          setAlumnos((prevAlumnos) => prevAlumnos.filter((a) => a.nroLegajo !== alumno.nroLegajo));

          // Limpia el formulario
          form.resetFields();
        })
        .catch((error) => {
          console.error('Error al eliminar alumno:', error);
          setError('Error al eliminar el alumno. Por favor, inténtalo de nuevo más tarde.');
        });
    } catch (error) {
      console.error('Error al eliminar alumno:', error);
      setError('Error al eliminar el alumno. Por favor, inténtalo de nuevo más tarde.');
    } finally {
      // Configura un temporizador para limpiar los mensajes después de un tiempo
      setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 2000);
    }
  };

  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 110, opacity: 0.1}}>
        <img src={miImagen} alt="Descripción de la imagen" style={{ maxWidth: '100%' }} />
      </div>
      <div>
      <Typography variant="h4" style={{ margin: '16px', padding: '20px'}}>
         Lista de Alumnos
      </Typography>
      {error && (
          <Alert
            message="Error"
            description={error}
            type="error"
            showIcon
            closable
            onClose={() => setError(null)}
            style={{ position: 'fixed', bottom: 20, right: 20 }}
          />
        )}

        {success && (
          <Alert
            message="Éxito"
            description={success}
            type="success"
            showIcon
            style={{ position: 'fixed', bottom: 20, right: 20 }}
          />
        )}
       <TableContainer component={Paper}>
      <TableHead >
           <TableRow style={{ backgroundColor: '#0958d9'}}>
             <TableCell style={{ color: 'white' }}>NOMBRE </TableCell>
             <TableCell align="right" style={{ color: 'white' }}>APELLIDO</TableCell>
             <TableCell align="right" style={{ color: 'white' }}>LEGAJO</TableCell>
             <TableCell align="right" style={{ color: 'white' }}>DIRECCION</TableCell>
             <TableCell align="right" style={{ color: 'white' }}>EDAD</TableCell>
             <TableCell align="right" style={{ color: 'white' }}>CURSO</TableCell>
             <TableCell align="right" style={{ color: 'white' }}>ACCIONES</TableCell>
           </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
            ? alumnos.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : alumnos
          ).map((alumno) => (
            <TableRow key={alumno.nroLegajo}>
              <TableCell component="th" scope="row">
                {alumno.nombre}
              </TableCell>
              <TableCell style={{ width: 160 }} align="right">
                {alumno.apellido}
              </TableCell>
              <TableCell style={{ width: 160 }} align="right">
                {alumno.nroLegajo}
              </TableCell>
              <TableCell style={{ width: 160 }} align="right">
                {alumno.direccion}
              </TableCell>
              <TableCell style={{ width: 160 }} align="right">
                {alumno.edad}
              </TableCell>
              <TableCell style={{ width: 160 }} align="right">
                {alumno && alumno.curso && alumno.curso.nombre ? alumno.curso.nombre : 'No tiene curso asignado.'}
              </TableCell>
              <TableCell align="right">
              <Button type="primary" size = "small" style={{ borderRadius: '5px', backgroundColor: '#91caff', color: 'white', margin: '5px', boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.2)'  }} onClick={() => eliminarAlumno(alumno)}>
              Eliminar 
              <div style={{ marginLeft: '4px' }} />
              <DeleteIcon />
              </Button>
              </TableCell>
            </TableRow>
          ))}
          {emptyRows > 0 && (
            <TableRow style={{ height: 53 * emptyRows }}>
              <TableCell colSpan={6} />
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: 'Todos', value: -1 }]}
              colSpan={3}
              count={alumnos.length}
              rowsPerPage={rowsPerPage}
              page={page}
              SelectProps={{
                inputProps: {
                  'aria-label': 'rows per page',
                },
                native: true,
              }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
              labelRowsPerPage="Filas por página"
            />
          </TableRow>
        </TableFooter>
    </TableContainer>
    </div>
  </div>
  );
}