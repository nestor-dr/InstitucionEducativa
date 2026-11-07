import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Alert, Button, Space } from 'antd';
import { PrinterOutlined, EditOutlined, ArrowLeftOutlined } from '@ant-design/icons';

import Typography from '@mui/material/Typography';

import HojaBoletin from '../../components/HojaBoletin';
import { tituloBoletin } from '../../components/HojaBoletin/titulo';
import boletinService from '../../services/Boletin/boletinapi';

export default function VerBoletin() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [boletin, setBoletin] = useState(null);
  const [error, setError] = useState(null);

  // Trae el boletin por el id de la URL
  useEffect(() => {
    boletinService.obtenerBoletin(id)
      .then((res) => {
        setBoletin(res);
        // El titulo de la pestaña es el que propone el navegador al guardar como PDF
        document.title = tituloBoletin(res);
      })
      .catch((error) => setError(error.mensaje));

    // Al salir de la pantalla vuelve el titulo normal
    return () => { document.title = 'Institución Educativa'; };
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

  return (
    <div style={{ width: '100%', maxWidth: '800px' }}>
      <Space className="no-imprimir" style={{ marginBottom: '16px' }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/Boletines/Listado')}>Volver</Button>
        <Button icon={<EditOutlined />} onClick={() => navigate(`/Boletines/Editar/${boletin._id}`)}>Editar notas</Button>
        <Button type="primary" icon={<PrinterOutlined />} onClick={() => window.print()}>Imprimir</Button>
      </Space>

      <HojaBoletin boletin={boletin} />
    </div>
  );
}
