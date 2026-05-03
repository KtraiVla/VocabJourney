import React from 'react';
import { Button, Row, Col, Modal, Form, Input, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import './AdminGamificationTab.css';

const AdminGamificationTab = () => {
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [editingRecord, setEditingRecord] = React.useState(null);
  const [form] = Form.useForm();

  const showAddModal = () => {
    setEditingRecord(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const showEditModal = (record) => {
    setEditingRecord(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    form.validateFields().then((values) => {
      console.log('Lưu huy hiệu:', values);
      message.success(editingRecord ? 'Cập nhật huy hiệu thành công!' : 'Thêm huy hiệu thành công!');
      setIsModalVisible(false);
    }).catch((info) => {
      console.log('Lỗi validate:', info);
    });
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

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
                <Button type="default" icon={<EditOutlined />} className="badge-action-btn edit" onClick={() => showEditModal(badge)}>
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
         <Button type="primary" icon={<PlusOutlined />} className="add-badge-btn" onClick={showAddModal}>
          Thêm Huy Hiệu Mới
        </Button>
      </div>

      <Modal
        title={editingRecord ? "Sửa Huy Hiệu" : "Thêm Huy Hiệu Mới"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="Tên huy hiệu" rules={[{ required: true, message: 'Vui lòng nhập tên huy hiệu!' }]}>
            <Input placeholder="VD: Bước Đầu Tiên" />
          </Form.Item>
          <Form.Item name="description" label="Mô tả" rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}>
            <Input.TextArea placeholder="Mô tả điều kiện đạt huy hiệu" rows={3} />
          </Form.Item>
          <Form.Item name="icon" label="Biểu tượng (Icon)" rules={[{ required: true, message: 'Vui lòng nhập biểu tượng!' }]}>
            <Input placeholder="Nhập một Emoji, VD: 🎯" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminGamificationTab;
