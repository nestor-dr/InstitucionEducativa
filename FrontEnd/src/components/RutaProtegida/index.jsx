import { Navigate, Outlet } from 'react-router-dom';

// Deja entrar solo si hay sesion y, si se indican roles, si el usuario tiene alguno
// Ej: <Route element={<RutaProtegida roles={['admin']} />}> ... </Route>
export default function RutaProtegida({ roles }) {
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  // Sin sesion vuelve al login
  if (!usuario || !usuario.token) {
    return <Navigate to="/" replace />;
  }

  // Con sesion pero sin el rol necesario vuelve al inicio
  if (roles && !roles.includes(usuario.usuario.rol)) {
    return <Navigate to="/Inicio" replace />;
  }

  return <Outlet />;
}
