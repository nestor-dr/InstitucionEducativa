import * as React from 'react';
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
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Popconfirm } from 'antd';

import boletinService from '../../services/Boletin/boletinapi';
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
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [boletines, setBoletines] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    boletinService.obtenerBoletines()
      .then((res) => setBoletines(res))
      .catch((error) => {
        setError(error.mensaje);
        setTimeout(() => setError(null), 2000);
      });
  }, []);

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - boletines.length) : 0;

  const handleChangePage = (event, newPage) => { setPage(newPage); };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const eliminarBoletin = async (boletin) => {
    try {
      await boletinService.eliminarBoletin(boletin._id);
      setSuccess('Boletín eliminado exitosamente.');
      setBoletines((prev) => prev.filter((b) => b._id !== boletin._id));
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
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 110, opacity: 0.1 }}>
        <img src={miImagen} alt="Fondo" style={{ maxWidth: '100%' }} />
      </div>

      <Typography variant="h4" style={{ margin: '16px', padding: '20px' }}>
        Lista de Boletines
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
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: '#0958d9' }}>
              <TableCell style={{ color: 'white' }}>ALUMNO</TableCell>
              <TableCell style={{ color: 'white' }}>LEGAJO</TableCell>
              <TableCell style={{ color: 'white' }}>CURSO</TableCell>
              <TableCell align="center" style={{ color: 'white' }}>PROMEDIO</TableCell>
              <TableCell style={{ color: 'white' }}>FECHA</TableCell>
              <TableCell align="center" style={{ color: 'white' }}>ACCIONES</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {boletines.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">Todavía no hay boletines cargados.</TableCell>
              </TableRow>
            )}
            {(rowsPerPage > 0
              ? boletines.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : boletines
            ).map((boletin) => (
              <TableRow key={boletin._id}>
                <TableCell component="th" scope="row" style={{ textTransform: 'capitalize' }}>
                  {boletin.alumno ? `${boletin.alumno.apellido}, ${boletin.alumno.nombre}` : 'Alumno no encontrado'}
                </TableCell>
                <TableCell>{boletin.alumno ? boletin.alumno.nroLegajo : '-'}</TableCell>
                <TableCell>
                  {boletin.curso ? boletin.curso.nombre : 'Curso no encontrado'}
                  {boletin.curso && boletin.curso.anio ? ` (${boletin.curso.anio.nombre})` : ''}
                </TableCell>
                <TableCell align="center" style={{ fontWeight: 'bold' }}>{boletin.promedio}</TableCell>
                <TableCell>{new Date(boletin.createdAt).toLocaleDateString('es-AR')}</TableCell>
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
                colSpan={6}
                count={boletines.length}
                rowsPerPage={rowsPerPage}
                page={page}
                SelectProps={{ inputProps: { 'aria-label': 'rows per page' }, native: true }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
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
