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

import ListadoMaterias from './modules/ListadoMaterias'
import FormularioMateria from './modules/FormularioMateria'
import ListadoAnios from './modules/ListadoAnios'
import FormularioAnio from './modules/FormularioAnio'

import ListadoUsuarios from './modules/ListadoUsuarios'
import CrearUsuario from './modules/CrearUsuario'
import ModificarUsuario from './modules/ModificarUsuario'

import CrearBoletin from './modules/CrearBoletin'
import ListadoBoletines from './modules/ListadoBoletines'
import EditarBoletin from './modules/EditarBoletin'
import VerBoletin from './modules/VerBoletin'
import MiBoletin from './modules/MiBoletin'

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
                <Route path="Materias">
                  <Route path="Listado" element={<ListadoMaterias />} />
                  <Route path="Crear" element={<FormularioMateria />} />
                  <Route path="Modificar/:id" element={<FormularioMateria />} />
                </Route>
                <Route path="Anios">
                  <Route path="Listado" element={<ListadoAnios />} />
                  <Route path="Crear" element={<FormularioAnio />} />
                  <Route path="Modificar/:id" element={<FormularioAnio />} />
                </Route>
                <Route path="Usuarios">
                  <Route path="Listado" element={<ListadoUsuarios />} />
                  <Route path="Crear" element={<CrearUsuario />} />
                  <Route path="Modificar" element={<ModificarUsuario />} />
                  <Route path="Modificar/:id" element={<ModificarUsuario />} />
                </Route>
              </Route>
              {/* Solo profesor */}
              <Route element={<RutaProtegida roles={['profesor']} />}>
                <Route path="Boletines">
                  <Route path="Crear" element={<CrearBoletin />} />
                  <Route path="Listado" element={<ListadoBoletines />} />
                  <Route path="Ver/:id" element={<VerBoletin />} />
                  <Route path="Editar/:id" element={<EditarBoletin />} />
                </Route>
              </Route>
              {/* Solo alumno */}
              <Route element={<RutaProtegida roles={['alumno']} />}>
                <Route path="MiBoletin" element={<MiBoletin />} />
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
