import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Input, Select, Button, Row, Col, Typography, Alert, Divider } from 'antd';
import { UserSwitchOutlined } from '@ant-design/icons';
import Container from '@mui/material/Container';

import usuarioService from '../../services/Usuario/usuarioapi';
import rolService from '../../services/Rol/rolapi';
import alumnoService from '../../services/Alumno/alumnoapi';
import { reglaPassword } from '../../utils/validaciones';
import { usuarioLogueado } from '../../services/sesion';

const { Title, Text } = Typography;
const { Option } = Select;

export default function ModificarUsuario() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [alumnos, setAlumnos] = useState([]);
  const [usuarioId, setUsuarioId] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [form] = Form.useForm();

  // El admin no puede cambiarse su propio rol
  const esUsuarioPropio = Boolean(usuarioId) && usuarioLogueado()._id === usuarioId;

  const rolElegido = Form.useWatch('rol', form);
  const esRolAlumno = roles.some((rol) => rol._id === rolElegido && rol.descripcion === 'alumno');

  const mostrarMensaje = (setMensaje, mensaje) => {
    setMensaje(mensaje);
    setTimeout(() => setMensaje(null), 2000);
  };

  useEffect(() => {
    usuarioService.obtenerUsuarios().then((res) => setUsuarios(res)).catch((error) => mostrarMensaje(setError, error.mensaje));
    rolService.obtenerRoles().then((res) => setRoles(res)).catch((error) => mostrarMensaje(setError, error.mensaje));
  }, []);

  // Carga los datos del usuario elegido (desde el selector o desde la URL)
  const cargarUsuario = (idUsuario) => {
    setUsuarioId(idUsuario);
    form.resetFields();
    usuarioService.obtenerUsuario(idUsuario)
      .then((usuario) => {
        form.setFieldsValue({
          usuarioId: usuario._id,
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          email: usuario.email,
          rol: usuario.rol ? usuario.rol._id : undefined,
          alumno: usuario.alumno ? usuario.alumno._id : undefined,
        });
        // Alumnos sin usuario, mas el que ya tiene vinculado
        return alumnoService.obtenerAlumnosSinUsuario(usuario.alumno ? usuario.alumno._id : '');
      })
      .then((res) => setAlumnos(res))
      .catch((error) => mostrarMensaje(setError, error.mensaje));
  };

  // Si se entra desde el listado (/Usuarios/Modificar/:id) se carga ese usuario
  useEffect(() => {
    if (id) cargarUsuario(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const onFinish = (values) => {
    const datos = { nombre: values.nombre, apellido: values.apellido, rol: values.rol, alumno: values.alumno };
    // La contraseña solo se manda si el admin la quiere resetear
    if (values.password) {
      datos.password = values.password;
    }

    usuarioService.actualizarUsuario(usuarioId, datos)
      .then(() => {
        mostrarMensaje(setSuccess, 'Usuario modificado exitosamente.');
        setTimeout(() => navigate('/Usuarios/Listado'), 1500);
      })
      .catch((error) => {
        console.error('Error al modificar usuario:', error);
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
      <Title level={2}>Modificar Usuario</Title>
      <UserSwitchOutlined style={{ fontSize: '50px', marginBottom: '20px' }} />

      {error && (
        <Alert message="Error" description={error} type="error" showIcon closable onClose={() => setError(null)} style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 2000 }} />
      )}
      {success && (
        <Alert message="Éxito" description={success} type="success" showIcon style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 2000 }} />
      )}

      <Form form={form} name="ModificarUsuario" onFinish={onFinish} layout="vertical" style={{ width: '100%' }}>
        <Form.Item label="Seleccionar Usuario" name="usuarioId" rules={[{ required: true, message: 'Seleccione el usuario' }]}>
          <Select showSearch optionFilterProp="children" placeholder="Buscar usuario..." onChange={cargarUsuario}>
            {usuarios.map((usuario) => (
              <Option key={usuario._id} value={usuario._id}>
                {`${usuario.apellido}, ${usuario.nombre} (${usuario.email})`}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item label="Nombre" name="nombre" rules={[{ required: true, whitespace: true, message: 'Ingrese el nombre' }]}>
              <Input disabled={!usuarioId} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Apellido" name="apellido" rules={[{ required: true, whitespace: true, message: 'Ingrese el apellido' }]}>
              <Input disabled={!usuarioId} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Email (no se puede cambiar)" name="email">
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Rol"
              name="rol"
              rules={[{ required: true, message: 'Seleccione el rol' }]}
              extra={esUsuarioPropio ? 'No podés cambiar tu propio rol.' : null}
            >
              <Select disabled={!usuarioId || esUsuarioPropio} onChange={() => form.setFieldsValue({ alumno: undefined })}>
                {roles.map((rol) => (
                  <Option key={rol._id} value={rol._id} style={{ textTransform: 'capitalize' }}>
                    {rol.descripcion}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

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
        </Row>

        <Divider>Resetear contraseña (opcional)</Divider>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item label="Contraseña nueva" name="password" rules={[reglaPassword]}>
              <Input.Password autoComplete="new-password" disabled={!usuarioId} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Repetir contraseña"
              name="confirmarPassword"
              dependencies={['password']}
              rules={[
                // Tiene que coincidir con la contraseña nueva
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if ((getFieldValue('password') || '') === (value || '')) return Promise.resolve();
                    return Promise.reject(new Error('Las contraseñas no coinciden'));
                  },
                }),
              ]}
            >
              <Input.Password autoComplete="new-password" disabled={!usuarioId} />
            </Form.Item>
          </Col>
        </Row>

        <Text type="secondary" style={{ color: 'black' }}>
          Si dejás la contraseña vacía, el usuario sigue con la que tenía.
        </Text>

        <Form.Item style={{ textAlign: 'right', marginTop: '16px' }}>
          <Button style={{ marginRight: '10px' }} onClick={() => navigate('/Usuarios/Listado')}>Cancelar</Button>
          <Button type="primary" htmlType="submit" disabled={!usuarioId}>Modificar Usuario</Button>
        </Form.Item>
      </Form>
    </Container>
  );
}
