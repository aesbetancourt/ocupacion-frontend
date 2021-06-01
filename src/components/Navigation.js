import React, {useState} from 'react';
import { Layout, Menu } from 'antd';
// Styles
import 'antd/dist/antd.css';
import './assets/css/navigation.css';

//Icons
import {
    LogoutOutlined,
    UserOutlined
  } from '@ant-design/icons';

// Components
import Component1 from './Component1';
import Component2 from './Component2';
import Activites from './activities/activites';
import Reports from './reports/Reports';

import Occupation from './Occupation';

//Session
import Session from '../utils/session';
const { logout } = Session

const { Header, Content, Footer } = Layout;


const TopMenu = ({ role, name}) => {
    
    const [selected, setSelected] = useState(localStorage.getItem("nav") === undefined ? 1 : localStorage.getItem("nav"))
    const setNavigation = (key) => {
        setSelected(key);
        localStorage.setItem("nav", key)
    }
    return (
        <Layout>
            <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
                <div className="logo" />
                <Menu theme="dark" mode="horizontal" defaultSelectedKeys={[selected]}>
                    <Menu.Item key="1" onClick={() => setNavigation(1)}>nav 1</Menu.Item>
                    <Menu.Item key="2" onClick={() => setNavigation(2)}>Reportes</Menu.Item>
                    <Menu.Item key="3" onClick={() => setNavigation(3)}>Actividades</Menu.Item>
                    <Menu.Item key="4" onClick={() => setNavigation(4)}>Ocupación</Menu.Item>
                    <Menu.SubMenu 
                        style={{float: 'right'}} 
                        key="sub1" 
                        icon={<UserOutlined />} 
                        title={name}
                        >
                        <Menu.Item key="exit" icon={<LogoutOutlined />} className="customclass" onClick={logout}>Salir</Menu.Item>
                        </Menu.SubMenu>
                    
                </Menu>
            </Header>
            <Content className="site-layout"  style={{ padding: '0 50px', marginTop: 64 }}>
                <div className="site-layout-background" style={{ padding: 24, minHeight: 380, marginTop: 40  }}>
                    {String(selected) === String(1) ? <Component1/> : null}
                    {String(selected) === String(2) ? <Reports/> : null}
                    {String(selected) === String(3) ? <Activites/> : null}
                    {String(selected) === String(4) ? <Occupation/> : null}
                </div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>Intelix Synergy ©2021 </Footer>
        </Layout>
    );
}

export default TopMenu
