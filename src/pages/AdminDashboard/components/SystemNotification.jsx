import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Card, 
  Typography, 
  message, 
  Empty,
  Tag,
  Space,
  Button,
  Select,
  DatePicker,
  Row,
  Col,
  Drawer,
  Form,
  Input
} from 'antd';
import { 
  NotificationOutlined,
  ReloadOutlined,
  FilterOutlined,
  PlusOutlined,
  SendOutlined
} from '@ant-design/icons';
import api from '../../../config/axios';
import dayjs from 'dayjs';

const { Option } = Select;
const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

const SystemNotification = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // API response state
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  
  // Filter and sort state
  const [filters, setFilters] = useState({
    type: '',
    read: '',
    startDate: '',
    endDate: ''
  });
  const [sortBy, setSortBy] = useState('timestamp');
  const [sortDirection, setSortDirection] = useState('DESC');

  // Create notification state
  const [createDrawerVisible, setCreateDrawerVisible] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [form] = Form.useForm();

  // Notification type options
  const notificationTypes = [
    { value: 'QUIZ_INVITE', label: 'Mời làm Quiz' },
    { value: 'FLASHCARD_INVITE', label: 'Mời học Flashcard' },
    { value: 'SYSTEM_ALERT', label: 'Cảnh báo hệ thống' },
    { value: 'REMINDER', label: 'Nhắc nhở' },
    { value: 'BUG_REPORT', label: 'Báo cáo lỗi' }
  ];

  // Read status options
  const readStatusOptions = [
    { value: '', label: 'Tất cả' },
    { value: true, label: 'Đã đọc' },
    { value: false, label: 'Chưa đọc' }
  ];

  // Fetch notifications when component mounts or filters change
  useEffect(() => {
    console.log('🔄 useEffect triggered with dependencies:', {
      currentPage,
      pageSize,
      sortBy,
      sortDirection,
      filters
    });
    fetchNotifications();
  }, [currentPage, pageSize, sortBy, sortDirection, JSON.stringify(filters)]);


  /**
   * 📋 Fetch notifications from API with pagination, sorting, and filtering
   */
  const fetchNotifications = async () => {
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

      // 🔍 Ensure pagination parameters are always included
      if (params.page < 0) params.page = 0;
      if (!params.size || params.size <= 0) params.size = 10;
      
      console.log('📊 Pagination calculation:', {
        currentPage,
        calculatedPage: params.page,
        pageSize: params.size,
        note: 'API uses 0-based page, UI uses 1-based page'
      });

      // 🧹 Remove empty filter values (but keep pagination params)
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === null || params[key] === undefined) {
          // Don't delete pagination parameters
          if (key !== 'page' && key !== 'size') {
            delete params[key];
          }
        }
      });

      console.log('📡 Fetching notifications with params:', params);
      console.log('📡 Current state:', { currentPage, pageSize, sortBy, sortDirection, filters });

      // 🔗 API Call: GET /notifications
      console.log('🔗 API URL:', '/notifications');
      console.log('🔗 Final params:', params);
      const response = await api.get('/notifications', { params });
      
      console.log('📊 Notification API Response:', response.data);

      // 📊 Process API response with fallback handling
      let notificationData, total, pages, current;
      
      if (response.data) {
        // Handle different API response formats
        if (response.data.notifications) {
          // Format: { notifications: [...], totalElements: 100, totalPages: 10, currentPage: 0 }
          ({ notifications: notificationData, totalElements: total, totalPages: pages, currentPage: current } = response.data);
        } else if (response.data.content) {
          // Format: { content: [...], totalElements: 100, totalPages: 10, number: 0 }
          notificationData = response.data.content;
          total = response.data.totalElements;
          pages = response.data.totalPages;
          current = response.data.number;
        } else if (Array.isArray(response.data)) {
          // Format: direct array
          notificationData = response.data;
          total = response.data.length;
          pages = 1;
          current = 0;
        } else {
          // Fallback
          notificationData = [];
          total = 0;
          pages = 0;
          current = 0;
        }
      } else {
        notificationData = [];
        total = 0;
        pages = 0;
        current = 0;
      }
      
      console.log('📊 Processed notification data:', { notifications: notificationData?.length, total, pages, current });
      
      // 💾 Update state with fetched data (fallback values for safety)
      setNotifications(notificationData || []);
      setTotalElements(total || 0);
      setTotalPages(pages || 0);
      // Update currentPage to match API response (convert 0-based to 1-based)
      setCurrentPage((current || 0) + 1);

    } catch (error) {
      console.error('❌ Failed to fetch notifications:', error);
      console.error('Error details:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      
      // ❌ Error message
      message.error('Không thể tải thông báo');
      
      // 🔄 Reset state on error
      setNotifications([]);
      setTotalElements(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  // Handle table changes (pagination, sorting, filtering)
  const handleTableChange = (pagination, tableFilters, sorter) => {
    console.log('🔄 Notification table change:', { pagination, sorter });
    console.log('🔄 Current state before change:', { currentPage, pageSize });
    console.log('🔄 Pagination object:', pagination);
    
    // Handle pagination - always update if different
    if (pagination.current !== currentPage) {
      console.log('📄 Page changed from', currentPage, 'to', pagination.current);
      console.log('📄 Next page will be:', pagination.current);
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
      setFilters(newFilters);
      setCurrentPage(1); // Reset to first page when filters change
    }
    
    // The useEffect will automatically trigger fetchNotifications when state changes
  };

  /**
   * 🔄 Handle filter changes
   */
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    setCurrentPage(1);
  };

  /**
   * 🔄 Handle date range change
   */
  const handleDateRangeChange = (dates) => {
    if (dates && dates.length === 2) {
      setFilters(prev => ({
        ...prev,
        startDate: dates[0].format('YYYY-MM-DDTHH:mm:ss'),
        endDate: dates[1].format('YYYY-MM-DDTHH:mm:ss')
      }));
    } else {
      setFilters(prev => ({
        ...prev,
        startDate: '',
        endDate: ''
      }));
    }
    setCurrentPage(1);
  };

  /**
   * 📅 Format date to Vietnamese locale
   * @param {string} dateString - Date string to format
   */
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  /**
   * 🏷️ Get type label
   * @param {string} type - Notification type
   */
  const getTypeLabel = (type) => {
    const typeObj = notificationTypes.find(t => t.value === type);
    return typeObj ? typeObj.label : type;
  };

  /**
   * 🎨 Get type color
   * @param {string} type - Notification type
   */
  const getTypeColor = (type) => {
    const colors = {
      'QUIZ_INVITE': 'blue',
      'FLASHCARD_INVITE': 'green',
      'SYSTEM_ALERT': 'red',
      'REMINDER': 'orange',
      'BUG_REPORT': 'purple'
    };
    return colors[type] || 'default';
  };

  /**
   * 📤 Handle create notification form submission
   * @param {Object} values - Form values
   */
  const handleCreateNotification = async (values) => {
    console.log('🚀 Creating notification with values:', values);
    setCreateLoading(true);
    try {
      // 🔗 API Call: POST /admin/send-system-notification
      console.log('📡 Making API call to /admin/send-system-notification');
      
      // Backend expects ALL parameters as query parameters
      const params = { ...values };
      
      // Remove empty/undefined values
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === null || params[key] === undefined) {
          delete params[key];
        }
      });
      
      console.log('Request params:', params);
      
      const response = await api.post('/admin/send-system-notification', null, {
        params: params
      });
      console.log('✅ API response:', response);
      
      // ✅ Success message
      message.success('Gửi thông báo thành công');
      
      // 🔄 Reset form and close drawer
      form.resetFields();
      setCreateDrawerVisible(false);
      
      // 🔄 Refresh notifications list
      fetchNotifications();
    } catch (error) {
      console.error('❌ Failed to create notification:', error);
      console.error('Error details:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      
      // ❌ Error message
      message.error(`Gửi thông báo thất bại: ${error.response?.data?.message || error.message}`);
    } finally {
      setCreateLoading(false);
    }
  };

  /**
   * 🔄 Handle create notification button click
   */
  const handleCreateButtonClick = () => {
    form.resetFields();
    setCreateDrawerVisible(true);
  };

  // Table columns configuration
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      sorter: true,
      width: 80,
    },
    {
      title: 'Message',
      dataIndex: 'message',
      key: 'message',
      sorter: false,
      ellipsis: {
        showTitle: false,
      },
      render: (message) => (
        <div style={{ maxWidth: '400px' }}>
          <span 
            style={{ 
              display: 'block',
              wordBreak: 'break-word',
              lineHeight: '1.4'
            }}
            title={message}
          >
            {message || 'N/A'}
          </span>
        </div>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      sorter: false,
      width: 150,
      render: (type) => (
        <Tag color={getTypeColor(type)}>
          {getTypeLabel(type)}
        </Tag>
      ),
    },
    {
      title: 'IsRead',
      dataIndex: 'read',
      key: 'read',
      sorter: false,
      width: 120,
      render: (read) => (
        <Tag color={read ? 'green' : 'red'}>
          {read ? 'Đã đọc' : 'Chưa đọc'}
        </Tag>
      ),
    },
    {
      title: 'Timestamp',
      dataIndex: 'timestamp',
      key: 'timestamp',
      sorter: true,
      width: 180,
      render: (timestamp) => (
        <span>{timestamp ? formatDate(timestamp) : 'N/A'}</span>
      ),
    },
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <div>
          <h2 style={{ margin: 0, color: '#262626' }}>Danh sách thông báo</h2>
          <p style={{ margin: '4px 0 0 0', color: '#8c8c8c' }}>
            Quản lý và xem tất cả thông báo trong hệ thống
          </p>
        </div>
        <Space>
          <Button 
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreateButtonClick}
            size="large"
          >
            Tạo thông báo
          </Button>
          <Button 
            icon={<ReloadOutlined />}
            onClick={fetchNotifications}
            loading={loading}
          >
            Refresh
          </Button>
        </Space>
      </div>

      {/* Filter Bar */}
      <Card 
        style={{ 
          marginBottom: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
        }}
      >
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={6}>
            <div>
              <Text strong style={{ display: 'block', marginBottom: '4px' }}>Loại thông báo</Text>
              <Select
                placeholder="Chọn loại"
                style={{ width: '100%' }}
                value={filters.type}
                onChange={(value) => handleFilterChange('type', value)}
                allowClear
              >
                {notificationTypes.map(type => (
                  <Option key={type.value} value={type.value}>
                    {type.label}
                  </Option>
                ))}
              </Select>
            </div>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <div>
              <Text strong style={{ display: 'block', marginBottom: '4px' }}>Trạng thái đọc</Text>
              <Select
                placeholder="Chọn trạng thái"
                style={{ width: '100%' }}
                value={filters.read}
                onChange={(value) => handleFilterChange('read', value)}
                allowClear
              >
                {readStatusOptions.map(status => (
                  <Option key={status.value} value={status.value}>
                    {status.label}
                  </Option>
                ))}
              </Select>
            </div>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <div>
              <Text strong style={{ display: 'block', marginBottom: '4px' }}>Khoảng thời gian</Text>
              <RangePicker
                style={{ width: '100%' }}
                showTime
                format="DD/MM/YYYY HH:mm:ss"
                placeholder={['Từ ngày', 'Đến ngày']}
                onChange={handleDateRangeChange}
              />
            </div>
          </Col>
          <Col xs={24} sm={12} md={4}>
            <div>
              <Text strong style={{ display: 'block', marginBottom: '4px' }}>&nbsp;</Text>
              <Button 
                type="primary" 
                icon={<FilterOutlined />}
                onClick={fetchNotifications}
                loading={loading}
                style={{ width: '100%' }}
              >
                Lọc
              </Button>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Notifications Table */}
      <Table
        columns={columns}
        dataSource={notifications}
        rowKey="id"
        loading={loading}
        onChange={handleTableChange}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: totalElements,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => 
            `${range[0]}-${range[1]} of ${total} notifications`,
          pageSizeOptions: ['8', '16', '32', '64'],
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
              description="Không có thông báo nào"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          )
        }}
      />

      {/* Create Notification Drawer */}
      <Drawer
        title="Tạo thông báo mới"
        width={500}
        open={createDrawerVisible}
        onClose={() => setCreateDrawerVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateNotification}
          onFinishFailed={(errorInfo) => {
            console.log('❌ Form validation failed:', errorInfo);
          }}
          size="large"
        >
          {/* Notification Type */}
          <Form.Item
            name="type"
            label="Loại thông báo"
            rules={[
              { required: true, message: 'Vui lòng chọn loại thông báo' }
            ]}
          >
            <Select
              placeholder="Chọn loại thông báo"
              style={{ width: '100%' }}
            >
              {notificationTypes.map(type => (
                <Option key={type.value} value={type.value}>
                  {type.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* Message Content */}
          <Form.Item
            name="message"
            label="Nội dung thông báo"
            rules={[
              { required: true, message: 'Vui lòng nhập nội dung thông báo' },
              { min: 10, message: 'Nội dung thông báo phải có ít nhất 10 ký tự' },
              { max: 500, message: 'Nội dung thông báo không được vượt quá 500 ký tự' }
            ]}
          >
            <TextArea
              placeholder="Nhập nội dung thông báo..."
              rows={6}
              showCount
              maxLength={500}
              style={{ resize: 'vertical' }}
            />
          </Form.Item>

          {/* Set ID (optional) */}
          <Form.Item
            name="setId"
            label="ID Quiz/Flashcard (tùy chọn)"
            rules={[
              {
                validator: (_, value) => {
                  if (!value || value === '') {
                    return Promise.resolve();
                  }
                  const num = Number(value);
                  if (isNaN(num) || !Number.isInteger(num) || num < 1) {
                    return Promise.reject(new Error('ID phải là số nguyên dương'));
                  }
                  return Promise.resolve();
                }
              }
            ]}
          >
            <Input
              type="number"
              placeholder="Nhập ID Quiz hoặc Flashcard (không bắt buộc)..."
              min={1}
              style={{ width: '100%' }}
            />
          </Form.Item>

          {/* Submit Button */}
          <Form.Item style={{ marginBottom: 0, marginTop: '32px' }}>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button 
                onClick={() => setCreateDrawerVisible(false)}
                size="large"
              >
                Hủy
              </Button>
              <Button 
                type="primary" 
                htmlType="submit"
                icon={<SendOutlined />}
                loading={createLoading}
                disabled={createLoading}
                size="large"
                style={{ minWidth: '160px' }}
              >
                Gửi thông báo
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default SystemNotification;
