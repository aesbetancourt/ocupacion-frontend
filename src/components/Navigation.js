import React from 'react';
import { Layout, Menu } from 'antd';
// Styles
import 'antd/dist/antd.css';
import './assets/css/navigation.css';

// Components
import Component1 from './Component1';
import Component2 from './Component2';
import Component3 from './Component3';

const { Header, Content, Footer } = Layout;


class TopMenu extends React.Component {
  state = {
      selected: 1
  };
  render() {
      return (
          <Layout>
              <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
                  <div className="logo" />
                  <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
                      <Menu.Item key="1" onClick={() => this.setState({selected: 1})}>nav 1</Menu.Item>
                      <Menu.Item key="2" onClick={() => this.setState({selected: 2})}>nav 2</Menu.Item>
                      <Menu.Item key="3" onClick={() => this.setState({selected: 3})}>nav 3</Menu.Item>
                  </Menu>
              </Header>
              <Content className="site-layout"  style={{ padding: '0 50px', marginTop: 64 }}>
                  <div className="site-layout-background" style={{ padding: 24, minHeight: 380, marginTop: 40  }}>
                      {this.state.selected === 1 ? <Component1/> : null}
                      {this.state.selected === 2 ? <Component2/> : null}
                      {this.state.selected === 3 ? <Component3/> : null}
                  </div>
              </Content>
              <Footer style={{ textAlign: 'center' }}>Intelix Synergy ©2021 </Footer>
          </Layout>
  );
  }
}

export default TopMenu
