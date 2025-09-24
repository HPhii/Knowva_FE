import React, { useState, useEffect } from 'react';
import { Layout, Menu, Avatar, Dropdown, Typography, Button } from 'antd';
import { 
  UserOutlined, 
  FileTextOutlined, 
  BugOutlined,
  BarChartOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
  SettingOutlined,
  NotificationOutlined,
  MessageOutlined
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { clearLoginData } from '../../utils/auth';
import api from '../../config/axios';
import UserManagement from './components/UserManagement';
import BlogManagement from './components/BlogManagement';
import ReportManagement from './components/ReportManagement';
import Statistics from './components/Statistics';
import SystemNotification from './components/SystemNotification';
import FeedbackManagement from './components/FeedbackManagement';
import AdminProfileSettings from './components/AdminProfileSettings';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

const AdminDashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  
  // Get current page from URL path
  const getCurrentPage = () => {
    const path = location.pathname;
    if (path === '/admin/blogs') return 'blogManagement';
    if (path === '/admin/reports') return 'reportManagement';
    if (path === '/admin/users') return 'userManagement';
    if (path === '/admin/statistics') return 'statistics';
    if (path === '/admin/notifications') return 'systemNotification';
    if (path === '/admin/feedback') return 'feedbackManagement';
    if (path === '/admin/profile') return 'adminProfile';
    return 'userManagement'; // default
  };
  
  const [selectedMenu, setSelectedMenu] = useState(getCurrentPage());

  // 🎭 Mock admin data for demo purposes
  const adminUser = {
    name: 'Admin User',
    email: 'admin@knowva.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin'
  };

  // Update selectedMenu when URL changes and handle default redirect
  useEffect(() => {
    const currentPage = getCurrentPage();
    setSelectedMenu(currentPage);
    
    // Redirect to users page if accessing /admin directly
    if (location.pathname === '/admin') {
      navigate('/admin/users', { replace: true });
    }
  }, [location.pathname, navigate]);

  // Menu items
  const menuItems = [
    {
      key: 'userManagement',
      icon: <UserOutlined />,
      label: 'User Management',
    },
    {
      key: 'blogManagement',
      icon: <FileTextOutlined />,
      label: 'Blog Management',
    },
    {
      key: 'reportManagement',
      icon: <BugOutlined />,
      label: 'Bug Report Management',
    },
    {
      key: 'statistics',
      icon: <BarChartOutlined />,
      label: 'Statistics',
    },
    {
      key: 'systemNotification',
      icon: <NotificationOutlined />,
      label: 'System Notifications',
    },
    {
      key: 'feedbackManagement',
      icon: <MessageOutlined />,
      label: 'Feedback Management',
    },
  ];

  // Handle menu selection
  const handleMenuClick = ({ key }) => {
    setSelectedMenu(key);
    // Navigate to the corresponding URL
    switch (key) {
      case 'userManagement':
        navigate('/admin/users');
        break;
      case 'blogManagement':
        navigate('/admin/blogs');
        break;
      case 'reportManagement':
        navigate('/admin/reports');
        break;
      case 'statistics':
        navigate('/admin/statistics');
        break;
      case 'systemNotification':
        navigate('/admin/notifications');
        break;
      case 'feedbackManagement':
        navigate('/admin/feedback');
        break;
      default:
        navigate('/admin/users');
    }
  };

  /**
   * 🚪 Handle admin logout
   */
  const handleLogout = async () => {
    try {
      // 🔗 API Call: POST /logout
      await api.post('/logout');
      console.log('Logout API called successfully');
    } catch (error) {
      console.error('Logout API error:', error);
      // Continue with logout even if API call fails
    } finally {
      // 🧹 Clear login data from localStorage
      clearLoginData();
      
      // 🔄 Navigate to home page
      navigate('/');
    }
  };

  /**
   * ⚙️ Handle admin profile settings
   */
  const handleProfile = () => {
    setSelectedMenu('adminProfile');
    navigate('/admin/profile');
  };

  // User dropdown menu
  const userMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<SettingOutlined />} onClick={handleProfile}>
        Profile Settings
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  // Get page title
  const getPageTitle = () => {
    switch (selectedMenu) {
      case 'userManagement':
        return 'User Management';
      case 'blogManagement':
        return 'Blog Management';
      case 'reportManagement':
        return 'Bug Report Management';
      case 'statistics':
        return 'Statistics';
      case 'systemNotification':
        return 'System Notifications';
      case 'feedbackManagement':
        return 'Feedback Management';
      case 'adminProfile':
        return 'Admin Profile Settings';
      default:
        return 'User Management';
    }
  };

  // Render content based on selected menu
  const renderContent = () => {
    switch (selectedMenu) {
      case 'userManagement':
        return <UserManagement />;
      case 'blogManagement':
        return <BlogManagement />;
      case 'reportManagement':
        return <ReportManagement />;
      case 'statistics':
        return <Statistics />;
      case 'systemNotification':
        return <SystemNotification />;
      case 'feedbackManagement':
        return <FeedbackManagement />;
      case 'adminProfile':
        return <AdminProfileSettings />;
      default:
        return <UserManagement />;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Sidebar */}
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        theme="dark"
        width={260}
        style={{
          background: '#001529',
          boxShadow: '2px 0 8px rgba(0,0,0,0.15)'
        }}
      >
        {/* Logo Section */}
        <div style={{ 
          padding: '16px', 
          textAlign: 'center',
          borderBottom: '1px solid #002140'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            gap: '12px'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              background: 'linear-gradient(135deg, #1890ff, #40a9ff)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '16px'
            }}>
              K
            </div>
            {!collapsed && (
              <div>
                <Title level={4} style={{ color: 'white', margin: 0, fontSize: '18px' }}>
                  KnowVa Admin
                </Title>
              </div>
            )}
          </div>
        </div>

        {/* Menu */}
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedMenu]}
          items={menuItems}
          onClick={handleMenuClick}
          style={{
            background: '#001529',
            border: 'none',
            fontSize: '15px'
          }}
        />
      </Sider>
      
      <Layout>
        {/* Header */}
        <Header style={{
          background: '#fff',
          padding: '0 24px',
          borderBottom: '1px solid #f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          position: 'sticky',
          top: 0,
          zIndex: 1000
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: '16px',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            />
            <Title level={3} style={{ 
              margin: 0, 
              color: '#262626',
              fontSize: '20px',
              fontWeight: 600
            }}>
              {getPageTitle()}
            </Title>
          </div>
          
          {/* Admin Profile */}
          <Dropdown overlay={userMenu} placement="bottomRight">
            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '8px 12px',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f5f5f5';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <Avatar 
                src={adminUser.avatar} 
                icon={<UserOutlined />}
                size="large"
              />
              <div>
                <div style={{ 
                  fontWeight: 600, 
                  color: '#262626',
                  lineHeight: '1.2'
                }}>
                  {adminUser.name}
                </div>
                <div style={{ 
                  fontSize: '12px', 
                  color: '#8c8c8c',
                  lineHeight: '1.2'
                }}>
                  Administrator
                </div>
              </div>
            </div>
          </Dropdown>
        </Header>
        
        {/* Content */}
        <Content style={{
          padding: '24px',
          background: '#f5f5f5',
          minHeight: 'calc(100vh - 64px)'
        }}>
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminDashboard;
