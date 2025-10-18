import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Space, 
  Tag,
  Avatar,
  Drawer,
  Form,
  Input,
  Select,
  message,
  Popconfirm,
  Empty
} from 'antd';
import { 
  PlusOutlined,
  EyeOutlined,
  EditOutlined,
  LockOutlined,
  UserOutlined,
  CrownOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import api from '../../../config/axios';

const { Option } = Select;

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();
  
  // View user details state
  const [viewDrawerVisible, setViewDrawerVisible] = useState(false);
  const [viewingUser, setViewingUser] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);
  
  // Delete user state
  const [deletingUserId, setDeletingUserId] = useState(null);
  
  // Upgrade to premium state
  const [upgradingUserId, setUpgradingUserId] = useState(null);
  
  // Force logout state
  const [forceLogoutUserId, setForceLogoutUserId] = useState(null);
  
  // API response state
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  // Filter and sort state
  const [filters, setFilters] = useState({
    username: '',
    fullName: ''
  });
  const [sortBy, setSortBy] = useState('id');
  const [sortDirection, setSortDirection] = useState('ASC');

  // Fetch users when component mounts or filters change
  useEffect(() => {
    fetchUsers();
  }, [currentPage, pageSize, sortBy, sortDirection, filters]);

  /**
   * 👥 Fetch users from API with pagination, sorting, and filtering
   */
  const fetchUsers = async () => {
    setLoading(true);
    try {
      // 📋 Prepare API parameters
      const params = {
        page: currentPage - 1, // API expects 0-based page
        size: pageSize,
        sortBy,
        sortDirection,
        ...filters
      };

      // 🧹 Remove empty filter values
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === null || params[key] === undefined) {
          delete params[key];
        }
      });

      // 🔗 API Call: GET /users with query parameters
      console.log('📡 Fetching users with params:', params);
      const response = await api.get('/users', { params });
      console.log('📊 User API Response:', response.data);
      console.log('📊 Requested page:', params.page + 1, 'Page size:', params.size);
      
      // 📊 Process API response with fallback handling
      let userData, total, pages, current;
      
      if (response.data) {
        // Handle different API response formats
        if (response.data.accounts) {
          // Format: { accounts: [...], totalElements: 100, totalPages: 10, currentPage: 0 }
          ({ accounts: userData, totalElements: total, totalPages: pages, currentPage: current } = response.data);
        } else if (response.data.users) {
          // Format: { users: [...], totalElements: 100, totalPages: 10, currentPage: 0 }
          ({ users: userData, totalElements: total, totalPages: pages, currentPage: current } = response.data);
        } else if (response.data.content) {
          // Format: { content: [...], totalElements: 100, totalPages: 10, number: 0 }
          userData = response.data.content;
          total = response.data.totalElements;
          pages = response.data.totalPages;
          current = response.data.number;
        } else if (Array.isArray(response.data)) {
          // Format: direct array
          userData = response.data;
          total = response.data.length;
          pages = 1;
          current = 0;
        } else {
          // Fallback
          userData = [];
          total = 0;
          pages = 0;
          current = 0;
        }
      } else {
        userData = [];
        total = 0;
        pages = 0;
        current = 0;
      }
      
      console.log('📊 Processed user data:', { users: userData?.length, total, pages, current });
      
      // 💾 Update state with fetched data (fallback values for safety)
      console.log('📊 Setting state:', { 
        users: userData?.length, 
        totalElements: total, 
        totalPages: pages, 
        currentPage: current 
      });
      
      setUsers(userData || []);
      setTotalElements(total || 0);
      setTotalPages(pages || 0);
      
      // Only update currentPage if it's different from what we requested
      // This prevents infinite loops when API returns different page numbers
      const apiCurrentPage = (current || 0) + 1; // Convert 0-based to 1-based
      if (apiCurrentPage !== currentPage) {
        console.log('📄 API returned different page:', apiCurrentPage, 'vs requested:', currentPage);
        setCurrentPage(apiCurrentPage);
      }
    } catch (error) {
      console.error('❌ Failed to fetch users:', error);
      message.error('Failed to fetch users');
      
      // 🔄 Reset state on error
      setUsers([]);
      setTotalElements(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = () => {
    setEditingUser(null);
    form.resetFields();
    setDrawerVisible(true);
  };

  /**
   * 👁️ Fetch and view detailed user information
   * @param {number} userId - User ID
   */
  const handleViewUser = async (userId) => {
    setViewLoading(true);
    try {
      // 🔗 API Call: GET /users/{userId}
      const response = await api.get(`/users/${userId}`);
      
      // 💾 Update state and show user details drawer
      setViewingUser(response.data);
      setViewDrawerVisible(true);
    } catch (error) {
      console.error('❌ Failed to fetch user details:', error);
      message.error('Failed to fetch user details');
    } finally {
      setViewLoading(false);
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    form.setFieldsValue({
      fullName: user.fullName,
      phoneNumber: user.phoneNumber,
      birthdate: user.birthdate,
      gender: user.gender
    });
    setDrawerVisible(true);
  };

  /**
   * 🗑️ Delete/Deactivate user by ID
   * @param {number} userId - User ID to delete/deactivate
   */
  const handleDeleteUser = async (userId) => {
    console.log('Attempting to delete user with ID:', userId);
    setDeletingUserId(userId);
    try {
      // 🔗 API Call: DELETE /users/{userId}
      const response = await api.delete(`/users/${userId}`);
      console.log('Delete response:', response);
      message.success('Xóa user thành công');
      
      // 🔄 Refresh the user list after successful deletion
      fetchUsers();
    } catch (error) {
      console.error('❌ Failed to delete user:', error);
      console.error('Error details:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      message.error(`Xóa user thất bại: ${error.response?.data?.message || error.message}`);
    } finally {
      setDeletingUserId(null);
    }
  };

  /**
   * 👑 Upgrade user to Premium
   * @param {number} userId - User ID to upgrade to premium
   */
  const handleUpgradeToPremium = async (userId) => {
    setUpgradingUserId(userId);
    try {
      // 🔗 API Call: PATCH /admin/upgrade-to-premium/{userId}
      await api.patch(`/admin/upgrade-to-premium/${userId}`);
      message.success('User has been upgraded to Premium successfully');
      
      // 🔄 Refresh user details to show updated status
      if (viewingUser && viewingUser.userId === userId) {
        await handleViewUser(userId);
      }
      
      // 🔄 Also refresh the user list
      fetchUsers();
    } catch (error) {
      console.error('❌ Failed to upgrade user to premium:', error);
      message.error(`Upgrade failed: ${error.response?.data?.message || error.message}`);
    } finally {
      setUpgradingUserId(null);
    }
  };

  /**
   * 🚪 Force logout user
   * @param {number} userId - User ID to force logout
   */
  const handleForceLogout = async (userId) => {
    setForceLogoutUserId(userId);
    try {
      // 🔗 API Call: POST /admin/force-logout/{userId}
      await api.post(`/admin/force-logout/${userId}`);
      message.success('User has been logged out successfully');
    } catch (error) {
      console.error('❌ Failed to force logout user:', error);
      message.error(`Force logout failed: ${error.response?.data?.message || error.message}`);
    } finally {
      setForceLogoutUserId(null);
    }
  };

  /**
   * 💾 Handle user form submission (Create/Update)
   * @param {Object} values - Form values
   */
  const handleSubmit = async (values) => {
    try {
      if (editingUser) {
        // ✏️ Update existing user
        // 🔗 API Call: PUT /users/{userId}
        await api.put(`/users/${editingUser.userId}`, values);
        message.success('User updated successfully');
      } else {
        // ➕ Create new user
        // 🔗 API Call: POST /users
        await api.post('/users', values);
        message.success('User added successfully');
      }
      setDrawerVisible(false);
      
      // 🔄 Refresh the user list after successful operation
      fetchUsers();
    } catch (error) {
      console.error('❌ Failed to save user:', error);
      message.error('Failed to save user');
    }
  };

  // Handle table changes (pagination, sorting, filtering)
  const handleTableChange = (pagination, tableFilters, sorter) => {
    console.log('🔄 Table change event:', { pagination, tableFilters, sorter });
    console.log('🔄 Current state:', { currentPage, pageSize });
    
    // Handle pagination
    if (pagination.current !== currentPage) {
      console.log('📄 Page changed from', currentPage, 'to', pagination.current);
      setCurrentPage(pagination.current);
    }
    if (pagination.pageSize !== pageSize) {
      console.log('📄 Page size changed from', pageSize, 'to', pagination.pageSize);
      setPageSize(pagination.pageSize);
      setCurrentPage(1); // Reset to first page when page size changes
    }

    // Handle sorting
    if (sorter && sorter.field) {
      console.log('🔄 Sort changed:', sorter.field, sorter.order);
      setSortBy(sorter.field);
      setSortDirection(sorter.order === 'ascend' ? 'ASC' : 'DESC');
    }

    // Handle filtering
    const newFilters = { ...filters };
    Object.keys(tableFilters).forEach(key => {
      if (tableFilters[key] && tableFilters[key].length > 0) {
        newFilters[key] = tableFilters[key][0];
      } else {
        newFilters[key] = '';
      }
    });
    
    // Only update filters if they actually changed to prevent unnecessary re-renders
    const filtersChanged = JSON.stringify(newFilters) !== JSON.stringify(filters);
    if (filtersChanged) {
      console.log('🔍 Filters changed:', newFilters);
      setFilters(newFilters);
      setCurrentPage(1); // Reset to first page when filters change
    }
    
    // The useEffect will automatically trigger fetchUsers when state changes
  };


  const columns = [
    {
      title: 'ID',
      dataIndex: 'userId',
      key: 'userId',
      sorter: true,
      width: 80,
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
      sorter: true,
      render: (username, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Avatar 
            src={record.avatarUrl} 
            icon={<UserOutlined />}
            size="small"
          />
          <span style={{ fontWeight: 500 }}>{username || 'N/A'}</span>
        </div>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: true,
      render: (email) => (
        <span>{email || 'N/A'}</span>
      ),
    },
    {
      title: 'Full Name',
      dataIndex: 'fullName',
      key: 'fullName',
      sorter: true,
      render: (fullName) => (
        <span>{fullName || 'N/A'}</span>
      ),
    },
    {
      title: 'Phone Number',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      sorter: true,
      render: (phoneNumber) => (
        <span>{phoneNumber || 'N/A'}</span>
      ),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      sorter: true,
      filters: [
        { text: 'ADMIN', value: 'ADMIN' },
        { text: 'REGULAR', value: 'REGULAR' },
        { text: 'VIP', value: 'VIP' },
      ],
      render: (role) => (
        <Tag color={role === 'ADMIN' ? 'red' : role === 'VIP' ? 'gold' : 'blue'}>
          {role || 'N/A'}
        </Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      sorter: true,
      filters: [
        { text: 'ACTIVE', value: 'ACTIVE' },
        { text: 'INACTIVE', value: 'INACTIVE' },
      ],
      render: (status) => (
        <Tag color={status === 'ACTIVE' ? 'green' : 'orange'}>
          {status || 'N/A'}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="text" 
            icon={<EyeOutlined />}
            size="small"
            title="View"
            onClick={() => handleViewUser(record.userId)}
            loading={viewLoading}
          />
          <Button 
            type="text" 
            icon={<EditOutlined />}
            size="small"
            title="Edit"
            onClick={() => handleEditUser(record)}
          />
          <Popconfirm
            title="Bạn có chắc muốn vô hiệu hóa user này không?"
            onConfirm={() => handleDeleteUser(record.userId)}
            okText="Có"
            cancelText="No"
            disabled={deletingUserId === record.userId}
          >
            <Button 
              type="text" 
              icon={<LockOutlined />}
              size="small"
              danger
              title="Delete"
              loading={deletingUserId === record.userId}
              disabled={deletingUserId === record.userId}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {/* Header with Add Button */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <div>
          <h2 style={{ margin: 0, color: '#262626' }}>User Management</h2>
          <p style={{ margin: '4px 0 0 0', color: '#8c8c8c' }}>
            Manage system users and their permissions
          </p>
        </div>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={handleAddUser}
          size="large"
        >
          Add User
        </Button>
      </div>

      {/* Debug Info */}
      <div style={{ marginBottom: '16px', padding: '8px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
        <strong>Debug Info:</strong> Page {currentPage} of {totalPages || 1} | 
        Total: {totalElements} users | 
        Showing {users.length} users | 
        Page Size: {pageSize}
      </div>

      {/* Users Table */}
      <Table
        columns={columns}
        dataSource={users}
        rowKey="userId"
        loading={loading}
        onChange={handleTableChange}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: totalElements,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => 
            `${range[0]}-${range[1]} of ${total} users`,
          pageSizeOptions: ['10', '20', '50', '100'],
        }}
        scroll={{ x: 800 }}
        style={{
          background: '#fff',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
        }}
        locale={{
          emptyText: (
            <Empty
              description="No users found"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          )
        }}
      />

      {/* Add/Edit User Drawer */}
      <Drawer
        title={editingUser ? 'Edit User' : 'Add New User'}
        width={400}
        open={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="fullName"
            label="Full Name"
            rules={[{ required: true, message: 'Please enter full name' }]}
          >
            <Input placeholder="Enter full name" />
          </Form.Item>

          <Form.Item
            name="phoneNumber"
            label="Phone Number"
          >
            <Input placeholder="Enter phone number" />
          </Form.Item>

          <Form.Item
            name="birthdate"
            label="Birthdate"
          >
            <Input type="date" />
          </Form.Item>

          <Form.Item
            name="gender"
            label="Gender"
          >
            <Select placeholder="Select gender" allowClear>
              <Option value="male">Male</Option>
              <Option value="female">Female</Option>
              <Option value="other">Other</Option>
            </Select>
          </Form.Item>
          
          <Form.Item style={{ marginBottom: 0, marginTop: '32px' }}>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => setDrawerVisible(false)}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                {editingUser ? 'Update' : 'Add'} User
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Drawer>

      {/* View User Details Drawer */}
      <Drawer
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>User Details</span>
            {viewingUser && !viewingUser.isPremium && (
              <Button
                type="primary"
                icon={<CrownOutlined />}
                onClick={() => handleUpgradeToPremium(viewingUser.userId)}
                loading={upgradingUserId === viewingUser.userId}
                disabled={upgradingUserId === viewingUser.userId}
                style={{ 
                  background: 'linear-gradient(45deg, #ffd700, #ffed4e)',
                  borderColor: '#ffd700',
                  color: '#000'
                }}
              >
                Upgrade to Premium
              </Button>
            )}
          </div>
        }
        width={500}
        open={viewDrawerVisible}
        onClose={() => setViewDrawerVisible(false)}
        footer={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {viewingUser && (
              <Popconfirm
                title="Bạn có chắc muốn đăng xuất bắt buộc user này không?"
                onConfirm={() => handleForceLogout(viewingUser.userId)}
                okText="Có"
                cancelText="No"
                disabled={forceLogoutUserId === viewingUser.userId}
              >
                <Button
                  type="primary"
                  danger
                  icon={<LogoutOutlined />}
                  loading={forceLogoutUserId === viewingUser.userId}
                  disabled={forceLogoutUserId === viewingUser.userId}
                >
                  Đăng xuất bắt buộc
                </Button>
              </Popconfirm>
            )}
            <Button onClick={() => setViewDrawerVisible(false)}>
              Đóng
            </Button>
          </div>
        }
      >
        {viewingUser && (
          <div style={{ padding: '16px 0' }}>
            {/* Basic Information */}
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ marginBottom: '16px', color: '#262626' }}>Thông tin cơ bản</h3>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                <Avatar 
                  src={viewingUser.avatarUrl} 
                  icon={<UserOutlined />}
                  size={64}
                  style={{ marginRight: '16px' }}
                />
                <div>
                  <div style={{ fontSize: '18px', fontWeight: 600, marginBottom: '4px' }}>
                    {viewingUser.fullName || 'N/A'}
                  </div>
                  <div style={{ color: '#8c8c8c' }}>
                    ID: {viewingUser.userId}
                  </div>
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <div style={{ color: '#8c8c8c', fontSize: '12px', marginBottom: '4px' }}>Email</div>
                  <div>{viewingUser.email || 'N/A'}</div>
                </div>
                <div>
                  <div style={{ color: '#8c8c8c', fontSize: '12px', marginBottom: '4px' }}>Số điện thoại</div>
                  <div>{viewingUser.phoneNumber || 'N/A'}</div>
                </div>
                <div>
                  <div style={{ color: '#8c8c8c', fontSize: '12px', marginBottom: '4px' }}>Ngày sinh</div>
                  <div>{viewingUser.birthdate ? new Date(viewingUser.birthdate).toLocaleDateString() : 'N/A'}</div>
                </div>
                <div>
                  <div style={{ color: '#8c8c8c', fontSize: '12px', marginBottom: '4px' }}>Giới tính</div>
                  <div>
                    {viewingUser.gender ? (
                      <Tag color={viewingUser.gender === 'male' ? 'blue' : viewingUser.gender === 'female' ? 'pink' : 'default'}>
                        {viewingUser.gender.charAt(0).toUpperCase() + viewingUser.gender.slice(1)}
                      </Tag>
                    ) : 'N/A'}
                  </div>
                </div>
                <div>
                  <div style={{ color: '#8c8c8c', fontSize: '12px', marginBottom: '4px' }}>Trạng thái xác thực</div>
                  <div>
                    <Tag color={viewingUser.isVerified ? 'success' : 'warning'}>
                      {viewingUser.isVerified ? 'Đã xác thực' : 'Chưa xác thực'}
                    </Tag>
                  </div>
                </div>
                <div>
                  <div style={{ color: '#8c8c8c', fontSize: '12px', marginBottom: '4px' }}>Trạng thái Premium</div>
                  <div>
                    <Tag color={viewingUser.isPremium ? 'gold' : 'default'}>
                      {viewingUser.isPremium ? 'Premium' : 'Free'}
                    </Tag>
                  </div>
                </div>
                <div>
                  <div style={{ color: '#8c8c8c', fontSize: '12px', marginBottom: '4px' }}>VIP Days Left</div>
                  <div>
                    {viewingUser.vipDaysLeft ? (
                      <Tag color="gold">{viewingUser.vipDaysLeft} days</Tag>
                    ) : 'No VIP'}
                  </div>
                </div>
              </div>
            </div>

            {/* Statistics */}
            {viewingUser.stats && (
              <div>
                <h3 style={{ marginBottom: '16px', color: '#262626' }}>Thống kê học tập</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <div style={{ color: '#8c8c8c', fontSize: '12px', marginBottom: '4px' }}>Tổng bộ Flashcard</div>
                    <div style={{ fontSize: '16px', fontWeight: 600 }}>
                      {viewingUser.stats.totalFlashcardSets || 0}
                    </div>
                  </div>
                  <div>
                    <div style={{ color: '#8c8c8c', fontSize: '12px', marginBottom: '4px' }}>Tổng bộ Quiz</div>
                    <div style={{ fontSize: '16px', fontWeight: 600 }}>
                      {viewingUser.stats.totalQuizSets || 0}
                    </div>
                  </div>
                  <div>
                    <div style={{ color: '#8c8c8c', fontSize: '12px', marginBottom: '4px' }}>Lần làm Flashcard</div>
                    <div style={{ fontSize: '16px', fontWeight: 600 }}>
                      {viewingUser.stats.totalFlashcardAttempts || 0}
                    </div>
                  </div>
                  <div>
                    <div style={{ color: '#8c8c8c', fontSize: '12px', marginBottom: '4px' }}>Lần làm Quiz</div>
                    <div style={{ fontSize: '16px', fontWeight: 600 }}>
                      {viewingUser.stats.totalQuizAttempts || 0}
                    </div>
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <div style={{ color: '#8c8c8c', fontSize: '12px', marginBottom: '4px' }}>Điểm trung bình Quiz</div>
                    <div style={{ fontSize: '16px', fontWeight: 600 }}>
                      {viewingUser.stats.averageQuizScore ? 
                        `${viewingUser.stats.averageQuizScore.toFixed(1)}%` : 
                        'Chưa có dữ liệu'
                      }
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default UserManagement;