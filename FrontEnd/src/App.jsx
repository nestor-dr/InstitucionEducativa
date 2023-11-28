import { Routes, Route, BrowserRouter } from 'react-router-dom'
import Login from './modules/Login'
import Layout from './modules/Layout'
import Inicio from './modules/Inicio'
import ListadoAlumno from './modules/ListadoAlumno'
import CrearAlumno from './modules/CrearAlumno'
import ModificarAlumno from './modules/ModificarAlumno'

function App() {

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route element={<Layout />}>
              <Route path="Inicio" element={<Inicio />} />
              <Route path="Alumnos">
              <Route path="Listado" element={<ListadoAlumno />} />
              <Route path="Crear" element={<CrearAlumno />} />
              <Route path="Modificar" element={<ModificarAlumno />} />
            </Route>
          </Route>         
        </Routes> 
      </BrowserRouter> 
    </div>

  )
}

export default App
