import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Input, 
  Select, 
  Button, 
  Space, 
  Modal, 
  message, 
  Tag,
  Card,
  Row,
  Col,
  Statistic,
  Descriptions,
  Form
} from 'antd';
import { 
  SearchOutlined, 
  EyeOutlined, 
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const { Search } = Input;
const { Option } = Select;

const ReportManagement = () => {
  const { t } = useTranslation();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [statusForm] = Form.useForm();

  // Mock data - replace with actual API calls
  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      // Mock API call - replace with actual API
      const mockReports = [
        {
          id: 1,
          reporter: 'john@example.com',
          description: 'Login page is not loading properly on mobile devices',
          date: '2024-03-21',
          status: 'pending',
          priority: 'high',
          details: 'Users are experiencing issues with the login page on mobile devices. The page takes too long to load and sometimes shows a blank screen.'
        },
        {
          id: 2,
          reporter: 'jane@example.com',
          description: 'Flashcard creation feature is broken',
          date: '2024-03-20',
          status: 'inProgress',
          priority: 'critical',
          details: 'Users cannot create new flashcards. The form submits but no cards are saved to the database.'
        },
        {
          id: 3,
          reporter: 'bob@example.com',
          description: 'Quiz results not displaying correctly',
          date: '2024-03-19',
          status: 'resolved',
          priority: 'medium',
          details: 'Quiz results were showing incorrect scores. This has been fixed in the latest update.'
        },
        {
          id: 4,
          reporter: 'alice@example.com',
          description: 'Slow performance on dashboard',
          date: '2024-03-18',
          status: 'closed',
          priority: 'low',
          details: 'Dashboard was loading slowly due to heavy database queries. Performance has been optimized.'
        }
      ];
      
      setReports(mockReports);
    } catch (error) {
      message.error(t('admin.common.error'));
    } finally {
      setLoading(false);
    }
  };

  // Filter reports based on search and filters
  const filteredReports = reports.filter(report => {
    const matchesSearch = report.description.toLowerCase().includes(searchText.toLowerCase()) ||
                         report.reporter.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Handle view report
  const handleViewReport = (report) => {
    setSelectedReport(report);
    setViewModalVisible(true);
  };

  // Handle update status
  const handleUpdateStatus = (report) => {
    setSelectedReport(report);
    statusForm.setFieldsValue({ status: report.status });
    setStatusModalVisible(true);
  };

  // Handle status update submit
  const handleStatusSubmit = async (values) => {
    try {
      // Mock API call - replace with actual API
      const updatedReports = reports.map(report => 
        report.id === selectedReport.id ? { ...report, status: values.status } : report
      );
      setReports(updatedReports);
      setStatusModalVisible(false);
      message.success(t('admin.reportManagement.statusUpdateSuccess'));
    } catch (error) {
      message.error(t('admin.reportManagement.statusUpdateError'));
    }
  };

  // Get status tag color
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'inProgress': return 'processing';
      case 'resolved': return 'success';
      case 'closed': return 'default';
      default: return 'default';
    }
  };

  // Get priority tag color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'low': return 'default';
      case 'medium': return 'warning';
      case 'high': return 'error';
      case 'critical': return 'red';
      default: return 'default';
    }
  };

  // Table columns
  const columns = [
    {
      title: t('admin.reportManagement.table.reporter'),
      dataIndex: 'reporter',
      key: 'reporter',
      sorter: (a, b) => a.reporter.localeCompare(b.reporter),
    },
    {
      title: t('admin.reportManagement.table.description'),
      dataIndex: 'description',
      key: 'description',
      render: (description) => (
        <div className="max-w-xs truncate" title={description}>
          {description}
        </div>
      ),
    },
    {
      title: t('admin.reportManagement.table.date'),
      dataIndex: 'date',
      key: 'date',
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
    },
    {
      title: t('admin.reportManagement.table.status'),
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: t('admin.reportManagement.status.pending'), value: 'pending' },
        { text: t('admin.reportManagement.status.inProgress'), value: 'inProgress' },
        { text: t('admin.reportManagement.status.resolved'), value: 'resolved' },
        { text: t('admin.reportManagement.status.closed'), value: 'closed' },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {t(`admin.reportManagement.status.${status}`)}
        </Tag>
      ),
    },
    {
      title: t('admin.reportManagement.priority'),
      dataIndex: 'priority',
      key: 'priority',
      render: (priority) => (
        <Tag color={getPriorityColor(priority)}>
          {t(`admin.reportManagement.priorities.${priority}`)}
        </Tag>
      ),
    },
    {
      title: t('admin.reportManagement.table.actions'),
      key: 'actions',
      width: 200,
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="text" 
            size="small" 
            icon={<EyeOutlined />}
            onClick={() => handleViewReport(record)}
            className="text-blue-600 hover:text-blue-800"
          >
            {t('admin.common.view')}
          </Button>
          <Button 
            type="text" 
            size="small" 
            icon={<CheckCircleOutlined />}
            onClick={() => handleUpdateStatus(record)}
            className="text-green-600 hover:text-green-800"
          >
            {t('admin.reportManagement.actions.updateStatus')}
          </Button>
        </Space>
      ),
    },
  ];

  // Statistics
  const stats = {
    total: reports.length,
    pending: reports.filter(r => r.status === 'pending').length,
    inProgress: reports.filter(r => r.status === 'inProgress').length,
    resolved: reports.filter(r => r.status === 'resolved').length,
    closed: reports.filter(r => r.status === 'closed').length,
  };

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <Row gutter={16} className="mb-6">
        <Col span={4}>
          <Card className="hover:shadow-lg transition-shadow duration-200">
            <Statistic
              title="Total Reports"
              value={stats.total}
              prefix={<ExclamationCircleOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card className="hover:shadow-lg transition-shadow duration-200">
            <Statistic
              title="Pending"
              value={stats.pending}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card className="hover:shadow-lg transition-shadow duration-200">
            <Statistic
              title="In Progress"
              value={stats.inProgress}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card className="hover:shadow-lg transition-shadow duration-200">
            <Statistic
              title="Resolved"
              value={stats.resolved}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card className="hover:shadow-lg transition-shadow duration-200">
            <Statistic
              title="Closed"
              value={stats.closed}
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
              placeholder={t('admin.reportManagement.searchPlaceholder')}
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
              placeholder={t('admin.reportManagement.filterByStatus')}
              className="w-full"
            >
              <Option value="all">{t('admin.common.filter')}</Option>
              <Option value="pending">{t('admin.reportManagement.status.pending')}</Option>
              <Option value="inProgress">{t('admin.reportManagement.status.inProgress')}</Option>
              <Option value="resolved">{t('admin.reportManagement.status.resolved')}</Option>
              <Option value="closed">{t('admin.reportManagement.status.closed')}</Option>
            </Select>
          </Col>
          <Col span={4}>
            <Button 
              icon={<ReloadOutlined />} 
              onClick={fetchReports}
              loading={loading}
              className="w-full"
            >
              Refresh
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Reports Table */}
      <Card title={t('admin.reportManagement.title')} className="shadow-sm">
        <Table
          columns={columns}
          dataSource={filteredReports}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} of ${total} reports`,
          }}
          scroll={{ x: 1000 }}
          className="w-full"
        />
      </Card>

      {/* View Report Modal */}
      <Modal
        title={t('admin.reportManagement.reportDetails')}
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setViewModalVisible(false)}>
            {t('admin.common.cancel')}
          </Button>
        ]}
        width={700}
        className="rounded-lg"
      >
        {selectedReport && (
          <Descriptions column={1} bordered className="mt-4">
            <Descriptions.Item label="Reporter">
              {selectedReport.reporter}
            </Descriptions.Item>
            <Descriptions.Item label="Date">
              {selectedReport.date}
            </Descriptions.Item>
            <Descriptions.Item label="Priority">
              <Tag color={getPriorityColor(selectedReport.priority)}>
                {t(`admin.reportManagement.priorities.${selectedReport.priority}`)}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag color={getStatusColor(selectedReport.status)}>
                {t(`admin.reportManagement.status.${selectedReport.status}`)}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Description">
              {selectedReport.description}
            </Descriptions.Item>
            <Descriptions.Item label="Details">
              {selectedReport.details}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      {/* Update Status Modal */}
      <Modal
        title={t('admin.reportManagement.updateStatus')}
        open={statusModalVisible}
        onCancel={() => setStatusModalVisible(false)}
        footer={null}
        width={500}
        className="rounded-lg"
      >
        <Form
          form={statusForm}
          layout="vertical"
          onFinish={handleStatusSubmit}
          className="mt-4"
        >
          <Form.Item
            name="status"
            label={t('admin.reportManagement.table.status')}
            rules={[{ required: true, message: 'Please select status' }]}
          >
            <Select className="rounded-md">
              <Option value="pending">{t('admin.reportManagement.status.pending')}</Option>
              <Option value="inProgress">{t('admin.reportManagement.status.inProgress')}</Option>
              <Option value="resolved">{t('admin.reportManagement.status.resolved')}</Option>
              <Option value="closed">{t('admin.reportManagement.status.closed')}</Option>
            </Select>
          </Form.Item>
          
          <Form.Item className="mb-0">
            <Space className="w-full justify-end">
              <Button onClick={() => setStatusModalVisible(false)} className="rounded-md">
                {t('admin.common.cancel')}
              </Button>
              <Button type="primary" htmlType="submit" className="rounded-md">
                {t('admin.common.save')}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ReportManagement;
