import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Input, Button, Typography, Alert } from 'antd';
import { BookOutlined } from '@ant-design/icons';
import Container from '@mui/material/Container';

import materiaService from '../../services/Materia/materiaapi';

const { Title } = Typography;

// Sirve para crear (/Materias/Crear) y para modificar (/Materias/Modificar/:id)
export default function FormularioMateria() {
  const { id } = useParams();
  const esModificacion = Boolean(id);
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [form] = Form.useForm();

  // Si es modificacion, carga el nombre actual
  useEffect(() => {
    if (!esModificacion) return;
    materiaService.obtenerMateria(id)
      .then((res) => form.setFieldsValue({ nombre: res.nombre }))
      .catch((error) => setError(error.mensaje));
  }, [id, esModificacion, form]);

  const onFinish = (values) => {
    const pedido = esModificacion
      ? materiaService.actualizarMateria(id, values)
      : materiaService.crearMateria(values);

    pedido
      .then(() => {
        setSuccess(esModificacion ? 'Materia modificada exitosamente.' : 'Materia creada exitosamente.');
        setTimeout(() => {
          setSuccess(null);
          navigate('/Materias/Listado');
        }, 1500);
      })
      .catch((error) => {
        setError(error.mensaje);
        setTimeout(() => setError(null), 2000);
      });
  };

  return (
    <Container
      style={{
        maxWidth: '500px',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        padding: '20px',
        borderRadius: '50px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
      }}
    >
      <Title level={2}>{esModificacion ? 'Modificar Materia' : 'Alta de Materia'}</Title>
      <BookOutlined style={{ fontSize: '50px', marginBottom: '20px' }} />

      {error && (
        <Alert message="Error" description={error} type="error" showIcon closable onClose={() => setError(null)} style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 2000 }} />
      )}
      {success && (
        <Alert message="Éxito" description={success} type="success" showIcon style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 2000 }} />
      )}

      <Form form={form} name="FormularioMateria" onFinish={onFinish} style={{ width: '100%' }} layout="vertical">
        <Form.Item label="Nombre" name="nombre" rules={[{ required: true, whitespace: true, message: 'Ingrese el nombre de la materia' }]}>
          <Input placeholder="Ej: Programación III" />
        </Form.Item>

        <Form.Item>
          <Button style={{ marginRight: '10px' }} onClick={() => navigate('/Materias/Listado')}>Cancelar</Button>
          <Button type="primary" htmlType="submit">{esModificacion ? 'Guardar Cambios' : 'Agregar Materia'}</Button>
        </Form.Item>
      </Form>
    </Container>
  );
}
