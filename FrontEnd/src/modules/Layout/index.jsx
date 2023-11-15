import { useState } from 'react'
import { UserOutlined } from '@ant-design/icons';
import { Avatar, Space } from 'antd';
import { Outlet, Link } from 'react-router-dom'
import {
  HomeOutlined,
  DownOutlined
} from '@ant-design/icons'
import { Layout, Menu, theme, Dropdown } from 'antd'

const {Header, Content, Footer, Sider } = Layout

const headerStyle = {
  textAlign: 'center',
  color: '#fff',
  height: 64,
  paddingInline: 50,
  lineHeight: '64px',
  backgroundColor: '#7dbcea',
};

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  }
}

const items = [
    getItem(<Link to="/Inicio"> Inicio </Link>, '1', <HomeOutlined />),
    getItem(<Link to="/Alumnos"> Alumnos </Link>, '2', <HomeOutlined />),
    getItem(<Link to="/Cursos"> Cursos </Link>, '3', <HomeOutlined />),
    getItem(<Link to="/Boletines"> Boletines </Link>, '3', <HomeOutlined />),  
]


const App = () => {
  const [collapsed, setCollapsed] = useState(false)
  const {
    token: { colorBgContainer },
  } = theme.useToken()

  const handleLogout = () => {
    sessionStorage.clear();
    window.location.href= '/';
  };

  return (
    <Layout
      style={{
        minHeight: '100vh',
      }}
    >
  
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          defaultSelectedKeys={['1']}
          mode="inline"
          items={items}
        ></Menu>
      </Sider>
      <Layout style={{ width: '100%' }}>
      <Header style={headerStyle}>
        <Space ddirection="horizontal" style={{ width: '100%', justifyContent: 'space-between' }}>
          <Space wrap size={16} >
          <Dropdown
    overlay={
      <Menu>
        <Menu.Item key="logout" onClick={handleLogout}>
          Cerrar sesión
        </Menu.Item>
      </Menu>
    }
    trigger={['click']}
  >
    <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
      {/* <span style={{ color: 'white' }}>Hola {nombreUsuario}</span> */}
      <DownOutlined style={{ marginLeft: '8px' }} />
    </div>
  </Dropdown>
  <Avatar shape="square" size="large" icon={<UserOutlined />} />
    </Space>
        </Space>
      </Header>
        <Content
          style={{
            margin: '20px 16px',
          }}
        >
          <div
            style={{
              height: '100%',
              background: colorBgContainer,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
            }}
          >
            <Outlet />
          </div>
        </Content>
        <Footer
          style={{
            textAlign: 'center',
          }}
        >
          Ant Design ©2023 Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  )
}
export default App