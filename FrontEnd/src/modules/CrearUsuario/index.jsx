import { useState, useEffect } from 'react';
import { Form, Input, Select, Button, Row, Col, Typography, Alert } from 'antd';
import { UserAddOutlined } from '@ant-design/icons';
import Container from '@mui/material/Container';

import usuarioService from '../../services/Usuario/usuarioapi';
import rolService from '../../services/Rol/rolapi';
import alumnoService from '../../services/Alumno/alumnoapi';
import { reglaPassword } from '../../utils/validaciones';

const { Title, Text } = Typography;
const { Option } = Select;

export default function CrearUsuario() {
  const [roles, setRoles] = useState([]);
  const [alumnos, setAlumnos] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [form] = Form.useForm();

  // Si el rol elegido es "alumno" hay que vincularlo a un alumno
  const rolElegido = Form.useWatch('rol', form);
  const esRolAlumno = roles.some((rol) => rol._id === rolElegido && rol.descripcion === 'alumno');

  const mostrarMensaje = (setMensaje, mensaje) => {
    setMensaje(mensaje);
    setTimeout(() => setMensaje(null), 2000);
  };

  const cargarDatos = () => {
    rolService.obtenerRoles().then((res) => setRoles(res)).catch((error) => mostrarMensaje(setError, error.mensaje));
    // Solo los alumnos que todavia no tienen usuario
    alumnoService.obtenerAlumnosSinUsuario().then((res) => setAlumnos(res)).catch((error) => mostrarMensaje(setError, error.mensaje));
  };

  // Se carga una sola vez, al entrar a la pantalla
  useEffect(() => {
    cargarDatos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onFinish = (values) => {
    // eslint-disable-next-line no-unused-vars
    const { confirmarPassword, ...usuario } = values;

    usuarioService.crearUsuario(usuario)
      .then(() => {
        mostrarMensaje(setSuccess, 'Usuario creado exitosamente.');
        form.resetFields();
        cargarDatos();
      })
      .catch((error) => {
        console.error('Error al crear usuario:', error);
        mostrarMensaje(setError, error.mensaje);
      });
  };

  return (
    <Container
      style={{
        maxWidth: '900px',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        padding: '20px',
        borderRadius: '50px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
      }}
    >
      <Title level={2}>Alta de Usuario</Title>
      <UserAddOutlined style={{ fontSize: '50px', marginBottom: '20px' }} />

      {error && (
        <Alert message="Error" description={error} type="error" showIcon closable onClose={() => setError(null)} style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 2000 }} />
      )}
      {success && (
        <Alert message="Éxito" description={success} type="success" showIcon style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 2000 }} />
      )}

      <Form form={form} name="AltaUsuario" onFinish={onFinish} layout="vertical" style={{ width: '100%' }}>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item label="Nombre" name="nombre" rules={[{ required: true, whitespace: true, message: 'Ingrese el nombre' }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Apellido" name="apellido" rules={[{ required: true, whitespace: true, message: 'Ingrese el apellido' }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Ingrese el email' }, { type: 'email', message: 'El email no tiene un formato válido' }]}>
              <Input autoComplete="off" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Rol" name="rol" rules={[{ required: true, message: 'Seleccione el rol' }]}>
              <Select placeholder="Seleccione el rol" onChange={() => form.setFieldsValue({ alumno: undefined })}>
                {roles.map((rol) => (
                  <Option key={rol._id} value={rol._id} style={{ textTransform: 'capitalize' }}>
                    {rol.descripcion}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          {/* Solo para el rol alumno: a que alumno corresponde */}
          {esRolAlumno && (
            <Col span={24}>
              <Form.Item label="Alumno vinculado" name="alumno" rules={[{ required: true, message: 'Seleccione el alumno' }]}>
                <Select showSearch optionFilterProp="children" placeholder="Buscar alumno (solo los que todavía no tienen usuario)">
                  {alumnos.map((alumno) => (
                    <Option key={alumno._id} value={alumno._id}>
                      {`${alumno.apellido}, ${alumno.nombre} (${alumno.nroLegajo})`}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          )}

          <Col span={12}>
            <Form.Item label="Contraseña inicial" name="password" rules={[{ required: true, message: 'Ingrese la contraseña' }, reglaPassword]}>
              <Input.Password autoComplete="new-password" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Repetir contraseña"
              name="confirmarPassword"
              dependencies={['password']}
              rules={[
                { required: true, message: 'Repita la contraseña' },
                // Tiene que coincidir con la contraseña
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) return Promise.resolve();
                    return Promise.reject(new Error('Las contraseñas no coinciden'));
                  },
                }),
              ]}
            >
              <Input.Password autoComplete="new-password" />
            </Form.Item>
          </Col>
        </Row>

        <Text type="secondary" style={{ color: 'black' }}>
          Los campos con * son obligatorios. La contraseña debe tener al menos 8 caracteres, con letras y números.
        </Text>

        <Form.Item style={{ textAlign: 'right', marginTop: '16px' }}>
          <Button type="primary" htmlType="submit" style={{ borderRadius: '5px' }}>
            Agregar Usuario
          </Button>
        </Form.Item>
      </Form>
    </Container>
  );
}
