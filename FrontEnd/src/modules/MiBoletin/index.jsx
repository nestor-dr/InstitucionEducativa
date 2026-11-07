import { useState, useEffect } from 'react';
import { Alert, Button, Space } from 'antd';
import { PrinterOutlined } from '@ant-design/icons';

import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import HojaBoletin from '../../components/HojaBoletin';
import { tituloBoletin } from '../../components/HojaBoletin/titulo';
import boletinService from '../../services/Boletin/boletinapi';

// Pantalla del alumno: ve sus boletines (solo lectura) y los puede imprimir
export default function MiBoletin() {
  const [boletines, setBoletines] = useState(null);
  const [error, setError] = useState(null);

  // El back devuelve solo los boletines del alumno logueado (lo saca del token)
  useEffect(() => {
    boletinService.obtenerMisBoletines()
      .then((res) => {
        setBoletines(res);
        // El titulo de la pestaña es el que propone el navegador al guardar como PDF
        if (res.length > 0) document.title = tituloBoletin(res[0]);
      })
      .catch((error) => {
        setBoletines([]);
        setError(error.mensaje);
        setTimeout(() => setError(null), 2000);
      });

    // Al salir de la pantalla vuelve el titulo normal
    return () => { document.title = 'Institución Educativa'; };
  }, []);

  if (boletines === null) {
    return <Typography>Cargando boletín...</Typography>;
  }

  return (
    <div style={{ width: '100%', maxWidth: '800px' }}>
      {error && (
        <Alert message="Error" description={error} type="error" showIcon closable onClose={() => setError(null)} style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 2000 }} />
      )}

      {boletines.length === 0 ? (
        <Paper style={{ padding: '30px', textAlign: 'center', backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
          <Typography variant="h5">Todavía no tenés boletines cargados.</Typography>
          <Typography variant="subtitle1">Cuando tu profesor cargue tus notas, las vas a ver acá.</Typography>
        </Paper>
      ) : (
        <>
          <Space className="no-imprimir" style={{ marginBottom: '16px' }}>
            <Button type="primary" icon={<PrinterOutlined />} onClick={() => window.print()}>Imprimir</Button>
          </Space>
          {boletines.map((boletin) => (
            <HojaBoletin key={boletin._id} boletin={boletin} />
          ))}
        </>
      )}
    </div>
  );
}
