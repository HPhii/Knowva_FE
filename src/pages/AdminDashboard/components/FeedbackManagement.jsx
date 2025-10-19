import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Card, 
  Typography, 
  message, 
  Empty,
  Tag,
  Avatar,
  Space,
  Button
} from 'antd';
import { 
  MessageOutlined,
  UserOutlined,
  CalendarOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import api from '../../../config/axios';

const { Title, Text } = Typography;

const FeedbackManagement = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // API response state
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  // Sort state
  const [sortBy, setSortBy] = useState('id');
  const [sortDirection, setSortDirection] = useState('DESC');

  // Fetch feedbacks when component mounts or sort changes
  useEffect(() => {
    fetchFeedbacks();
  }, [currentPage, pageSize, sortBy, sortDirection]);

  /**
   * 📋 Fetch feedbacks from API with pagination and sorting
   */
  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      // 📋 Prepare API parameters
      const params = {
        page: currentPage - 1, // API expects 0-based page
        size: pageSize,
        sortBy,
        sortDirection
      };

      console.log('📡 Fetching feedbacks with params:', params);
      console.log('📊 Requested page:', params.page + 1, 'Page size:', params.size);

      // 🔗 API Call: GET /feedback/all
      const response = await api.get('/feedback/all', { params });
      
      console.log('✅ API response:', response.data);
      console.log('📊 API response structure:', {
        hasFeedbacks: !!response.data.feedbacks,
        hasTotalElements: !!response.data.totalElements,
        hasTotalPages: !!response.data.totalPages,
        hasCurrentPage: !!response.data.currentPage,
        feedbacksLength: response.data.feedbacks?.length,
        totalElements: response.data.totalElements,
        totalPages: response.data.totalPages,
        currentPage: response.data.currentPage
      });

      // 📊 Extract feedback data from API response with fallback handling
      let feedbackData, total, pages, current;
      
      if (response.data) {
        // Handle different API response formats
        if (response.data.feedbacks) {
          // Format: { feedbacks: [...], totalElements: 100, totalPages: 10, currentPage: 0 }
          ({ feedbacks: feedbackData, totalElements: total, totalPages: pages, currentPage: current } = response.data);
        } else if (response.data.content) {
          // Format: { content: [...], totalElements: 100, totalPages: 10, number: 0 }
          feedbackData = response.data.content;
          total = response.data.totalElements;
          pages = response.data.totalPages;
          current = response.data.number;
        } else if (Array.isArray(response.data)) {
          // Format: direct array
          feedbackData = response.data;
          total = response.data.length;
          pages = 1;
          current = 0;
        } else {
          // Fallback
          feedbackData = [];
          total = 0;
          pages = 0;
          current = 0;
        }
      } else {
        feedbackData = [];
        total = 0;
        pages = 0;
        current = 0;
      }
      
      // 💾 Update state with fetched data (fallback values for safety)
      console.log('📊 Setting feedback state:', { 
        feedbacks: feedbackData?.length, 
        totalElements: total, 
        totalPages: pages, 
        currentPage: current 
      });
      
      setFeedbacks(feedbackData || []);
      setTotalElements(total || 0);
      setTotalPages(pages || 0);
      
      // Only update currentPage if it's different from what we requested
      // Convert 0-based API page to 1-based frontend page
      const apiCurrentPage = (current || 0) + 1;
      if (apiCurrentPage !== currentPage) {
        console.log('📄 API returned different page:', apiCurrentPage, 'vs requested:', currentPage);
        setCurrentPage(apiCurrentPage);
      }

    } catch (error) {
      console.error('❌ Failed to fetch feedbacks:', error);
      console.error('Error details:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      
      // ❌ Error message
      message.error('Không thể tải feedback, vui lòng thử lại');
      
      // 🔄 Reset state on error
      setFeedbacks([]);
      setTotalElements(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  // Handle table changes (pagination, sorting)
  const handleTableChange = (pagination, tableFilters, sorter) => {
    console.log('🔄 Feedback table change event:', { pagination, tableFilters, sorter });
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
    
    // The useEffect will automatically trigger fetchFeedbacks when state changes
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

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      sorter: true,
      width: 80,
    },
    {
      title: 'User',
      dataIndex: 'userId',
      key: 'userId',
      sorter: false,
      width: 200,
      render: (userId, record) => {
        if (!userId) {
          return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Avatar 
                icon={<UserOutlined />}
                size="small"
                style={{ backgroundColor: '#f5f5f5', color: '#999' }}
              />
              <span style={{ fontWeight: 500, color: '#8c8c8c' }}>Ẩn danh</span>
            </div>
          );
        }
        
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Avatar 
              icon={<UserOutlined />}
              size="small"
              style={{ backgroundColor: '#1890ff' }}
            />
            <div>
              <div style={{ fontWeight: 500, fontSize: '14px' }}>
                {record.username || 'User'}
              </div>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                ID: {userId}
              </Text>
            </div>
          </div>
        );
      },
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      sorter: true,
      width: 100,
      render: (rating) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ fontSize: '16px' }}>⭐</span>
          <span style={{ fontWeight: 500 }}>{rating || 'N/A'}</span>
        </div>
      ),
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
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: true,
      width: 180,
      render: (createdAt) => (
        <span>{createdAt ? formatDate(createdAt) : 'N/A'}</span>
      ),
    },
  ];

  return (
    <div>
      {/* Header with Refresh */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <div>
          <h2 style={{ margin: 0, color: '#262626' }}>Feedback Management</h2>
          <p style={{ margin: '4px 0 0 0', color: '#8c8c8c' }}>
            View and manage all user feedback
          </p>
        </div>
        <Button 
          icon={<ReloadOutlined />}
          onClick={fetchFeedbacks}
          loading={loading}
        >
          Refresh
        </Button>
      </div>


      {/* Feedback Table */}
      <Table
        columns={columns}
        dataSource={feedbacks}
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
            `${range[0]}-${range[1]} of ${total} feedbacks`,
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
              description="No feedback found"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          )
        }}
      />

      {/* Statistics Card */}
      {totalElements > 0 && (
        <Card 
          title="Statistics"
          style={{ 
            marginTop: '24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 600, color: '#1890ff' }}>
                {totalElements}
              </div>
              <Text type="secondary">Total feedback</Text>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 600, color: '#52c41a' }}>
                {feedbacks.filter(f => f.userId).length}
              </div>
              <Text type="secondary">Feedback with user info</Text>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 600, color: '#faad14' }}>
                {feedbacks.filter(f => !f.userId).length}
              </div>
              <Text type="secondary">Anonymous feedback</Text>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default FeedbackManagement;
