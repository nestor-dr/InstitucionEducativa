import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import ImagenLogin from '../../images/Login.jpg'
import {  Alert  } from 'antd';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import ieService from '../../services/Institucion Educativa/ieapi';
import { guardarSesion } from '../../services/sesion';
import { useState } from 'react';

const defaultTheme = createTheme();

export default function SignInSide() {
  const [error, setError] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const usuario = {
        email : data.get('email'),
        password: data.get('password')
    }
    // "Recordarme" tildado -> localStorage; si no -> sessionStorage
    const recordar = data.get('recordar') === 'si';

    ieService.autorizacionUsuario(usuario)
    .then(res => {
      guardarSesion(res, recordar);
      window.location.href= 'Inicio';
      }).catch((error) => {
            console.error('Error al Loguearse:', error);
            setError(error.mensaje);

            setTimeout(() => {
                setError(null);
            }, 2000);
        }); 
  };



  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: `url(${ImagenLogin})`,
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        {error && (
            <Alert
                message="Error"
                description={error}
                type="error"
                showIcon
                closable
                onClose={() => setError(null)} // Limpiar el estado de error al cerrar la alerta
                style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 2000 }}
            />
        )}
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
            Ingresar al Sistema Académico
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Direccion de Email"
                name="email"
                autoComplete="email"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Contraseña"
                type="password"
                id="password"
                autoComplete="current-password"
              />
              {/* Tildado: la sesion queda guardada aunque se cierre el navegador */}
              <FormControlLabel
                control={<Checkbox name="recordar" value="si" color="primary" />}
                label="Recordarme"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Ingresar
              </Button>
              {/* No hay registro ni recuperacion de contraseña: los usuarios los maneja el admin */}
              <Typography variant="body2" color="text.secondary" align="center">
                Si no tenés usuario u olvidaste tu contraseña, pedíselo al administrador.
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}