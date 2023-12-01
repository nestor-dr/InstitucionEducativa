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
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useState, useEffect } from 'react'
import { Form, Alert  } from 'antd';
import cursoService from '../../services/Curso/cursoapi';
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
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [cursos, setCursos] = useState([])
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    cursoService.obtenerCursos().then(res => 
        setCursos(res))
    }, [])

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - cursos.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const eliminarAlumno = async (curso) => {
    try {
      console.log(curso);    
      await cursoService.eliminarCurso(curso._id)
        .then((res) => {
          console.log('Curso eliminado exitosamente:', res);
          setSuccess('Curso eliminado exitosamente.');

          setCursos((prevCursos) => prevCursos.filter((a) => a._id !== curso._id));

          form.resetFields();
        })
        .catch((error) => {
          console.error('Error al eliminar curso:', error);
          setError('Error al eliminar el curso. Por favor, inténtalo de nuevo más tarde.');
        });
    } catch (error) {
      console.error('Error al eliminar curso:', error);
      setError('Error al eliminar el curso. Por favor, inténtalo de nuevo más tarde.');
    } finally {
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
         Lista de Cursos
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
             <TableCell style={{ color: 'white' , width: '20%'}}>CURSO </TableCell>
             <TableCell style={{ color: 'white' , width: '30%'}}>MATERIAS</TableCell>
             <TableCell align="center" style={{ color: 'white' , width: '30%'}}>AÑO</TableCell>
             <TableCell align="center" style={{ color: 'white' , width: '20%'}}>ACCIONES</TableCell>
           </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
            ? cursos.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : cursos
          ).map((curso) => (
            <TableRow key={curso._id}>
              <TableCell component="th" scope="row">
                {curso.nombre}
              </TableCell>
              <TableCell style={{ width: 160 }} align="right">
                {curso && curso.materias && curso.materias.length > 0 ? (
                  <Accordion>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      MATERIAS
                    </AccordionSummary>
                    <AccordionDetails style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                      {curso.materias.map((materia, index) => (
                        <div key={index} style={{ whiteSpace: 'nowrap', fontWeight: 'bold' }}>
                          - {materia.nombre}<br />
                        </div>
                      ))}
                    </AccordionDetails>
                  </Accordion>
                ) : 'No tiene materias asignadas.'}
              </TableCell>
              <TableCell style={{ width: 160, whiteSpace: 'nowrap' }} align="center">
                {curso && curso.anio && curso.anio.nombre ? curso.anio.nombre : 'No tiene año asignado.'}
              </TableCell>
              <TableCell align="right">
              <Button type="primary" size = "small" style={{ borderRadius: '5px', backgroundColor: '#91caff', color: 'white', margin: '5px', boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.2)'  }} onClick={() => eliminarAlumno(curso)}>
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
              count={cursos.length}
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