import { useState } from 'react';
import PropTypes from 'prop-types';
import TableCell from '@mui/material/TableCell';
import Tooltip from '@mui/material/Tooltip';

// Celda de tabla en una sola linea: si el texto no entra se corta con "..."
// y al pasar el mouse muestra el texto completo (solo cuando quedo cortado)
export default function CeldaTexto({ texto, align = 'left', style }) {
  const [cortado, setCortado] = useState(false);

  // Al entrar el mouse se fija si el texto ocupa mas que la celda
  const revisarSiEstaCortado = (evento) => {
    const elemento = evento.currentTarget;
    setCortado(elemento.scrollWidth > elemento.clientWidth);
  };

  return (
    <TableCell align={align} style={style}>
      <Tooltip title={cortado ? texto : ''} placement="top-start">
        <div
          onMouseEnter={revisarSiEstaCortado}
          style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
        >
          {texto}
        </div>
      </Tooltip>
    </TableCell>
  );
}

CeldaTexto.propTypes = {
  texto: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  align: PropTypes.oneOf(['left', 'center', 'right']),
  style: PropTypes.object,
};
