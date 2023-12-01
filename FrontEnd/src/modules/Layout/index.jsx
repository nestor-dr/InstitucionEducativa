import { useState } from 'react';
import { Outlet, Link } from 'react-router-dom'
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
  DownOutlined,
  UserOutlined
} from '@ant-design/icons';

import { Layout, Menu, Avatar, Dropdown, Button, Space} from 'antd';
const { Header, Content, Footer, Sider } = Layout;
function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const usuario = JSON.parse(localStorage.getItem('usuario'));
const nombreUsuario = usuario && usuario.usuario ? usuario.usuario.nombre : '';

const items = [
  getItem(<Link to="/Inicio"> Inicio </Link>, '1', <HomeOutlined />),
  getItem('Alumnos', '2', <TeamOutlined />, 
  [
    getItem(<Link to="/Alumnos/Listado"> Listado de Alumnos </Link>, '3', <SolutionOutlined />),
    getItem(<Link to="/Alumnos/Crear"> Alta de Alumno </Link>, '4', <UserAddOutlined />),
    getItem(<Link to="/Alumnos/Modificar">Modificar Alumno </Link>, '5', <UserSwitchOutlined />),
  ]
  ),
  getItem('Cursos', '6', <ProfileOutlined />, [
    getItem(<Link to="/Cursos/Listado"> Listado de Curso </Link>, '7', <ProjectOutlined />), 
    getItem(<Link to="/Cursos/Crear"> Alta de Curso </Link>, '8', <ScheduleOutlined />),
    getItem('Asociar Curso', '9', <ReconciliationOutlined />),
  ]),
  getItem('Boletines', '10', <ReadOutlined />,[
    getItem('Buscar Boletin', '11', <FileSearchOutlined />), 
    getItem('Agregar Boletin', '12', <FileAddOutlined />),
  ]),
];

const CerrarSesion = () => {
  localStorage.clear();
  window.location.href= '/';
};

const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  const menuProps = (
    <Menu theme="dark">
      <Menu.Item key="menu-item-1">Datos Personales</Menu.Item>
      <Menu.Item key="logout" onClick={CerrarSesion}>Cerrar Sesión</Menu.Item>
    </Menu>
  );
  return (
    <Layout style={{ minHeight: '100vh', }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className="demo-logo-vertical" />
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: '#001d66',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', marginLeft: '1500px' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Dropdown overlay={menuProps} trigger={['click']}>
                <Button type="primary" size='default' style={{ backgroundColor: '#003eb3', borderColor: '#003eb3' }}>
                  <Space>
                    Hola{nombreUsuario} <DownOutlined />
                  </Space>
                </Button>
              </Dropdown>
            </div>
            <div style={{ marginLeft: '8px' }} />
            <Avatar style={{ backgroundColor: '#ffa39e' }} icon={<UserOutlined />} />
          </div>
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
          Ant Design ©2023 Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
};

export default App;