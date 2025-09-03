import React, { useState } from 'react';
import { Layout, Menu, Avatar, Dropdown, Space, Typography, Button } from 'antd';
import { 
  UserOutlined, 
  FileTextOutlined, 
  ExclamationCircleOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
  UserSwitchOutlined,
  GlobalOutlined
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import UserManagement from './components/UserManagement';
import BlogManagement from './components/BlogManagement';
import ReportManagement from './components/ReportManagement';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const AdminDashboard = () => {
  const { t, i18n } = useTranslation();
  const [collapsed, setCollapsed] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState('userManagement');

  // Mock admin data
  const adminUser = {
    name: 'Admin User',
    email: 'admin@knowva.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin'
  };

  // Menu items
  const menuItems = [
    {
      key: 'userManagement',
      icon: <UserOutlined />,
      label: t('admin.menu.userManagement'),
    },
    {
      key: 'blogManagement',
      icon: <FileTextOutlined />,
      label: t('admin.menu.blogManagement'),
    },
    {
      key: 'reportManagement',
      icon: <ExclamationCircleOutlined />,
      label: t('admin.menu.reportManagement'),
    },
  ];

  // Handle menu selection
  const handleMenuClick = ({ key }) => {
    setSelectedMenu(key);
  };

  // Handle logout
  const handleLogout = () => {
    // TODO: Implement logout logic
    console.log('Logout clicked');
  };

  // Handle profile
  const handleProfile = () => {
    // TODO: Implement profile logic
    console.log('Profile clicked');
  };

  // Handle language change
  const handleLanguageChange = (language) => {
    i18n.changeLanguage(language);
  };

  // User dropdown menu
  const userMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />} onClick={handleProfile}>
        {t('admin.profile')}
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        {t('admin.logout')}
      </Menu.Item>
    </Menu>
  );

  // Language dropdown menu
  const languageMenu = (
    <Menu>
      <Menu.Item key="en" onClick={() => handleLanguageChange('en')}>
        🇺🇸 English
      </Menu.Item>
      <Menu.Item key="vi" onClick={() => handleLanguageChange('vi')}>
        🇻🇳 Tiếng Việt
      </Menu.Item>
    </Menu>
  );

  // Render content based on selected menu
  const renderContent = () => {
    switch (selectedMenu) {
      case 'userManagement':
        return <UserManagement />;
      case 'blogManagement':
        return <BlogManagement />;
      case 'reportManagement':
        return <ReportManagement />;
      default:
        return <UserManagement />;
    }
  };

  return (
    <Layout className="min-h-screen">
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        className="bg-gray-900 transition-all duration-200 ease-in-out"
        width={280}
      >
        <div className="p-4 border-b border-gray-700 bg-gray-900">
          <Title level={4} className="text-white m-0 text-center">
            {collapsed ? 'KV' : t('admin.systemName')}
          </Title>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedMenu]}
          items={menuItems}
          onClick={handleMenuClick}
          className="border-r-0 bg-gray-900"
        />
      </Sider>
      
      <Layout>
        <Header className="bg-white px-6 flex justify-between items-center shadow-md sticky top-0 z-50">
          <div className="flex items-center gap-4">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              className="text-lg p-2 rounded-md transition-all duration-200 ease-in-out hover:bg-gray-100 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            />
            <Title level={3} className="m-0 text-blue-600 font-semibold">
              {t(`admin.${selectedMenu}.title`)}
            </Title>
          </div>
          
          <div className="flex items-center">
            <Space size="middle">
              {/* Language Selector */}
              <Dropdown overlay={languageMenu} placement="bottomRight">
                <Button 
                  type="text" 
                  icon={<GlobalOutlined />}
                  className="text-base p-2 rounded-md transition-all duration-200 ease-in-out hover:bg-gray-100 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                />
              </Dropdown>
              
              {/* User Profile */}
              <Dropdown overlay={userMenu} placement="bottomRight">
                <Space className="cursor-pointer p-2 rounded-md transition-all duration-200 ease-in-out hover:bg-gray-100 hover:scale-102">
                  <Avatar 
                    src={adminUser.avatar} 
                    icon={<UserOutlined />}
                    size="large"
                  />
                  <span className="font-medium text-gray-700">{adminUser.name}</span>
                </Space>
              </Dropdown>
            </Space>
          </div>
        </Header>
        
        <Content className="bg-gray-50 min-h-screen">
          <div className="p-6 bg-white m-6 rounded-lg shadow-md min-h-screen">
            {renderContent()}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminDashboard;
