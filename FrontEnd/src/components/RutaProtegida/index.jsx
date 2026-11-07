import PropTypes from 'prop-types';
import { Navigate, Outlet } from 'react-router-dom';
import { obtenerSesion } from '../../services/sesion';

// Deja entrar solo si hay sesion y, si se indican roles, si el usuario tiene alguno
// Ej: <Route element={<RutaProtegida roles={['admin']} />}> ... </Route>
export default function RutaProtegida({ roles }) {
  const sesion = obtenerSesion();

  // Sin sesion vuelve al login
  if (!sesion || !sesion.token) {
    return <Navigate to="/" replace />;
  }

  // Con sesion pero sin el rol necesario vuelve al inicio
  if (roles && !roles.includes(sesion.usuario.rol)) {
    return <Navigate to="/Inicio" replace />;
  }

  return <Outlet />;
}

// Roles que pueden entrar (si no se pasa, alcanza con estar logueado)
RutaProtegida.propTypes = {
  roles: PropTypes.arrayOf(PropTypes.string),
};
