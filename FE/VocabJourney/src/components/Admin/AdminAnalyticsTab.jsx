import React from 'react';
import { Row, Col } from 'antd';
import { 
  StockOutlined, 
  TeamOutlined, 
  ReadOutlined,
  BarChartOutlined
} from '@ant-design/icons';
import './AdminAnalyticsTab.css';

const AdminAnalyticsTab = () => {
  return (
    <div className="admin-analytics-tab">
      <div className="analytics-header">
        <h2 className="analytics-title">Phân Tích Nền Tảng</h2>
      </div>

      <Row gutter={[24, 24]} className="analytics-stats-row">
        {/* Card 1 */}
        <Col xs={24} md={8}>
          <div className="analytics-card card-cyan">
            <div className="analytics-icon-wrapper text-cyan">
              <StockOutlined />
            </div>
            <div className="analytics-value">+24%</div>
            <div className="analytics-desc">Tăng Trưởng Người Dùng (Hàng Tháng)</div>
          </div>
        </Col>

        {/* Card 2 */}
        <Col xs={24} md={8}>
          <div className="analytics-card card-purple">
            <div className="analytics-icon-wrapper text-purple">
              <TeamOutlined />
            </div>
            <div className="analytics-value">892</div>
            <div className="analytics-desc">Người Dùng Hoạt Động Hôm Nay</div>
          </div>
        </Col>

        {/* Card 3 */}
        <Col xs={24} md={8}>
          <div className="analytics-card card-green">
            <div className="analytics-icon-wrapper text-green">
              <ReadOutlined />
            </div>
            <div className="analytics-value">12.5K</div>
            <div className="analytics-desc">Từ Đã Học Hôm Nay</div>
          </div>
        </Col>
      </Row>

      {/* Placeholder Block */}
      <div className="analytics-placeholder">
        <div className="placeholder-icon">
          <BarChartOutlined />
        </div>
        <h3 className="placeholder-title">Phân Tích Chi Tiết Sắp Ra Mắt</h3>
        <p className="placeholder-desc">
          Các tính năng phân tích và báo cáo nâng cao đang được phát triển
        </p>
      </div>
    </div>
  );
};

export default AdminAnalyticsTab;
