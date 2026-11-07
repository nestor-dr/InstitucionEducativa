import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import miImagen from '../../images/Fondo 6.png';
import {
  HomeOutlined,
  TeamOutlined,
  SolutionOutlined,
  UserAddOutlined,
  UserSwitchOutlined,
  ProfileOutlined,
  ProjectOutlined,
  ScheduleOutlined,
  ReconciliationOutlined,
  ReadOutlined,
  FileSearchOutlined,
  FileAddOutlined,
  BookOutlined,
  CalendarOutlined,
  SafetyCertificateOutlined,
  IdcardOutlined,
  LogoutOutlined,
  DownOutlined,
  UserOutlined
} from '@ant-design/icons';

import { Layout, Menu, Avatar, Dropdown, Button, Space} from 'antd';
import { usuarioLogueado, cerrarSesion } from '../../services/sesion';

const { Header, Content, Footer, Sider } = Layout;

// La key de cada item es la ruta, asi el menu marca la pantalla actual
function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

// Arma el menu lateral segun el rol del usuario logueado
function armarMenu(rol) {
  const inicio = getItem(<Link to="/Inicio"> Inicio </Link>, '/Inicio', <HomeOutlined />);
  const datosPersonales = getItem(<Link to="/DatosPersonales"> Datos Personales </Link>, '/DatosPersonales', <IdcardOutlined />);

  if (rol === 'admin') {
    return [
      inicio,
      getItem('Alumnos', 'alumnos', <TeamOutlined />, [
        getItem(<Link to="/Alumnos/Listado"> Listado de Alumnos </Link>, '/Alumnos/Listado', <SolutionOutlined />),
        getItem(<Link to="/Alumnos/Crear"> Alta de Alumno </Link>, '/Alumnos/Crear', <UserAddOutlined />),
        getItem(<Link to="/Alumnos/Modificar">Modificar Alumno </Link>, '/Alumnos/Modificar', <UserSwitchOutlined />),
      ]),
      getItem('Cursos', 'cursos', <ProfileOutlined />, [
        getItem(<Link to="/Cursos/Listado"> Listado de Curso </Link>, '/Cursos/Listado', <ProjectOutlined />),
        getItem(<Link to="/Cursos/Crear"> Alta de Curso </Link>, '/Cursos/Crear', <ScheduleOutlined />),
        getItem(<Link to="/Cursos/Modificar"> Modificar Curso </Link>, '/Cursos/Modificar', <ReconciliationOutlined />),
      ]),
      getItem(<Link to="/Materias/Listado"> Materias </Link>, '/Materias/Listado', <BookOutlined />),
      getItem(<Link to="/Anios/Listado"> Años </Link>, '/Anios/Listado', <CalendarOutlined />),
      getItem('Usuarios', 'usuarios', <SafetyCertificateOutlined />, [
        getItem(<Link to="/Usuarios/Listado"> Listado de Usuarios </Link>, '/Usuarios/Listado', <SolutionOutlined />),
        getItem(<Link to="/Usuarios/Crear"> Alta de Usuario </Link>, '/Usuarios/Crear', <UserAddOutlined />),
        getItem(<Link to="/Usuarios/Modificar"> Modificar Usuario </Link>, '/Usuarios/Modificar', <UserSwitchOutlined />),
      ]),
      datosPersonales,
    ];
  }

  if (rol === 'profesor') {
    return [
      inicio,
      getItem('Boletines', 'boletines', <ReadOutlined />, [
        getItem(<Link to="/Boletines/Listado"> Listado de Boletines </Link>, '/Boletines/Listado', <FileSearchOutlined />),
        getItem(<Link to="/Boletines/Crear"> Generar Boletin </Link>, '/Boletines/Crear', <FileAddOutlined />),
      ]),
      datosPersonales,
    ];
  }

  if (rol === 'alumno') {
    return [
      inicio,
      getItem(<Link to="/MiBoletin"> Mi Boletín </Link>, '/MiBoletin', <ReadOutlined />),
      datosPersonales,
    ];
  }

  return [inicio, datosPersonales];
}

const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Se lee en cada render para que siempre este actualizado (ej: despues de editar los datos personales)
  const usuario = usuarioLogueado();
  const items = armarMenu(usuario.rol);

  const salir = () => {
    cerrarSesion();
    navigate('/');
  };

  const menuUsuario = {
    items: [
      { key: 'datosPersonales', label: 'Datos Personales', icon: <IdcardOutlined />, onClick: () => navigate('/DatosPersonales') },
      { key: 'logout', label: 'Cerrar Sesión', icon: <LogoutOutlined />, onClick: salir },
    ],
  };

  return (
    <Layout style={{ minHeight: '100vh', }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className="demo-logo-vertical" />
        <Menu theme="dark" selectedKeys={[location.pathname]} mode="inline" items={items} />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: '0 24px',
            background: '#001d66',
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Dropdown menu={menuUsuario} trigger={['click']}>
            <Button type="primary" size='default' style={{ backgroundColor: '#003eb3', borderColor: '#003eb3', textTransform: 'capitalize' }}>
              <Space>
                {`Hola, ${usuario.nombre} (${usuario.rol})`}
                <DownOutlined />
              </Space>
            </Button>
          </Dropdown>
          <Avatar style={{ backgroundColor: '#ffa39e' }} icon={<UserOutlined />} />
        </Header>
        <Content
          style={{
            margin: '20px 16px',
            background: `url(${miImagen})`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
          }}
        >
          <div
            style={{
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
            }}
          >
            <Outlet />
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          ©2023 Created by Nestor del Rio
        </Footer>
      </Layout>
    </Layout>
  );
};

export default App;
