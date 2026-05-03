import React from 'react';
import { Button, Card, Col, Row, Tabs } from 'antd';
import { 
  SettingOutlined, 
  TeamOutlined, 
  BookOutlined, 
  FileTextOutlined, 
  TrophyOutlined,
  BarChartOutlined,
  ReadOutlined,
  QuestionCircleOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import AdminUserTab from '../components/Admin/AdminUserTab';
import AdminVocabTab from '../components/Admin/AdminVocabTab';
import AdminTopicTab from '../components/Admin/AdminTopicTab';
import AdminLessonTab from '../components/Admin/AdminLessonTab';
import AdminQuizTab from '../components/Admin/AdminQuizTab';
import AdminGamificationTab from '../components/Admin/AdminGamificationTab';
import AdminAnalyticsTab from '../components/Admin/AdminAnalyticsTab';
import './AdminPage.css';

const { TabPane } = Tabs;

const AdminPage = () => {
  const navigate = useNavigate();

  // Dữ liệu cho các thẻ thống kê tổng quan (Top Cards)
  const statsCards = [
    {
      title: 'Tổng Người Dùng',
      value: '4',
      icon: <TeamOutlined className="admin-stat-icon" />,
      color: '#00a8cc' // Màu xanh lam đậm
    },
    {
      title: 'Chủ Đề Hoạt Động',
      value: '6',
      icon: <BookOutlined className="admin-stat-icon" />,
      color: '#a855f7' // Màu tím
    },
    {
      title: 'Từ Vựng',
      value: '6',
      icon: <FileTextOutlined className="admin-stat-icon" />,
      color: '#f97316' // Màu cam
    },
    {
      title: 'Thành Tích',
      value: '6',
      icon: <TrophyOutlined className="admin-stat-icon" />,
      color: '#10b981' // Màu xanh lá
    }
  ];

  return (
    <div className="admin-container">
      {/* Phần Header (Tiêu đề và Nút Quay Lại) */}
      <header className="admin-header">
        <div className="admin-header-left">
          <div className="admin-logo-icon">
            <SettingOutlined />
          </div>
          <div>
            <h1 className="admin-title">Bảng Điều Khiển Quản Trị</h1>
            <p className="admin-subtitle">Quản Lý VocabJourney</p>
          </div>
        </div>
        <Button 
          className="admin-back-btn" 
          onClick={() => navigate('/homeuser')}
        >
          Quay Lại Ứng Dụng
        </Button>
      </header>

      {/* Phần Nội Dung Chính */}
      <div className="admin-content">
        
        {/* Hàng chứa các thẻ thống kê */}
        <Row gutter={[24, 24]} className="admin-stats-row">
          {statsCards.map((stat, index) => (
            <Col xs={24} sm={12} lg={6} key={index}>
              <Card 
                className="admin-stat-card"
                style={{ backgroundColor: stat.color }}
                bordered={false}
              >
                <div className="admin-stat-content">
                  <div className="admin-stat-icon-wrapper">
                    {stat.icon}
                  </div>
                  <div className="admin-stat-value">{stat.value}</div>
                  <div className="admin-stat-title">{stat.title}</div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Phần Tabs (Chuyển đổi giữa các mục Quản lý) */}
        <div className="admin-tabs-container">
          <Tabs defaultActiveKey="1" centered size="large">
            
            {/* Tab: Người Dùng */}
            <TabPane 
              tab={<span><TeamOutlined /> Người Dùng</span>} 
              key="1"
            >
              <AdminUserTab />
            </TabPane>

            {/* Các Tab Khác (Đang để trống, có thể phát triển sau) */}
            <TabPane 
              tab={<span><BookOutlined /> Từ Vựng</span>} 
              key="2"
            >
              <AdminVocabTab />
            </TabPane>
            
            <TabPane 
              tab={<span><FileTextOutlined /> Chủ Đề</span>} 
              key="3"
            >
              <AdminTopicTab />
            </TabPane>

            <TabPane 
              tab={<span><ReadOutlined /> Bài Học</span>} 
              key="4"
            >
              <AdminLessonTab />
            </TabPane>

            <TabPane 
              tab={<span><QuestionCircleOutlined /> Bài Quiz</span>} 
              key="5"
            >
              <AdminQuizTab />
            </TabPane>

            <TabPane 
              tab={<span><TrophyOutlined /> Trò Chơi Hóa</span>} 
              key="6"
            >
              <AdminGamificationTab />
            </TabPane>

            <TabPane 
              tab={<span><BarChartOutlined /> Phân Tích</span>} 
              key="7"
            >
              <AdminAnalyticsTab />
            </TabPane>

          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
