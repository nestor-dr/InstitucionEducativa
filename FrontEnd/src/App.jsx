import { Routes, Route, BrowserRouter } from 'react-router-dom'
import Login from './modules/Login'
import Layout from './modules/Layout'
import Inicio from './modules/Inicio'

function App() {

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />

             <Route element={<Layout />}>
              <Route path="Inicio" element={<Inicio />} />
              {/* <Route path="Prueba" element={<Prueba />} />
              <Route path="Alumnos">
                <Route index element={<Alumnos />} />
                <Route path="crear" element={<AlumnosCrear />} />
                <Route path="editar" element={<AlumnosEditar />} />
              </Route>
                <Route path="Cursos" element={<Cursos />} />
                <Route path="*" element={<NotFound />} />
            </Route>
            <Route path="Prueba" element={<Prueba />} />  */}
            </Route>
        </Routes> 
      </BrowserRouter> 
    </div>
  )
}

export default App
