import PropTypes from 'prop-types';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

// Campo de busqueda que va arriba de cada tabla
export default function CampoBusqueda({ valor, alCambiar, placeholder }) {
  return (
    <Input
      allowClear
      prefix={<SearchOutlined />}
      placeholder={placeholder}
      value={valor}
      onChange={(evento) => alCambiar(evento.target.value)}
      style={{ maxWidth: 420, marginBottom: '12px' }}
    />
  );
}

CampoBusqueda.propTypes = {
  valor: PropTypes.string.isRequired,
  alCambiar: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};
