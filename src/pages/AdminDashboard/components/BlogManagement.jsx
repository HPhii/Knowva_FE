import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Input, 
  Select, 
  Button, 
  Space, 
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
  EditOutlined, 
  DeleteOutlined, 
  PlusOutlined,
  FileTextOutlined,
  EyeOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const { Search } = Input;
const { Option } = Select;
const { TextArea } = Input;

const BlogManagement = () => {
  const { t } = useTranslation();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();

  // Mock data - replace with actual API calls
  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      // Mock API call - replace with actual API
      const mockBlogs = [
        {
          id: 1,
          title: 'The Science Behind Effective Learning',
          author: 'Dr. Sarah Johnson',
          createdAt: '2024-03-15',
          status: 'published',
          excerpt: 'Discover the cognitive science principles that make learning effective...',
          category: 'Learning Science'
        },
        {
          id: 2,
          title: 'How AI is Revolutionizing Education',
          author: 'Michael Chen',
          createdAt: '2024-03-10',
          status: 'published',
          excerpt: 'Explore how artificial intelligence is transforming education...',
          category: 'Technology'
        },
        {
          id: 3,
          title: 'Study Smarter, Not Harder',
          author: 'Emily Rodriguez',
          createdAt: '2024-03-05',
          status: 'draft',
          excerpt: 'Learn proven study techniques from top students...',
          category: 'Study Tips'
        },
        {
          id: 4,
          title: 'The Future of Digital Learning',
          author: 'Alex Thompson',
          createdAt: '2024-02-28',
          status: 'archived',
          excerpt: 'A deep dive into emerging trends in educational technology...',
          category: 'EdTech'
        }
      ];
      
      setBlogs(mockBlogs);
    } catch (error) {
      message.error(t('admin.common.error'));
    } finally {
      setLoading(false);
    }
  };

  // Filter blogs based on search and filters
  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchText.toLowerCase()) ||
                         blog.author.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = statusFilter === 'all' || blog.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Handle add blog
  const handleAddBlog = () => {
    addForm.resetFields();
    setAddModalVisible(true);
  };

  // Handle edit blog
  const handleEditBlog = (blog) => {
    setSelectedBlog(blog);
    editForm.setFieldsValue({
      title: blog.title,
      excerpt: blog.excerpt,
      category: blog.category,
      status: blog.status
    });
    setEditModalVisible(true);
  };

  // Handle delete blog
  const handleDeleteBlog = (blog) => {
    setSelectedBlog(blog);
    setDeleteModalVisible(true);
  };

  // Handle add form submit
  const handleAddSubmit = async (values) => {
    try {
      // Mock API call - replace with actual API
      const newBlog = {
        id: Date.now(),
        ...values,
        author: 'Admin User',
        createdAt: new Date().toISOString().split('T')[0]
      };
      setBlogs([newBlog, ...blogs]);
      setAddModalVisible(false);
      message.success(t('admin.blogManagement.addSuccess'));
    } catch (error) {
      message.error(t('admin.blogManagement.addError'));
    }
  };

  // Handle edit form submit
  const handleEditSubmit = async (values) => {
    try {
      // Mock API call - replace with actual API
      const updatedBlogs = blogs.map(blog => 
        blog.id === selectedBlog.id ? { ...blog, ...values } : blog
      );
      setBlogs(updatedBlogs);
      setEditModalVisible(false);
      message.success(t('admin.blogManagement.updateSuccess'));
    } catch (error) {
      message.error(t('admin.blogManagement.updateError'));
    }
  };

  // Handle delete blog confirm
  const handleDeleteConfirm = async () => {
    try {
      // Mock API call - replace with actual API
      const updatedBlogs = blogs.filter(blog => blog.id !== selectedBlog.id);
      setBlogs(updatedBlogs);
      setDeleteModalVisible(false);
      message.success(t('admin.blogManagement.deleteSuccess'));
    } catch (error) {
      message.error(t('admin.blogManagement.deleteError'));
    }
  };

  // Get status tag color
  const getStatusColor = (status) => {
    switch (status) {
      case 'published': return 'success';
      case 'draft': return 'warning';
      case 'archived': return 'default';
      default: return 'default';
    }
  };

  // Table columns
  const columns = [
    {
      title: t('admin.blogManagement.table.title'),
      dataIndex: 'title',
      key: 'title',
      sorter: (a, b) => a.title.localeCompare(b.title),
      render: (title) => <strong className="text-blue-600">{title}</strong>,
    },
    {
      title: t('admin.blogManagement.table.author'),
      dataIndex: 'author',
      key: 'author',
      sorter: (a, b) => a.author.localeCompare(b.author),
    },
    {
      title: t('admin.blogManagement.table.createdAt'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
    {
      title: t('admin.blogManagement.table.status'),
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: t('admin.blogManagement.status.published'), value: 'published' },
        { text: t('admin.blogManagement.status.draft'), value: 'draft' },
        { text: t('admin.blogManagement.status.archived'), value: 'archived' },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {t(`admin.blogManagement.status.${status}`)}
        </Tag>
      ),
    },
    {
      title: t('admin.blogManagement.table.actions'),
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="text" 
            size="small" 
            icon={<EyeOutlined />}
            className="text-blue-600 hover:text-blue-800"
          >
            {t('admin.common.view')}
          </Button>
          <Button 
            type="text" 
            size="small" 
            icon={<EditOutlined />}
            onClick={() => handleEditBlog(record)}
            className="text-green-600 hover:text-green-800"
          >
            {t('admin.common.edit')}
          </Button>
          <Button 
            type="text" 
            size="small" 
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteBlog(record)}
            className="text-red-600 hover:text-red-800"
          >
            {t('admin.common.delete')}
          </Button>
        </Space>
      ),
    },
  ];

  // Statistics
  const stats = {
    total: blogs.length,
    published: blogs.filter(b => b.status === 'published').length,
    draft: blogs.filter(b => b.status === 'draft').length,
    archived: blogs.filter(b => b.status === 'archived').length,
  };

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <Row gutter={16} className="mb-6">
        <Col span={6}>
          <Card className="hover:shadow-lg transition-shadow duration-200">
            <Statistic
              title="Total Blogs"
              value={stats.total}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="hover:shadow-lg transition-shadow duration-200">
            <Statistic
              title="Published"
              value={stats.published}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="hover:shadow-lg transition-shadow duration-200">
            <Statistic
              title="Drafts"
              value={stats.draft}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="hover:shadow-lg transition-shadow duration-200">
            <Statistic
              title="Archived"
              value={stats.archived}
              valueStyle={{ color: '#8c8c8c' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Search and Filters */}
      <Card className="mb-6 shadow-sm">
        <Row gutter={16} align="middle">
          <Col span={8}>
            <Search
              placeholder={t('admin.blogManagement.searchPlaceholder')}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              prefix={<SearchOutlined />}
              allowClear
              className="w-full"
            />
          </Col>
          <Col span={4}>
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              placeholder={t('admin.blogManagement.filterByStatus')}
              className="w-full"
            >
              <Option value="all">{t('admin.common.filter')}</Option>
              <Option value="published">{t('admin.blogManagement.status.published')}</Option>
              <Option value="draft">{t('admin.blogManagement.status.draft')}</Option>
              <Option value="archived">{t('admin.blogManagement.status.archived')}</Option>
            </Select>
          </Col>
          <Col span={4}>
            <Button 
              icon={<ReloadOutlined />} 
              onClick={fetchBlogs}
              loading={loading}
              className="w-full"
            >
              Refresh
            </Button>
          </Col>
          <Col span={8}>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={handleAddBlog}
              className="w-full"
            >
              {t('admin.blogManagement.addNewBlog')}
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Blogs Table */}
      <Card title={t('admin.blogManagement.title')} className="shadow-sm">
        <Table
          columns={columns}
          dataSource={filteredBlogs}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} of ${total} blogs`,
          }}
          scroll={{ x: 800 }}
          className="w-full"
        />
      </Card>

      {/* Add Blog Modal */}
      <Modal
        title={t('admin.blogManagement.addNewBlog')}
        open={addModalVisible}
        onCancel={() => setAddModalVisible(false)}
        footer={null}
        width={800}
        className="rounded-lg"
      >
        <Form
          form={addForm}
          layout="vertical"
          onFinish={handleAddSubmit}
          className="mt-4"
        >
          <Form.Item
            name="title"
            label={t('admin.blogManagement.form.title')}
            rules={[{ required: true, message: 'Please enter title' }]}
          >
            <Input 
              placeholder={t('admin.blogManagement.form.titlePlaceholder')}
              className="rounded-md" 
            />
          </Form.Item>
          
          <Form.Item
            name="excerpt"
            label={t('admin.blogManagement.form.excerpt')}
            rules={[{ required: true, message: 'Please enter excerpt' }]}
          >
            <TextArea 
              placeholder={t('admin.blogManagement.form.excerptPlaceholder')}
              rows={3}
              className="rounded-md" 
            />
          </Form.Item>
          
          <Form.Item
            name="category"
            label={t('admin.blogManagement.form.category')}
            rules={[{ required: true, message: 'Please select category' }]}
          >
            <Select 
              placeholder={t('admin.blogManagement.form.selectCategory')}
              className="rounded-md"
            >
              <Option value="Learning Science">Learning Science</Option>
              <Option value="Technology">Technology</Option>
              <Option value="Study Tips">Study Tips</Option>
              <Option value="EdTech">EdTech</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="status"
            label={t('admin.blogManagement.form.status')}
            rules={[{ required: true, message: 'Please select status' }]}
          >
            <Select className="rounded-md">
              <Option value="draft">{t('admin.blogManagement.status.draft')}</Option>
              <Option value="published">{t('admin.blogManagement.status.published')}</Option>
            </Select>
          </Form.Item>
          
          <Form.Item className="mb-0">
            <Space className="w-full justify-end">
              <Button onClick={() => setAddModalVisible(false)} className="rounded-md">
                {t('admin.common.cancel')}
              </Button>
              <Button type="primary" htmlType="submit" className="rounded-md">
                {t('admin.blogManagement.form.save')}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Blog Modal */}
      <Modal
        title={t('admin.blogManagement.title')}
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={null}
        width={800}
        className="rounded-lg"
      >
        <Form
          form={editForm}
          layout="vertical"
          onFinish={handleEditSubmit}
          className="mt-4"
        >
          <Form.Item
            name="title"
            label={t('admin.blogManagement.form.title')}
            rules={[{ required: true, message: 'Please enter title' }]}
          >
            <Input className="rounded-md" />
          </Form.Item>
          
          <Form.Item
            name="excerpt"
            label={t('admin.blogManagement.form.excerpt')}
            rules={[{ required: true, message: 'Please enter excerpt' }]}
          >
            <TextArea rows={3} className="rounded-md" />
          </Form.Item>
          
          <Form.Item
            name="category"
            label={t('admin.blogManagement.form.category')}
            rules={[{ required: true, message: 'Please select category' }]}
          >
            <Select className="rounded-md">
              <Option value="Learning Science">Learning Science</Option>
              <Option value="Technology">Technology</Option>
              <Option value="Study Tips">Study Tips</Option>
              <Option value="EdTech">EdTech</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="status"
            label={t('admin.blogManagement.form.status')}
            rules={[{ required: true, message: 'Please select status' }]}
          >
            <Select className="rounded-md">
              <Option value="draft">{t('admin.blogManagement.status.draft')}</Option>
              <Option value="published">{t('admin.blogManagement.status.published')}</Option>
              <Option value="archived">{t('admin.blogManagement.status.archived')}</Option>
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

      {/* Delete Blog Modal */}
      <Modal
        title={t('admin.blogManagement.title')}
        open={deleteModalVisible}
        onOk={handleDeleteConfirm}
        onCancel={() => setDeleteModalVisible(false)}
        okText={t('admin.common.delete')}
        cancelText={t('admin.common.cancel')}
        okButtonProps={{ danger: true }}
        className="rounded-lg"
      >
        <p className="text-gray-700">{t('admin.blogManagement.deleteConfirm')}</p>
        {selectedBlog && (
          <p className="mt-2">
            <strong>Blog: {selectedBlog.title}</strong>
          </p>
        )}
      </Modal>
    </div>
  );
};

export default BlogManagement;
