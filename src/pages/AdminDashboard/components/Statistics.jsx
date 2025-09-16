import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Spin, 
  Empty,
  Typography,
  message,
  Statistic
} from 'antd';
import { 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import { 
  UserOutlined,
  UserAddOutlined,
  TeamOutlined,
  BookOutlined,
  FileTextOutlined,
  TrophyOutlined,
  RiseOutlined,
  BarChartOutlined
} from '@ant-design/icons';
import api from '../../../config/axios';

const { Title, Text } = Typography;

const Statistics = () => {
  const [userStats, setUserStats] = useState(null);
  const [overviewStats, setOverviewStats] = useState(null);
  const [contentStats, setContentStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🎨 Color schemes for different chart sections
  const COLORS = {
    user: ['#1890ff', '#40a9ff', '#69c0ff'],           // 👥 User-related charts
    overview: ['#52c41a', '#73d13d', '#95de64'],       // 📈 Overview statistics
    content: ['#faad14', '#ffc53d', '#ffd666'],        // 📚 Content statistics
    flashcard: ['#722ed1', '#9254de', '#b37feb'],      // 🃏 Flashcard charts
    quiz: ['#f5222d', '#ff4d4f', '#ff7875']            // 📝 Quiz charts
  };

  useEffect(() => {
    fetchAllStats();
  }, []);

  /**
   * 📊 Fetch all statistics data from multiple API endpoints
   */
  const fetchAllStats = async () => {
    setLoading(true);
    try {
      // 🔗 Parallel API Calls for better performance
      const [userRes, overviewRes, contentRes] = await Promise.all([
        api.get('/admin/stats/users'),      // 👥 User statistics
        api.get('/admin/stats/overview'),   // 📈 Overview statistics  
        api.get('/admin/stats/content')     // 📚 Content statistics
      ]);

      // 💾 Update state with fetched statistics data
      setUserStats(userRes.data);
      setOverviewStats(overviewRes.data);
      setContentStats(contentRes.data);
    } catch (error) {
      console.error('❌ Error fetching statistics:', error);
      message.error('Failed to fetch statistics data');
    } finally {
      setLoading(false);
    }
  };

  /**
   * 🔍 Helper function to check if statistics data is empty
   * @param {Object} data - Statistics data object
   * @returns {boolean} - True if data is empty or all values are zero/null
   */
  const isDataEmpty = (data) => {
    if (!data) return true;
    return Object.values(data).every(value => value === 0 || value === null || value === undefined);
  };

  /**
   * 📈 Render mini trend chart for user cards
   * @param {number} current - Current value
   * @param {number} previous - Previous value for comparison
   * @returns {JSX.Element} - Trend indicator component
   */
  const renderMiniTrend = (current, previous) => {
    const trend = previous > 0 ? ((current - previous) / previous * 100) : 0;
    const isPositive = trend >= 0;
    
    return (
      <div style={{ marginTop: '8px', fontSize: '12px' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '4px',
          color: isPositive ? '#52c41a' : '#f5222d'
        }}>
          <RiseOutlined style={{ 
            transform: isPositive ? 'rotate(0deg)' : 'rotate(180deg)',
            fontSize: '10px'
          }} />
          <span>{Math.abs(trend).toFixed(1)}%</span>
        </div>
      </div>
    );
  };

  /**
   * 🍩 Render donut chart for data comparison
   * @param {Array} data - Chart data array
   * @param {Array} colors - Color scheme array
   * @returns {JSX.Element} - Donut chart component
   */
  const renderDonutChart = (data, colors) => {
    if (isDataEmpty(data)) {
      return (
        <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Không có dữ liệu" />
        </div>
      );
    }

    return (
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => value.toLocaleString()} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    );
  };

  /**
   * 📊 Render bar chart for growth comparison
   * @param {Array} data - Chart data array
   * @returns {JSX.Element} - Bar chart component
   */
  const renderBarChart = (data) => {
    if (!data || data.length === 0) {
      return (
        <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Không có dữ liệu" />
        </div>
      );
    }

    return (
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip formatter={(value) => value.toLocaleString()} />
          <Bar dataKey="total" fill="#1890ff" name="Tổng" />
          <Bar dataKey="thisWeek" fill="#52c41a" name="Tuần này" />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '400px' 
      }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: '0 8px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <Title level={2} style={{ margin: 0, color: '#262626', fontSize: '28px' }}>
          📊 Thống kê hệ thống
        </Title>
        <Text type="secondary" style={{ fontSize: '16px' }}>
          Tổng quan chi tiết về hoạt động và dữ liệu của hệ thống
        </Text>
      </div>

      {/* Overview Statistics - Summary Section */}
      {overviewStats && !isDataEmpty(overviewStats) && (
        <div style={{ marginBottom: '32px' }}>
          <Title level={3} style={{ marginBottom: '16px', color: '#262626' }}>
            📈 Tổng quan hệ thống
          </Title>
          <Row gutter={[16, 16]}>
            <Col xs={12} sm={8} md={4}>
              <Card size="small" style={{ textAlign: 'center', background: 'linear-gradient(135deg, #1890ff, #40a9ff)' }}>
                <Statistic
                  title="Tổng người dùng"
                  value={overviewStats.totalUsers}
                  valueStyle={{ color: 'white', fontSize: '20px' }}
                  prefix={<UserOutlined style={{ color: 'white' }} />}
                />
              </Card>
            </Col>
            <Col xs={12} sm={8} md={4}>
              <Card size="small" style={{ textAlign: 'center', background: 'linear-gradient(135deg, #52c41a, #73d13d)' }}>
                <Statistic
                  title="Bộ thẻ học"
                  value={overviewStats.totalFlashcardSets}
                  valueStyle={{ color: 'white', fontSize: '20px' }}
                  prefix={<BookOutlined style={{ color: 'white' }} />}
                />
              </Card>
            </Col>
            <Col xs={12} sm={8} md={4}>
              <Card size="small" style={{ textAlign: 'center', background: 'linear-gradient(135deg, #faad14, #ffc53d)' }}>
                <Statistic
                  title="Bộ câu hỏi"
                  value={overviewStats.totalQuizSets}
                  valueStyle={{ color: 'white', fontSize: '20px' }}
                  prefix={<FileTextOutlined style={{ color: 'white' }} />}
                />
              </Card>
            </Col>
            <Col xs={12} sm={8} md={6}>
              <Card size="small" style={{ textAlign: 'center', background: 'linear-gradient(135deg, #722ed1, #9254de)' }}>
                <Statistic
                  title="Lần học thẻ"
                  value={overviewStats.totalFlashcardAttempts}
                  valueStyle={{ color: 'white', fontSize: '20px' }}
                  prefix={<TrophyOutlined style={{ color: 'white' }} />}
                />
              </Card>
            </Col>
            <Col xs={12} sm={8} md={6}>
              <Card size="small" style={{ textAlign: 'center', background: 'linear-gradient(135deg, #f5222d, #ff4d4f)' }}>
                <Statistic
                  title="Lần làm bài"
                  value={overviewStats.totalQuizAttempts}
                  valueStyle={{ color: 'white', fontSize: '20px' }}
                  prefix={<BarChartOutlined style={{ color: 'white' }} />}
                />
              </Card>
            </Col>
          </Row>
        </div>
      )}

      {/* User Statistics - Big Number Cards */}
      {userStats && !isDataEmpty(userStats) && (
        <div style={{ marginBottom: '32px' }}>
          <Title level={3} style={{ marginBottom: '16px', color: '#262626' }}>
            👥 Thống kê người dùng
          </Title>
          <Row gutter={[24, 24]}>
            <Col xs={24} md={8}>
              <Card 
                style={{ 
                  height: '200px',
                  background: 'linear-gradient(135deg, #1890ff, #40a9ff)',
                  border: 'none',
                  borderRadius: '12px'
                }}
                bodyStyle={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
              >
                <div style={{ textAlign: 'center', color: 'white' }}>
                  <UserOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
                  <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>
                    {userStats.totalUsers?.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '16px', opacity: 0.9 }}>Tổng người dùng</div>
                  {renderMiniTrend(userStats.totalUsers, userStats.totalUsers - userStats.newUsersLast7Days)}
                </div>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card 
                style={{ 
                  height: '200px',
                  background: 'linear-gradient(135deg, #52c41a, #73d13d)',
                  border: 'none',
                  borderRadius: '12px'
                }}
                bodyStyle={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
              >
                <div style={{ textAlign: 'center', color: 'white' }}>
                  <UserAddOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
                  <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>
                    {userStats.newUsersLast7Days?.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '16px', opacity: 0.9 }}>Người dùng mới tuần này</div>
                  {renderMiniTrend(userStats.newUsersLast7Days, 0)}
                </div>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card 
                style={{ 
                  height: '200px',
                  background: 'linear-gradient(135deg, #faad14, #ffc53d)',
                  border: 'none',
                  borderRadius: '12px'
                }}
                bodyStyle={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
              >
                <div style={{ textAlign: 'center', color: 'white' }}>
                  <TeamOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
                  <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>
                    {userStats.activeUsersLast7Days?.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '16px', opacity: 0.9 }}>Người dùng hoạt động tuần này</div>
                  {renderMiniTrend(userStats.activeUsersLast7Days, 0)}
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      )}

      {/* Comparison Charts */}
      {overviewStats && !isDataEmpty(overviewStats) && (
        <div style={{ marginBottom: '32px' }}>
          <Title level={3} style={{ marginBottom: '16px', color: '#262626' }}>
            📊 So sánh dữ liệu
          </Title>
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={12}>
              <Card title="Thẻ học vs Câu hỏi" style={{ borderRadius: '12px' }}>
                {renderDonutChart([
                  { name: 'Thẻ học', value: overviewStats.totalFlashcardSets },
                  { name: 'Câu hỏi', value: overviewStats.totalQuizSets }
                ], COLORS.flashcard)}
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card title="Lần học vs Lần làm bài" style={{ borderRadius: '12px' }}>
                {renderDonutChart([
                  { name: 'Lần học thẻ', value: overviewStats.totalFlashcardAttempts },
                  { name: 'Lần làm bài', value: overviewStats.totalQuizAttempts }
                ], COLORS.quiz)}
              </Card>
            </Col>
          </Row>
        </div>
      )}

      {/* Content Statistics */}
      {contentStats && !isDataEmpty(contentStats) && (
        <div>
          <Title level={3} style={{ marginBottom: '16px', color: '#262626' }}>
            📚 Thống kê nội dung
          </Title>
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={12}>
              <Card title="📖 Thẻ học" style={{ borderRadius: '12px' }}>
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <div style={{ textAlign: 'center', padding: '16px' }}>
                      <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#722ed1' }}>
                        {contentStats.totalFlashcardSets?.toLocaleString()}
                      </div>
                      <div style={{ color: '#8c8c8c' }}>Tổng bộ thẻ</div>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div style={{ textAlign: 'center', padding: '16px' }}>
                      <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}>
                        {contentStats.newFlashcardSetsLast7Days?.toLocaleString()}
                      </div>
                      <div style={{ color: '#8c8c8c' }}>Mới tuần này</div>
                    </div>
                  </Col>
                </Row>
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card title="📝 Câu hỏi" style={{ borderRadius: '12px' }}>
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <div style={{ textAlign: 'center', padding: '16px' }}>
                      <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f5222d' }}>
                        {contentStats.totalQuizSets?.toLocaleString()}
                      </div>
                      <div style={{ color: '#8c8c8c' }}>Tổng bộ câu hỏi</div>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div style={{ textAlign: 'center', padding: '16px' }}>
                      <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}>
                        {contentStats.newQuizSetsLast7Days?.toLocaleString()}
                      </div>
                      <div style={{ color: '#8c8c8c' }}>Mới tuần này</div>
                    </div>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
          
          {/* Growth Chart */}
          <Row style={{ marginTop: '24px' }}>
            <Col span={24}>
              <Card title="📈 Tăng trưởng tuần này vs Tổng" style={{ borderRadius: '12px' }}>
                {renderBarChart([
                  { 
                    name: 'Thẻ học', 
                    total: contentStats.totalFlashcardSets, 
                    thisWeek: contentStats.newFlashcardSetsLast7Days 
                  },
                  { 
                    name: 'Câu hỏi', 
                    total: contentStats.totalQuizSets, 
                    thisWeek: contentStats.newQuizSetsLast7Days 
                  }
                ])}
              </Card>
            </Col>
          </Row>
        </div>
      )}
    </div>
  );
};

export default Statistics;
