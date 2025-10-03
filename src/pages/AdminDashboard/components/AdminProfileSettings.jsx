import React, { useState, useEffect, useRef } from 'react';
import {
  Card,
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  Typography,
  message,
  Avatar,
  Tabs,
  Space,
  Tag,
  Divider,
  Row,
  Col,
  Statistic
} from 'antd';
import { 
  UserOutlined, 
  EditOutlined, 
  SaveOutlined, 
  CloseOutlined,
  MailOutlined,
  PhoneOutlined,
  CalendarOutlined,
  TeamOutlined
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import api from '../../../config/axios';
import dayjs from 'dayjs';

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

const AdminProfileSettings = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [viewLoading, setViewLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [adminData, setAdminData] = useState(null);
  const fileInputRef = useRef();

  useEffect(() => {
    fetchAdminData();
  }, []);

  /**
   * 📊 Fetch admin data from API
   */
  const fetchAdminData = async () => {
    setViewLoading(true);
    try {
      // 🔗 API Call: GET /users/me (admin endpoint)
      const response = await api.get('/users/me');
      setAdminData(response.data);
      
      // Set form values
      form.setFieldsValue({
        fullName: response.data.fullName || '',
        phoneNumber: response.data.phoneNumber || '',
        birthdate: response.data.birthdate ? dayjs(response.data.birthdate) : null,
        gender: response.data.gender || 'MALE',
        email: response.data.email || '',
      });
      
      // Set avatar
      if (response.data.avatarUrl) {
        setImageUrl(response.data.avatarUrl);
      }
    } catch (err) {
      console.error('❌ Failed to fetch admin data:', err);
      setError('Failed to load admin profile');
      message.error('Failed to load admin profile');
    } finally {
      setViewLoading(false);
    }
  };

  /**
   * 📸 Handle image upload
   */
  const handleImageUpload = async (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG files!');
      return false;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must be smaller than 2MB!');
      return false;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'SDN_Blog');
      formData.append('cloud_name', 'dejilsup7');

      const response = await fetch(
        'https://api.cloudinary.com/v1_1/dejilsup7/image/upload',
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      setImageUrl(result.secure_url);
      message.success('Image uploaded successfully!');
    } catch (err) {
      console.error('Upload error:', err);
      message.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
    return false;
  };

  /**
   * 💾 Handle form submission
   */
  const handleFinish = async (values) => {
    setLoading(true);
    setError(null);
    try {
    
      await api.put(`/users/${adminData.id}/update`, {
        fullName: values.fullName,
        phoneNumber: values.phoneNumber,
        birthdate: values.birthdate ? values.birthdate.format('YYYY-MM-DD') : '',
        gender: values.gender,
        email: values.email,
        emailVerified: adminData.emailVerified,
        username: values.fullName,
        avatarUrl: imageUrl,
      });
      
      message.success('Profile updated successfully!');
      setIsEditing(false);
      
      // Refresh admin data
      await fetchAdminData();
    } catch (err) {
      console.error('❌ Failed to update profile:', err);
      setError('Update failed');
      message.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  /**
   * 🔄 Handle edit mode toggle
   */
  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing - reset form
      form.setFieldsValue({
        fullName: adminData.fullName || '',
        phoneNumber: adminData.phoneNumber || '',
        birthdate: adminData.birthdate ? dayjs(adminData.birthdate) : null,
        gender: adminData.gender || 'MALE',
        email: adminData.email || '',
      });
      setImageUrl(adminData.avatarUrl);
    }
    setIsEditing(!isEditing);
  };

  if (viewLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '400px' 
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #1890ff',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }}></div>
          <Text>Loading admin profile...</Text>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Text type="danger">{error}</Text>
          <br />
          <Button type="primary" onClick={fetchAdminData} style={{ marginTop: '16px' }}>
            Try Again
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <Title level={2} style={{ margin: 0, color: '#262626' }}>
          Admin Profile Settings
        </Title>
        <Paragraph style={{ margin: '8px 0 0 0', color: '#8c8c8c' }}>
          Manage your admin profile information and settings
        </Paragraph>
      </div>

      <Tabs defaultActiveKey="profile" size="large">
        <TabPane tab="Profile Information" key="profile">
          <Row gutter={[24, 24]}>
            {/* Profile Overview */}
            <Col xs={24} lg={8}>
              <Card>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ position: 'relative', display: 'inline-block', marginBottom: '24px' }}>
                    <Avatar
                      size={120}
                      src={imageUrl || undefined}
                      icon={!imageUrl ? <UserOutlined /> : undefined}
                      style={{ 
                        border: '4px solid #f0f0f0',
                        cursor: isEditing ? 'pointer' : 'default'
                      }}
                      onClick={() => {
                        if (isEditing && fileInputRef.current) {
                          fileInputRef.current.click();
                        }
                      }}
                    />
                    {isEditing && (
                      <div style={{
                        position: 'absolute',
                        bottom: '0',
                        right: '0',
                        background: '#1890ff',
                        color: 'white',
                        borderRadius: '50%',
                        width: '32px',
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                      }}>
                        <EditOutlined />
                      </div>
                    )}
                  </div>
                  
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={async (e) => {
                      const file = e.target.files[0];
                      if (file) {
                        await handleImageUpload(file);
                        e.target.value = '';
                      }
                    }}
                  />

                  <Title level={3} style={{ margin: '0 0 8px 0' }}>
                    {adminData?.fullName || 'Admin User'}
                  </Title>
                  <Text type="secondary">{adminData?.email}</Text>
                  
                  <div style={{ marginTop: '16px' }}>
                    <Tag color="red" style={{ fontSize: '14px', padding: '4px 12px' }}>
                      ADMIN
                    </Tag>
                  </div>
                </div>
              </Card>
            </Col>

            {/* Profile Form */}
            <Col xs={24} lg={16}>
              <Card
                title={
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Profile Details</span>
                    <Space>
                      {isEditing ? (
                        <>
                          <Button 
                            icon={<CloseOutlined />} 
                            onClick={handleEditToggle}
                            disabled={loading}
                          >
                            Cancel
                          </Button>
                          <Button 
                            type="primary" 
                            icon={<SaveOutlined />} 
                            onClick={() => form.submit()}
                            loading={loading}
                          >
                            Save Changes
                          </Button>
                        </>
                      ) : (
                        <Button 
                          type="primary" 
                          icon={<EditOutlined />} 
                          onClick={handleEditToggle}
                        >
                          Edit Profile
                        </Button>
                      )}
                    </Space>
                  </div>
                }
              >
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={handleFinish}
                  disabled={!isEditing}
                >
                  <Row gutter={16}>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        label="Full Name"
                        name="fullName"
                        rules={[{ required: true, message: 'Please enter full name' }]}
                      >
                        <Input 
                          prefix={<UserOutlined />}
                          placeholder="Enter full name" 
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                          { required: true, message: 'Please enter email' },
                          { type: 'email', message: 'Please enter valid email' }
                        ]}
                      >
                        <Input 
                          prefix={<MailOutlined />}
                          placeholder="Enter email" 
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        label="Phone Number"
                        name="phoneNumber"
                      >
                        <Input 
                          prefix={<PhoneOutlined />}
                          placeholder="Enter phone number" 
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        label="Birthdate"
                        name="birthdate"
                      >
                        <DatePicker
                          style={{ width: '100%' }}
                          format="YYYY-MM-DD"
                          placeholder="Select birthdate"
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        label="Gender"
                        name="gender"
                      >
                        <Select placeholder="Select gender">
                          <Option value="MALE">Male</Option>
                          <Option value="FEMALE">Female</Option>
                          <Option value="OTHER">Other</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </Card>
            </Col>
          </Row>
        </TabPane>

        <TabPane tab="Account Overview" key="overview">
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={12}>
              <Card title="Account Information">
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                  <div>
                    <Text strong>Account ID:</Text>
                    <br />
                    <Text code>{adminData?.id}</Text>
                  </div>
                  <div>
                    <Text strong>Role:</Text>
                    <br />
                    <Tag color="red" style={{ marginTop: '4px' }}>ADMINISTRATOR</Tag>
                  </div>
                  <div>
                    <Text strong>Status:</Text>
                    <br />
                    <Tag color="green" style={{ marginTop: '4px' }}>ACTIVE</Tag>
                  </div>
                  <div>
                    <Text strong>Email Verified:</Text>
                    <br />
                    <Tag color={adminData?.isVerified ? 'green' : 'orange'} style={{ marginTop: '4px' }}>
                      {adminData?.isVerified ? 'Verified' : 'Not Verified'}
                    </Tag>
                  </div>
                </Space>
              </Card>
            </Col>
            
            <Col xs={24} lg={12}>
              <Card title="Account Statistics">
                <Row gutter={16}>
                  <Col span={12}>
                    <Statistic
                      title="Admin Since"
                      value={adminData?.createdAt ? new Date(adminData.createdAt).getFullYear() : 'N/A'}
                      prefix={<CalendarOutlined />}
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic
                      title="Last Updated"
                      value={adminData?.updatedAt ? new Date(adminData.updatedAt).toLocaleDateString() : 'N/A'}
                      prefix={<EditOutlined />}
                    />
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default AdminProfileSettings;

