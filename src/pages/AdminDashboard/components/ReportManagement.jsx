import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Space, 
  Tag,
  Input,
  Select,
  message,
  Modal,
  Form,
  Row,
  Col,
  Statistic,
  Card,
  Empty,
  Typography
} from 'antd';
import { 
  SearchOutlined,
  ReloadOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  BugOutlined,
  UserOutlined,
  CalendarOutlined,
  FlagOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import api from '../../../config/axios';

const { Option } = Select;
const { Title, Text, Paragraph } = Typography;

const ReportManagement = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [form] = Form.useForm();
  const [tempStatus, setTempStatus] = useState('');
  const [assignModalVisible, setAssignModalVisible] = useState(false);
  const [selectedReportForAssign, setSelectedReportForAssign] = useState(null);

  // Admin list for assignment
  const adminList = [
    { id: 1, name: 'Hữu An' },
    { id: 2, name: 'Cao Kha' },
    { id: 3, name: 'Hiểu Phi' }
  ];
  
  // Pagination and sorting state
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');

  // Fetch reports when component mounts or filters change
  useEffect(() => {
    fetchReports();
  }, [pagination.current, pagination.pageSize, statusFilter, categoryFilter, priorityFilter, sortBy, sortDirection]);

  /**
   * 🐛 Fetch bug reports from API with pagination, sorting, and filtering
   */
  const fetchReports = async () => {
    setLoading(true);
    try {
      // 📋 Prepare API parameters
      const params = {
        page: pagination.current - 1, // API expects 0-based page
        size: pagination.pageSize,
        sortBy: sortBy,
        sortDirection: sortDirection,
      };

      // 🔍 Add search parameter if provided
      if (searchText.trim()) {
        params.search = searchText.trim();
      }

      // 🎯 Add filters if not 'all'
      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }
      if (categoryFilter !== 'all') {
        params.category = categoryFilter;
      }
      if (priorityFilter !== 'all') {
        params.priority = priorityFilter;
      }

      // 🔗 API Call: GET /bug-reports/all with query parameters
      const response = await api.get('/bug-reports/all', { params });
      
      // 📊 Process API response with fallback handling
      console.log('📊 API Response:', response.data);
      
      if (response.data) {
        let reports, totalElements, totalPages, currentPage;
        
        // Handle different API response formats
        if (response.data.reports) {
          // Format: { reports: [...], totalElements: 100, totalPages: 10, currentPage: 0 }
          ({ reports, totalElements, totalPages, currentPage } = response.data);
        } else if (response.data.content) {
          // Format: { content: [...], totalElements: 100, totalPages: 10, number: 0 }
          reports = response.data.content;
          totalElements = response.data.totalElements;
          totalPages = response.data.totalPages;
          currentPage = response.data.number;
        } else if (Array.isArray(response.data)) {
          // Format: direct array
          reports = response.data;
          totalElements = response.data.length;
          totalPages = 1;
          currentPage = 0;
        } else {
          // Fallback
          reports = [];
          totalElements = 0;
          totalPages = 0;
          currentPage = 0;
        }
        
        console.log('📊 Processed data:', { reports: reports?.length, totalElements, totalPages, currentPage });
        
        setReports(reports || []); // 🛡️ Fallback to empty array
        setPagination(prev => ({
          ...prev,
          total: totalElements || 0, // 🛡️ Fallback to 0
        }));
      } else {
        // 🔄 Reset state if no data received
        console.log('❌ No data in response');
        setReports([]);
        setPagination(prev => ({ ...prev, total: 0 }));
      }
    } catch (error) {
      console.error('❌ Error fetching reports:', error);
      message.error('Failed to fetch reports');
      
      // 🔄 Reset state on error
      setReports([]);
      setPagination(prev => ({ ...prev, total: 0 }));
    } finally {
      setLoading(false);
    }
  };

  // Handle search with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      // Reset to first page when searching
      setPagination(prev => ({ ...prev, current: 1 }));
      // Trigger fetchReports to search
      if (searchText.trim()) {
        fetchReports();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchText]);

  // Handle filter changes
  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handleCategoryFilterChange = (value) => {
    setCategoryFilter(value);
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handlePriorityFilterChange = (value) => {
    setPriorityFilter(value);
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  // Handle pagination change
  const handleTableChange = (paginationInfo, filters, sorter) => {
    console.log('🔄 Table change:', { paginationInfo, sorter });
    
    const newPagination = {
      ...pagination,
      current: paginationInfo.current,
      pageSize: paginationInfo.pageSize,
    };
    setPagination(newPagination);

    // Handle sorting
    if (sorter && sorter.field) {
      setSortBy(sorter.field);
      setSortDirection(sorter.order === 'ascend' ? 'asc' : 'desc');
    }
    
    // The useEffect will automatically trigger fetchReports when pagination changes
  };

  const handleViewReport = (report) => {
    // Show bug report detail in modal
    setSelectedReport(report);
    setTempStatus(report.status); // Set temp status to current status
    setViewModalVisible(true);
  };

  const handleUpdateStatus = (report) => {
    setSelectedReport(report);
    form.setFieldsValue({ status: report.status });
    setStatusModalVisible(true);
  };

  /**
   * 📝 Update bug report status
   * @param {Object} values - Form values containing new status
   */
  const handleStatusSubmit = async (values) => {
    try {
      // 🔗 API Call: PUT /bug-reports/{id}/status
      const response = await api.put(`/bug-reports/${selectedReport.id}/status`, {
        status: values.status
      });
      
      // 📊 Check API response
      if (response.data && response.data.success) {
        // 🎉 Show success message first
        message.success('Cập nhật trạng thái thành công');
        
        // 🔄 Close modal
        setStatusModalVisible(false);
        
        // 🔄 Refresh the reports list to show updated data
        await fetchReports();
        
        // 🔄 Update the selected report in the reports list
        setReports(prevReports => 
          prevReports.map(report => 
            report.id === selectedReport.id 
              ? { ...report, status: values.status, updatedAt: new Date().toISOString() }
              : report
          )
        );
        
      } else {
        message.error('Không thể cập nhật trạng thái');
      }
    } catch (error) {
      console.error('❌ Error updating status:', error);
      message.error('Không thể cập nhật trạng thái');
    }
  };

  /**
   * 📝 Handle temp status change in modal (no API call)
   * @param {string} newStatus - New status value
   */
  const handleTempStatusChange = (newStatus) => {
    setTempStatus(newStatus);
  };

  /**
   * 📝 Handle assign button click
   * @param {Object} report - Bug report to assign
   */
  const handleAssignClick = (report) => {
    setSelectedReportForAssign(report);
    setAssignModalVisible(true);
  };

  /**
   * 📝 Assign bug report to admin
   * @param {number} adminId - Admin ID to assign
   */
  const handleAssignToAdmin = async (adminId) => {
    try {
      console.log('🔍 Assigning report:', selectedReportForAssign.id, 'to admin:', adminId);
      
      // 🔗 API Call: PUT /bug-reports/{id}/assign?adminId={adminId}
      const response = await api.put(`/bug-reports/${selectedReportForAssign.id}/assign?adminId=${adminId}`);
      
      console.log('📊 Assign API Response:', response.data);
      
      // Handle different API response formats
      let isSuccess = false;
      
      if (response.data) {
        // Check if response has success field
        if (response.data.success === true) {
          isSuccess = true;
        }
        // Check if response is successful without success field
        else if (response.status === 200 || response.status === 201) {
          isSuccess = true;
        }
        // Check if response has message indicating success
        else if (response.data.message && response.data.message.toLowerCase().includes('success')) {
          isSuccess = true;
        }
      }
      
      if (isSuccess) {
        // 🎉 Show success message
        message.success('Gán bug cho Admin thành công');
        
        // 🔄 Close modal
        setAssignModalVisible(false);
        
        // 🔄 Reload the entire page to refresh Bug Report Management
        setTimeout(() => {
          window.location.reload();
        }, 1000); // Delay 1 second to show the success message
        
      } else {
        console.log('❌ Assign API response not successful:', response.data);
        message.error('Không thể gán bug cho Admin');
      }
    } catch (error) {
      console.error('❌ Error assigning bug report:', error);
      message.error('Không thể gán bug cho Admin');
    }
  };

  /**
   * 📝 Save status changes to server
   */
  const handleSaveStatus = async () => {
    if (tempStatus === selectedReport.status) {
      message.info('Không có thay đổi nào để lưu');
      return;
    }

    try {
      console.log('🔍 Saving status:', tempStatus, 'for report:', selectedReport.id);
      
      // 🔗 API Call: PUT /bug-reports/{id}/status
      const response = await api.put(`/bug-reports/${selectedReport.id}/status`, {
        status: tempStatus
      });
      
      console.log('📊 API Response:', response.data);
      
      // Handle different API response formats
      let isSuccess = false;
      
      if (response.data) {
        // Check if response has success field
        if (response.data.success === true) {
          isSuccess = true;
        }
        // Check if response is successful without success field
        else if (response.status === 200 || response.status === 201) {
          isSuccess = true;
        }
        // Check if response has message indicating success
        else if (response.data.message && response.data.message.toLowerCase().includes('success')) {
          isSuccess = true;
        }
      }
      
      if (isSuccess) {
        // 🎉 Show success message
        message.success('Cập nhật trạng thái thành công');
        
        // 🔄 Close modal
        setViewModalVisible(false);
        
        // 🔄 Reload the entire page to refresh Bug Report Management
        setTimeout(() => {
          window.location.reload();
        }, 1000); // Delay 1 second to show the success message
        
      } else {
        console.log('❌ API response not successful:', response.data);
        message.error('Không thể cập nhật trạng thái');
      }
    } catch (error) {
      console.error('❌ Error updating status:', error);
      message.error('Không thể cập nhật trạng thái');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'OPEN': return 'warning';
      case 'IN_PROGRESS': return 'processing';
      case 'RESOLVED': return 'success';
      case 'CLOSED': return 'default';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'LOW': return 'default';
      case 'MEDIUM': return 'warning';
      case 'HIGH': return 'error';
      case 'CRITICAL': return 'red';
      default: return 'default';
    }
  };

  // Statistics
  const stats = {
    total: reports.length,
    open: reports.filter(r => r.status === 'OPEN').length,
    inProgress: reports.filter(r => r.status === 'IN_PROGRESS').length,
    resolved: reports.filter(r => r.status === 'RESOLVED').length,
    closed: reports.filter(r => r.status === 'CLOSED').length,
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (title) => (
        <div style={{ 
          maxWidth: '200px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
          {title}
        </div>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (description) => (
        <div style={{ 
          maxWidth: '250px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
          {description}
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      sorter: true,
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category) => (
        <Tag color="blue">
          {category || 'OTHER'}
        </Tag>
      ),
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      sorter: true,
      render: (priority) => (
        <Tag color={getPriorityColor(priority)}>
          {priority}
        </Tag>
      ),
    },
    {
      title: 'Reporter',
      dataIndex: 'reporterUsername',
      key: 'reporterUsername',
      render: (reporterUsername) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BugOutlined style={{ color: '#ff4d4f' }} />
          <span>{reporterUsername || 'N/A'}</span>
        </div>
      ),
    },
    {
      title: 'Assignee',
      dataIndex: 'assigneeUsername',
      key: 'assigneeUsername',
      render: (assigneeUsername, record) => (
        <div>
          {assigneeUsername ? (
            <span>{assigneeUsername}</span>
          ) : (
            <Button 
              type="primary" 
              size="small"
              onClick={() => handleAssignClick(record)}
              style={{ fontSize: '12px' }}
            >
              Assign
            </Button>
          )}
        </div>
      ),
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: true,
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Updated At',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (date) => new Date(date).toLocaleDateString(),
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
            onClick={() => handleViewReport(record)}
          />
          <Button 
            type="text" 
            icon={<CheckCircleOutlined />}
            size="small"
            title="Update Status"
            onClick={() => handleUpdateStatus(record)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ margin: 0, color: '#262626' }}>Bug Report Management</h2>
        <p style={{ margin: '4px 0 0 0', color: '#8c8c8c' }}>
          Track and manage bug reports from users
        </p>
      </div>

      {/* Statistics Cards */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} md={6} lg={4}>
          <Card>
            <Statistic
              title="Total Reports"
              value={stats.total}
              prefix={<BugOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6} lg={4}>
          <Card>
            <Statistic
              title="OPEN"
              value={stats.open}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6} lg={4}>
          <Card>
            <Statistic
              title="IN PROGRESS"
              value={stats.inProgress}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6} lg={4}>
          <Card>
            <Statistic
              title="RESOLVED"
              value={stats.resolved}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6} lg={4}>
          <Card>
            <Statistic
              title="CLOSED"
              value={stats.closed}
              valueStyle={{ color: '#8c8c8c' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Search and Filters */}
      <div style={{ 
        display: 'flex', 
        gap: '16px', 
        marginBottom: '16px',
        flexWrap: 'wrap'
      }}>
        <Input
          placeholder="Search reports..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: '300px' }}
          allowClear
        />
        <Select
          value={statusFilter}
          onChange={handleStatusFilterChange}
          placeholder="Filter by status"
          style={{ width: '150px' }}
        >
          <Option value="all">All Status</Option>
          <Option value="OPEN">OPEN</Option>
          <Option value="IN_PROGRESS">IN_PROGRESS</Option>
          <Option value="RESOLVED">RESOLVED</Option>
          <Option value="CLOSED">CLOSED</Option>
        </Select>
        <Select
          value={categoryFilter}
          onChange={handleCategoryFilterChange}
          placeholder="Filter by category"
          style={{ width: '150px' }}
        >
          <Option value="all">All Categories</Option>
          <Option value="UI">UI</Option>
          <Option value="FUNCTIONALITY">FUNCTIONALITY</Option>
          <Option value="PERFORMANCE">PERFORMANCE</Option>
          <Option value="PAYMENT">PAYMENT</Option>
          <Option value="SECURITY">SECURITY</Option>
          <Option value="OTHER">OTHER</Option>
        </Select>
        <Select
          value={priorityFilter}
          onChange={handlePriorityFilterChange}
          placeholder="Filter by priority"
          style={{ width: '150px' }}
        >
          <Option value="all">All Priorities</Option>
          <Option value="LOW">LOW</Option>
          <Option value="MEDIUM">MEDIUM</Option>
          <Option value="HIGH">HIGH</Option>
          <Option value="CRITICAL">CRITICAL</Option>
        </Select>
        <Button 
          icon={<ReloadOutlined />} 
          onClick={fetchReports}
          loading={loading}
        >
          Refresh
        </Button>
      </div>

      {/* Reports Table */}
      <Table
        columns={columns}
        dataSource={reports}
        rowKey="id"
        loading={loading}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => 
            `${range[0]}-${range[1]} of ${total} reports`,
          pageSizeOptions: ['10', '20', '50', '100'],
        }}
        onChange={handleTableChange}
        scroll={{ x: 1400 }}
        style={{
          background: '#fff',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
        }}
        locale={{
          emptyText: (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="Không có báo cáo lỗi nào"
            />
          )
        }}
      />

      {/* View Report Modal */}
      <Modal
        title={`Chi tiết báo cáo lỗi #${selectedReport?.id}`}
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setViewModalVisible(false)}>
            Đóng
          </Button>,
          <Button 
            key="save" 
            type="primary" 
            onClick={handleSaveStatus}
            disabled={tempStatus === selectedReport?.status}
          >
            Lưu
          </Button>
        ]}
        width={700}
      >
        {selectedReport && (
          <div>
            {/* Header Info */}
            <div style={{ marginBottom: '24px' }}>
              <Title level={3} style={{ marginBottom: '8px', color: '#262626' }}>
                {selectedReport.title}
              </Title>
              <Space size="large">
                <Text type="secondary">
                  <CalendarOutlined style={{ marginRight: '4px' }} />
                  Tạo lúc: {new Date(selectedReport.createdAt).toLocaleString('vi-VN')}
                </Text>
                <Text type="secondary">
                  <UserOutlined style={{ marginRight: '4px' }} />
                  Báo cáo bởi: {selectedReport.reporterUsername || 'N/A'}
                </Text>
              </Space>
            </div>

            {/* Status and Priority Row */}
            <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
              <Col span={12}>
                <div style={{ 
                  background: '#f8f9fa', 
                  padding: '16px', 
                  borderRadius: '8px',
                  border: '1px solid #e9ecef'
                }}>
                  <Text strong style={{ display: 'block', marginBottom: '8px' }}>
                    Trạng thái hiện tại
                  </Text>
                  <Tag 
                    color={getStatusColor(selectedReport.status)} 
                    style={{ fontSize: '14px', padding: '6px 16px' }}
                  >
                {selectedReport.status}
              </Tag>
                  {tempStatus !== selectedReport.status && (
                    <div style={{ marginTop: '8px' }}>
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        Trạng thái mới: 
                      </Text>
                      <Tag 
                        color={getStatusColor(tempStatus)} 
                        style={{ fontSize: '12px', padding: '4px 12px', marginLeft: '4px' }}
                      >
                        {tempStatus}
              </Tag>
            </div>
                  )}
                </div>
              </Col>
              <Col span={12}>
                <div style={{ 
                  background: '#f8f9fa', 
                  padding: '16px', 
                  borderRadius: '8px',
                  border: '1px solid #e9ecef'
                }}>
                  <Text strong style={{ display: 'block', marginBottom: '8px' }}>
                    Mức độ ưu tiên
                  </Text>
                  <Tag 
                    color={getPriorityColor(selectedReport.priority)}
                    style={{ fontSize: '14px', padding: '6px 16px' }}
                  >
                {selectedReport.priority}
              </Tag>
            </div>
              </Col>
            </Row>

            {/* Category and Assignee Row */}
            <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
              <Col span={12}>
                <div style={{ 
                  background: '#f8f9fa', 
                  padding: '16px', 
                  borderRadius: '8px',
                  border: '1px solid #e9ecef'
                }}>
                  <Text strong style={{ display: 'block', marginBottom: '8px' }}>
                    Danh mục
                  </Text>
                  <Tag color="blue" style={{ fontSize: '14px', padding: '6px 16px' }}>
                    {selectedReport.category || 'OTHER'}
                  </Tag>
                </div>
              </Col>
              <Col span={12}>
                <div style={{ 
                  background: '#f8f9fa', 
                  padding: '16px', 
                  borderRadius: '8px',
                  border: '1px solid #e9ecef'
                }}>
                  <Text strong style={{ display: 'block', marginBottom: '8px' }}>
                    Người được giao
                  </Text>
                  <Space align="center">
                    <UserOutlined style={{ color: '#52c41a' }} />
                    <Text>{selectedReport.assigneeUsername || 'Chưa được giao'}</Text>
                  </Space>
                </div>
              </Col>
            </Row>

            {/* Description */}
            <div style={{ marginBottom: '24px' }}>
              <Title level={4} style={{ marginBottom: '12px' }}>Mô tả chi tiết</Title>
              <div style={{ 
                background: '#f8f9fa',
                padding: '16px',
                borderRadius: '8px',
                border: '1px solid #e9ecef',
                fontSize: '14px',
                lineHeight: '1.6',
                whiteSpace: 'pre-wrap'
              }}>
                {selectedReport.description}
              </div>
            </div>

            {/* Status Update */}
            <div style={{ marginBottom: '24px' }}>
              <Title level={4} style={{ marginBottom: '12px' }}>Cập nhật trạng thái</Title>
              <div style={{ 
                background: '#f8f9fa', 
                padding: '16px', 
                borderRadius: '8px',
                border: '1px solid #e9ecef'
              }}>
                <Text strong style={{ display: 'block', marginBottom: '8px' }}>
                  Chọn trạng thái mới:
                </Text>
                <Select
                  value={tempStatus}
                  onChange={handleTempStatusChange}
                  style={{ width: '200px' }}
                  size="large"
                >
                  <Option value="OPEN">OPEN</Option>
                  <Option value="IN_PROGRESS">IN_PROGRESS</Option>
                  <Option value="RESOLVED">RESOLVED</Option>
                  <Option value="CLOSED">CLOSED</Option>
                </Select>
              </div>
            </div>

            {/* Timestamps */}
            <div style={{ 
              background: '#f8f9fa', 
              padding: '16px', 
              borderRadius: '8px',
              border: '1px solid #e9ecef'
            }}>
              <Title level={5} style={{ marginBottom: '12px' }}>Thông tin thời gian</Title>
              <Row gutter={[16, 8]}>
                <Col span={12}>
                  <Text type="secondary">Tạo lúc:</Text>
                  <div style={{ marginTop: '4px' }}>
                    <Text strong>{new Date(selectedReport.createdAt).toLocaleString('vi-VN')}</Text>
                  </div>
                </Col>
                <Col span={12}>
                  <Text type="secondary">Cập nhật lần cuối:</Text>
                  <div style={{ marginTop: '4px' }}>
                    <Text strong>{new Date(selectedReport.updatedAt).toLocaleString('vi-VN')}</Text>
            </div>
                </Col>
              </Row>
            </div>
          </div>
        )}
      </Modal>

      {/* Update Status Modal */}
      <Modal
        title="Update Status"
        open={statusModalVisible}
        onCancel={() => setStatusModalVisible(false)}
        footer={null}
        width={400}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleStatusSubmit}
        >
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Please select status' }]}
          >
            <Select placeholder="Select status">
              <Option value="OPEN">OPEN</Option>
              <Option value="IN_PROGRESS">IN_PROGRESS</Option>
              <Option value="RESOLVED">RESOLVED</Option>
              <Option value="CLOSED">CLOSED</Option>
            </Select>
          </Form.Item>
          
          <Form.Item style={{ marginBottom: 0, marginTop: '24px' }}>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => setStatusModalVisible(false)}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                Update Status
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Assign Admin Modal */}
      <Modal
        title={`Gán bug report #${selectedReportForAssign?.id} cho Admin`}
        open={assignModalVisible}
        onCancel={() => setAssignModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setAssignModalVisible(false)}>
            Hủy
          </Button>
        ]}
        width={400}
      >
        <div>
          <Text strong style={{ display: 'block', marginBottom: '16px' }}>
            Chọn Admin để gán bug report:
          </Text>
          <Space direction="vertical" style={{ width: '100%' }}>
            {adminList.map(admin => (
              <Button
                key={admin.id}
                type="default"
                size="large"
                onClick={() => handleAssignToAdmin(admin.id)}
                style={{ 
                  width: '100%', 
                  textAlign: 'left',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <span>{admin.name}</span>
                <UserOutlined />
              </Button>
            ))}
          </Space>
        </div>
      </Modal>
    </div>
  );
};

export default ReportManagement;