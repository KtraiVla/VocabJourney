import React from 'react';
import { Button, Row, Col } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import './AdminGamificationTab.css';

const AdminGamificationTab = () => {
  const badgeData = [
    {
      id: 1,
      title: 'Bước Đầu Tiên',
      description: 'Hoàn thành bài học đầu tiên',
      icon: '🎯'
    },
    {
      id: 2,
      title: 'Chiến Binh 7 Ngày',
      description: 'Duy trì chuỗi ngày học 7 ngày',
      icon: '🔥'
    },
    {
      id: 3,
      title: 'Bậc Thầy Từ Vựng',
      description: 'Học 100 từ vựng',
      icon: '📚'
    },
    {
      id: 4,
      title: 'Nhà Vô Địch Quiz',
      description: 'Đạt 100% trong 10 bài kiểm tra',
      icon: '🏆'
    },
    {
      id: 5,
      title: 'Bậc Thầy 30 Ngày',
      description: 'Duy trì chuỗi ngày học 30 ngày',
      icon: '⭐'
    },
    {
      id: 6,
      title: 'Học Viên Siêu Đẳng',
      description: 'Học 500 từ vựng',
      icon: '💎'
    }
  ];

  return (
    <div className="admin-gamification-tab">
      <div className="gamification-header">
        <h2 className="gamification-title">Quản Lý Trò Chơi Hóa</h2>
      </div>

      <Row gutter={[24, 24]}>
        {badgeData.map((badge) => (
          <Col xs={24} md={12} lg={8} key={badge.id}>
            <div className="badge-card">
              <div className="badge-icon-display">
                {badge.icon}
              </div>
              
              <div className="badge-info">
                <h3 className="badge-name">{badge.title}</h3>
                <p className="badge-desc">{badge.description}</p>
              </div>
              
              <div className="badge-actions">
                <Button type="default" icon={<EditOutlined />} className="badge-action-btn edit">
                  Sửa
                </Button>
                <Button type="default" danger icon={<DeleteOutlined />} className="badge-action-btn delete">
                </Button>
              </div>
            </div>
          </Col>
        ))}
      </Row>
      
      <div className="gamification-footer" style={{ marginTop: '24px' }}>
         <Button type="primary" icon={<PlusOutlined />} className="add-badge-btn">
          Thêm Huy Hiệu Mới
        </Button>
      </div>
    </div>
  );
};

export default AdminGamificationTab;
