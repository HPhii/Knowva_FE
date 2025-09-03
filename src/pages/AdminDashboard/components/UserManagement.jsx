import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Input, 
  Select, 
  Button, 
  Space, 
  Avatar, 
  Dropdown, 
  Modal, 
  Form, 
  message, 
  Tag,
  Card,
  Row,
  Col,
  Statistic
} from 'antd';
import { 
  SearchOutlined, 
  FilterOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  UserOutlined,
  PlusOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const { Search } = Input;
const { Option } = Select;

const UserManagement = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editForm] = Form.useForm();

  // Mock data - replace with actual API calls
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Mock API call - replace with actual API
      const mockUsers = [
        {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          role: 'user',
          status: 'active',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
          createdAt: '2024-01-15',
          lastLogin: '2024-03-20'
        },
        {
          id: 2,
          name: 'Jane Smith',
          email: 'jane@example.com',
          role: 'moderator',
          status: 'active',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jane',
          createdAt: '2024-01-10',
          lastLogin: '2024-03-19'
        },
        {
          id: 3,
          name: 'Bob Johnson',
          email: 'bob@example.com',
          role: 'user',
          status: 'inactive',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bob',
          createdAt: '2024-02-01',
          lastLogin: '2024-02-15'
        },
        {
          id: 4,
          name: 'Alice Brown',
          email: 'alice@example.com',
          role: 'admin',
          status: 'active',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice',
          createdAt: '2024-01-01',
          lastLogin: '2024-03-21'
        },
        {
          id: 5,
          name: 'Charlie Wilson',
          email: 'charlie@example.com',
          role: 'user',
          status: 'suspended',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=charlie',
          createdAt: '2024-01-20',
          lastLogin: '2024-03-10'
        }
      ];
      
      setUsers(mockUsers);
    } catch (error) {
      message.error(t('admin.common.error'));
    } finally {
      setLoading(false);
    }
  };

  // Filter users based on search and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchText.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchText.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Handle edit user
  const handleEditUser = (user) => {
    setSelectedUser(user);
    editForm.setFieldsValue({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status
    });
    setEditModalVisible(true);
  };

  // Handle delete user
  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setDeleteModalVisible(true);
  };

  // Handle edit form submit
  const handleEditSubmit = async (values) => {
    try {
      // Mock API call - replace with actual API
      const updatedUsers = users.map(user => 
        user.id === selectedUser.id ? { ...user, ...values } : user
      );
      setUsers(updatedUsers);
      setEditModalVisible(false);
      message.success(t('admin.userManagement.updateSuccess'));
    } catch (error) {
      message.error(t('admin.userManagement.updateError'));
    }
  };

  // Handle delete user confirm
  const handleDeleteConfirm = async () => {
    try {
      // Mock API call - replace with actual API
      const updatedUsers = users.filter(user => user.id !== selectedUser.id);
      setUsers(updatedUsers);
      setDeleteModalVisible(false);
      message.success(t('admin.userManagement.deleteSuccess'));
    } catch (error) {
      message.error(t('admin.userManagement.deleteError'));
    }
  };

  // Get status tag color
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'default';
      case 'suspended': return 'error';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  // Get role tag color
  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'red';
      case 'moderator': return 'blue';
      case 'user': return 'green';
      default: return 'default';
    }
  };

  // Table columns
  const columns = [
    {
      title: t('admin.userManagement.table.avatar'),
      dataIndex: 'avatar',
      key: 'avatar',
      width: 80,
      render: (avatar, record) => (
        <Avatar 
          src={avatar} 
          icon={<UserOutlined />}
          size="large"
          alt={record.name}
        />
      ),
    },
    {
      title: t('admin.userManagement.table.name'),
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (name) => <strong>{name}</strong>,
    },
    {
      title: t('admin.userManagement.table.email'),
      dataIndex: 'email',
      key: 'email',
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: t('admin.userManagement.table.role'),
      dataIndex: 'role',
      key: 'role',
      filters: [
        { text: t('admin.userManagement.roles.admin'), value: 'admin' },
        { text: t('admin.userManagement.roles.moderator'), value: 'moderator' },
        { text: t('admin.userManagement.roles.user'), value: 'user' },
      ],
      onFilter: (value, record) => record.role === value,
      render: (role) => (
        <Tag color={getRoleColor(role)}>
          {t(`admin.userManagement.roles.${role}`)}
        </Tag>
      ),
    },
    {
      title: t('admin.userManagement.table.status'),
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: t('admin.userManagement.status.active'), value: 'active' },
        { text: t('admin.userManagement.status.inactive'), value: 'inactive' },
        { text: t('admin.userManagement.status.suspended'), value: 'suspended' },
        { text: t('admin.userManagement.status.pending'), value: 'pending' },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {t(`admin.userManagement.status.${status}`)}
        </Tag>
      ),
    },
    {
      title: t('admin.userManagement.table.actions'),
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Dropdown
          menu={{
            items: [
              {
                key: 'edit',
                icon: <EditOutlined />,
                label: t('admin.userManagement.actions.edit'),
                onClick: () => handleEditUser(record),
              },
              {
                key: 'delete',
                icon: <DeleteOutlined />,
                label: t('admin.userManagement.actions.delete'),
                onClick: () => handleDeleteUser(record),
                danger: true,
              },
            ],
          }}
          trigger={['click']}
        >
          <Button type="text" size="small">
            {t('admin.common.actions')} ▼
          </Button>
        </Dropdown>
      ),
    },
  ];

  // Statistics
  const stats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    inactive: users.filter(u => u.status === 'inactive').length,
    suspended: users.filter(u => u.status === 'suspended').length,
  };

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <Row gutter={16} className="mb-6">
        <Col span={6}>
          <Card className="hover:shadow-lg transition-shadow duration-200">
            <Statistic
              title="Total Users"
              value={stats.total}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="hover:shadow-lg transition-shadow duration-200">
            <Statistic
              title="Active Users"
              value={stats.active}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="hover:shadow-lg transition-shadow duration-200">
            <Statistic
              title="Inactive Users"
              value={stats.inactive}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="hover:shadow-lg transition-shadow duration-200">
            <Statistic
              title="Suspended Users"
              value={stats.suspended}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Search and Filters */}
      <Card className="mb-6 shadow-sm">
        <Row gutter={16} align="middle">
          <Col span={8}>
            <Search
              placeholder={t('admin.userManagement.searchPlaceholder')}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              prefix={<SearchOutlined />}
              allowClear
              className="w-full"
            />
          </Col>
          <Col span={4}>
            <Select
              value={roleFilter}
              onChange={setRoleFilter}
              placeholder={t('admin.userManagement.filterByRole')}
              className="w-full"
            >
              <Option value="all">{t('admin.common.filter')}</Option>
              <Option value="admin">{t('admin.userManagement.roles.admin')}</Option>
              <Option value="moderator">{t('admin.userManagement.roles.moderator')}</Option>
              <Option value="user">{t('admin.userManagement.roles.user')}</Option>
            </Select>
          </Col>
          <Col span={4}>
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              placeholder={t('admin.userManagement.filterByStatus')}
              className="w-full"
            >
              <Option value="all">{t('admin.common.filter')}</Option>
              <Option value="active">{t('admin.userManagement.status.active')}</Option>
              <Option value="inactive">{t('admin.userManagement.status.inactive')}</Option>
              <Option value="suspended">{t('admin.userManagement.status.suspended')}</Option>
              <Option value="pending">{t('admin.userManagement.status.pending')}</Option>
            </Select>
          </Col>
          <Col span={4}>
            <Button 
              icon={<ReloadOutlined />} 
              onClick={fetchUsers}
              loading={loading}
              className="w-full"
            >
              Refresh
            </Button>
          </Col>
          <Col span={4}>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              className="w-full"
            >
              Add User
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Users Table */}
      <Card title={t('admin.userManagement.title')} className="shadow-sm">
        <Table
          columns={columns}
          dataSource={filteredUsers}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} of ${total} users`,
          }}
          scroll={{ x: 800 }}
          className="w-full"
        />
      </Card>

      {/* Edit User Modal */}
      <Modal
        title={t('admin.userManagement.editUser')}
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={null}
        width={600}
        className="rounded-lg"
      >
        <Form
          form={editForm}
          layout="vertical"
          onFinish={handleEditSubmit}
          className="mt-4"
        >
          <Form.Item
            name="name"
            label={t('admin.userManagement.table.name')}
            rules={[{ required: true, message: 'Please enter name' }]}
          >
            <Input className="rounded-md" />
          </Form.Item>
          
          <Form.Item
            name="email"
            label={t('admin.userManagement.table.email')}
            rules={[
              { required: true, message: 'Please enter email' },
              { type: 'email', message: 'Please enter valid email' }
            ]}
          >
            <Input className="rounded-md" />
          </Form.Item>
          
          <Form.Item
            name="role"
            label={t('admin.userManagement.table.role')}
            rules={[{ required: true, message: 'Please select role' }]}
          >
            <Select className="rounded-md">
              <Option value="user">{t('admin.userManagement.roles.user')}</Option>
              <Option value="moderator">{t('admin.userManagement.roles.moderator')}</Option>
              <Option value="admin">{t('admin.userManagement.roles.admin')}</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="status"
            label={t('admin.userManagement.table.status')}
            rules={[{ required: true, message: 'Please select status' }]}
          >
            <Select className="rounded-md">
              <Option value="active">{t('admin.userManagement.status.active')}</Option>
              <Option value="inactive">{t('admin.userManagement.status.inactive')}</Option>
              <Option value="suspended">{t('admin.userManagement.status.suspended')}</Option>
              <Option value="pending">{t('admin.userManagement.status.pending')}</Option>
            </Select>
          </Form.Item>
          
          <Form.Item className="mb-0">
            <Space className="w-full justify-end">
              <Button onClick={() => setEditModalVisible(false)} className="rounded-md">
                {t('admin.common.cancel')}
              </Button>
              <Button type="primary" htmlType="submit" className="rounded-md">
                {t('admin.common.save')}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Delete User Modal */}
      <Modal
        title={t('admin.userManagement.deleteUser')}
        open={deleteModalVisible}
        onOk={handleDeleteConfirm}
        onCancel={() => setDeleteModalVisible(false)}
        okText={t('admin.common.delete')}
        cancelText={t('admin.common.cancel')}
        okButtonProps={{ danger: true }}
        className="rounded-lg"
      >
        <p className="text-gray-700">{t('admin.userManagement.deleteConfirm')}</p>
        {selectedUser && (
          <p className="mt-2">
            <strong>User: {selectedUser.name} ({selectedUser.email})</strong>
          </p>
        )}
      </Modal>
    </div>
  );
};

export default UserManagement;
