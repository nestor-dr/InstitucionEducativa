import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Grid, Paper, Typography } from '@mui/material';
import { Form, Input, Button, Alert, Divider } from 'antd';

import usuarioService from '../../services/Usuario/usuarioapi';
import { reglaPassword } from '../../utils/validaciones';
import { obtenerSesion, actualizarSesion } from '../../services/sesion';

const DatosPersonales = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [form] = Form.useForm();

  const sesion = obtenerSesion();
  const usuario = sesion.usuario;

  // Guarda nombre, apellido y (si se cargo) la contraseña nueva
  const onFinish = (values) => {
    const datos = { nombre: values.nombre, apellido: values.apellido };
    if (values.password) {
      datos.password = values.password;
    }

    usuarioService.actualizarUsuario(usuario._id, datos)
      .then((res) => {
        // Actualiza los datos guardados de la sesion para que se vean en el menu
        sesion.usuario = { ...usuario, nombre: res.nombre, apellido: res.apellido };
        actualizarSesion(sesion);

        form.setFieldsValue({ password: '', confirmarPassword: '' });
        setSuccess('Datos actualizados exitosamente.');
        setTimeout(() => setSuccess(null), 2000);
        navigate('/DatosPersonales', { replace: true });
      })
      .catch((error) => {
        setError(error.mensaje);
        setTimeout(() => setError(null), 2000);
      });
  };

  return (
    <Container maxWidth="md">
      {error && (
        <Alert message="Error" description={error} type="error" showIcon closable onClose={() => setError(null)} style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 2000 }} />
      )}
      {success && (
        <Alert message="Éxito" description={success} type="success" showIcon style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 2000 }} />
      )}

      <Paper style={{ padding: '20px', backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
        <Typography variant="h4" gutterBottom>
          Datos Personales
        </Typography>
        <Grid container spacing={3} style={{ textTransform: 'capitalize' }}>
          <Grid item xs={6}>
            <Typography>Nombre: {usuario.nombre}</Typography>
            <Typography>Apellido: {usuario.apellido}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography style={{ textTransform: 'none' }}>Correo: {usuario.email}</Typography>
            <Typography>Rol: {usuario.rol}</Typography>
          </Grid>
        </Grid>

        <Divider>Editar mis datos</Divider>

        <Form
          form={form}
          name="DatosPersonales"
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ nombre: usuario.nombre, apellido: usuario.apellido }}
        >
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Form.Item label="Nombre" name="nombre" rules={[{ required: true, whitespace: true, message: 'Ingrese el nombre' }]}>
                <Input autoComplete="given-name" />
              </Form.Item>
            </Grid>
            <Grid item xs={6}>
              <Form.Item label="Apellido" name="apellido" rules={[{ required: true, whitespace: true, message: 'Ingrese el apellido' }]}>
                <Input autoComplete="family-name" />
              </Form.Item>
            </Grid>
            <Grid item xs={6}>
              <Form.Item label="Contraseña nueva (opcional)" name="password" rules={[reglaPassword]}>
                <Input.Password autoComplete="new-password" />
              </Form.Item>
            </Grid>
            <Grid item xs={6}>
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
                <Input.Password autoComplete="new-password" />
              </Form.Item>
            </Grid>
          </Grid>
          <Button type="primary" htmlType="submit">Guardar cambios</Button>
        </Form>
      </Paper>
    </Container>
  );
};

export default DatosPersonales;
