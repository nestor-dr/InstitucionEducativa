import { Form, Input, InputNumber, Button, Row, Col, Typography, Alert } from 'antd';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FileTextOutlined } from '@ant-design/icons';
import Container from '@mui/material/Container';

import boletinService from '../../services/Boletin/boletinapi';

const { Title, Text } = Typography;

export default function EditarBoletin() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [boletin, setBoletin] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [form] = Form.useForm();

  // Trae el boletin por el id de la URL y carga sus notas en el form
  useEffect(() => {
    boletinService.obtenerBoletin(id)
      .then((res) => {
        setBoletin(res);

        const notasIniciales = {};
        res.notas.forEach((item) => {
          if (item.materia) notasIniciales[item.materia._id] = item.nota;
        });
        form.setFieldsValue({ notas: notasIniciales });
      })
      .catch((error) => setError(error.mensaje));
  }, [id, form]);

  if (!boletin) {
    return (
      <Container style={{ padding: '40px', textAlign: 'center' }}>
        {error && (
          <Alert message="Error" description={error} type="error" showIcon style={{ position: 'fixed', bottom: 20, right: 20 }} />
        )}
        <Title level={3}>{error ? 'No se encontró el boletín a editar.' : 'Cargando boletín...'}</Title>
        <Button type="primary" onClick={() => navigate('/Boletines/Listado')}>
          Volver al listado
        </Button>
      </Container>
    );
  }

  // Se editan las materias que tiene hoy el curso
  const materias = boletin.curso ? boletin.curso.materias : [];

  const onFinish = (values) => {
    const notas = materias.map((materia) => ({ materia: materia._id, nota: values.notas[materia._id] }));

    boletinService.actualizarBoletin(boletin._id, notas)
      .then(() => {
        setSuccess('Boletín actualizado exitosamente.');
        setTimeout(() => {
          setSuccess(null);
          navigate(`/Boletines/Ver/${boletin._id}`);
        }, 1500);
      })
      .catch((error) => {
        console.error('Error al actualizar boletín:', error);
        setError(error.mensaje);
        setTimeout(() => setError(null), 2000);
      });
  };

  return (
    <Container
      style={{
        maxWidth: 'xl',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        padding: '20px',
        borderRadius: '50px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
      }}
    >
      <Title level={2} style={{ marginBottom: '20px', color: 'black', fontSize: '2em', fontWeight: 'bold', fontFamily: 'Arial, sans-serif' }}>
        Editar Boletín
      </Title>

      <div style={{ marginBottom: '20px' }}>
        <FileTextOutlined style={{ fontSize: '50px', color: 'black' }} />
      </div>

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

      <Form
        form={form}
        name="EditarBoletin"
        onFinish={onFinish}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 50 }}
      >
        <Row gutter={100}>
          <Col span={12}>
            <Form.Item label="Alumno">
              <Input
                readOnly
                value={boletin.alumno ? `${boletin.alumno.apellido}, ${boletin.alumno.nombre}` : ''}
                style={{ width: '100%', textTransform: 'capitalize' }}
              />
            </Form.Item>
            <Form.Item label="Curso">
              <Input readOnly value={boletin.curso ? boletin.curso.nombre : ''} style={{ width: '100%' }} />
            </Form.Item>
          </Col>

          <Col span={12}>
            {materias.length === 0 ? (
              <Text type="secondary">Este curso no tiene materias asignadas.</Text>
            ) : (
              materias.map((materia) => (
                <Row key={materia._id} gutter={16} style={{ marginBottom: '8px' }}>
                  <Col span={14}>
                    <Typography.Text strong>{`Nota de ${materia.nombre}:`}</Typography.Text>
                  </Col>
                  <Col span={10}>
                    <Form.Item
                      name={['notas', materia._id]}
                      rules={[{ required: true, message: 'Ingrese la nota' }, { type: 'number', min: 1, max: 10, message: 'Entre 1 y 10' }]}
                    >
                      <InputNumber min={1} max={10} step={0.5} placeholder="1 a 10" style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                </Row>
              ))
            )}
          </Col>
        </Row>

        <Text type="secondary" style={{ marginBottom: '20px', color: 'black' }}>
          Los campos con * son obligatorios. Las notas van de 1 a 10.
        </Text>

        <Form.Item wrapperCol={{ offset: 14, span: 16 }}>
          <Button
            style={{ marginRight: '10px', borderRadius: '5px' }}
            onClick={() => navigate('/Boletines/Listado')}
          >
            Cancelar
          </Button>
          <Button type="primary" htmlType="submit" style={{ borderRadius: '5px' }}>
            Guardar Cambios
          </Button>
        </Form.Item>
      </Form>
    </Container>
  );
}
