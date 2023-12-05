import { Container, Grid, Paper, Typography } from '@mui/material';

const DatosPersonales = () => {

  const usuario = JSON.parse(localStorage.getItem('usuario'));

  return (
    <Container maxWidth="md">
      <Paper style={{ padding: '20px', backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
        <Typography variant="h4" gutterBottom>
          Datos Personales
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Typography>Nombre: {usuario.usuario.nombre}</Typography>
            <Typography>Apellido: {usuario.usuario.apellido}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>Correo: {usuario.usuario.email}</Typography>
            <Typography>Rol: {usuario.usuario.rol}</Typography>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default DatosPersonales;