import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom'
import Login from './modules/Login'
import Layout from './modules/Layout'
import Inicio from './modules/Inicio'
import DatosPersonales from './modules/DatosPersonales'
import RutaProtegida from './components/RutaProtegida'

import ListadoAlumno from './modules/ListadoAlumno'
import CrearAlumno from './modules/CrearAlumno'
import ModificarAlumno from './modules/ModificarAlumno'

import ListadoCurso from './modules/ListadoCurso'
import CrearCurso from './modules/CrearCurso'
import ModificarCurso from './modules/ModificarCurso'

import CrearBoletin from './modules/CrearBoletin'

function App() {

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          {/* Todo lo de adentro necesita estar logueado */}
          <Route element={<RutaProtegida />}>
            <Route element={<Layout />}>
              <Route path="Inicio" element={<Inicio />} />
              <Route path="DatosPersonales" element={<DatosPersonales />} />
              {/* Solo admin */}
              <Route element={<RutaProtegida roles={['admin']} />}>
                <Route path="Alumnos">
                  <Route path="Listado" element={<ListadoAlumno />} />
                  <Route path="Crear" element={<CrearAlumno />} />
                  <Route path="Modificar" element={<ModificarAlumno />} />
                </Route>
                <Route path="Cursos">
                  <Route path="Listado" element={<ListadoCurso />} />
                  <Route path="Crear" element={<CrearCurso />} />
                  <Route path="Modificar" element={<ModificarCurso />} />
                </Route>
              </Route>
              {/* Solo profesor */}
              <Route element={<RutaProtegida roles={['profesor']} />}>
                <Route path="Boletines">
                  <Route path="Crear" element={<CrearBoletin />} />
                </Route>
              </Route>
            </Route>
          </Route>
          {/* Cualquier otra URL va al inicio (o al login si no hay sesion) */}
          <Route path="*" element={<Navigate to="/Inicio" replace />} />
        </Routes>
      </BrowserRouter>
    </div>

  )
}

export default App
