import React from 'react';
import { Button, Row, Col, Modal, Form, Input, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import './AdminTopicTab.css';

const AdminTopicTab = () => {
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
      console.log('Lưu chủ đề:', values);
      message.success(editingRecord ? 'Cập nhật chủ đề thành công!' : 'Thêm chủ đề thành công!');
      setIsModalVisible(false);
    }).catch((info) => {
      console.log('Lỗi validate:', info);
    });
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const topicData = [
    {
      id: 1,
      title: 'Du Lịch & Khám Phá',
      description: 'Từ vựng thiết yếu cho các chuyến du lịch',
      lessons: 8,
      words: 96,
      imageUrl: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=500&h=200&fit=crop'
    },
    {
      id: 2,
      title: 'Tiếng Anh Thương Mại',
      description: 'Từ vựng chuyên nghiệp cho công việc',
      lessons: 12,
      words: 144,
      imageUrl: 'https://images.unsplash.com/photo-1664575602276-acd073f104c1?w=500&h=200&fit=crop'
    },
    {
      id: 3,
      title: 'Ẩm Thực & Nhà Hàng',
      description: 'Từ vựng về nhà hàng và nấu ăn',
      lessons: 6,
      words: 72,
      imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&h=200&fit=crop'
    },
    {
      id: 4,
      title: 'Giao Tiếp Hàng Ngày',
      description: 'Cụm từ thông dụng cho các tình huống hàng ngày',
      lessons: 10,
      words: 120,
      imageUrl: 'https://images.unsplash.com/photo-1515161318750-781d6122e367?w=500&h=200&fit=crop'
    },
    {
      id: 5,
      title: 'Công Nghệ',
      description: 'Từ vựng liên quan đến công nghệ hiện đại',
      lessons: 7,
      words: 84,
      imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&h=200&fit=crop'
    },
    {
      id: 6,
      title: 'Sức Khỏe & Thể Dục',
      description: 'Từ vựng về sức khỏe và thể chất',
      lessons: 5,
      words: 60,
      imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&h=200&fit=crop'
    }
  ];

  return (
    <div className="admin-topic-tab">
      <div className="topic-header">
        <h2 className="topic-title">Quản Lý Chủ Đề</h2>
        <Button type="primary" icon={<PlusOutlined />} className="add-topic-btn" onClick={showAddModal}>
          Thêm Chủ Đề
        </Button>
      </div>

      <Row gutter={[24, 24]}>
        {topicData.map((topic) => (
          <Col xs={24} md={12} key={topic.id}>
            <div className="topic-card">
              <div className="topic-image-wrapper">
                <img src={topic.imageUrl} alt={topic.title} className="topic-image" />
              </div>
              
              <div className="topic-info">
                <h3 className="topic-name">{topic.title}</h3>
                <p className="topic-desc">{topic.description}</p>
                
                <div className="topic-stats">
                  <span>{topic.lessons} bài học</span>
                  <span>{topic.words} từ</span>
                </div>
                
                <div className="topic-actions">
                  <Button type="default" icon={<EditOutlined />} className="action-btn-outline" onClick={() => showEditModal(topic)}>
                    Sửa
                  </Button>
                  <Button type="default" danger icon={<DeleteOutlined />} className="action-btn-outline">
                    Xóa
                  </Button>
                </div>
              </div>
            </div>
          </Col>
        ))}
      </Row>

      <Modal
        title={editingRecord ? "Sửa Chủ Đề" : "Thêm Chủ Đề Mới"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="Tên chủ đề" rules={[{ required: true, message: 'Vui lòng nhập tên chủ đề!' }]}>
            <Input placeholder="VD: Tiếng Anh Thương Mại" />
          </Form.Item>
          <Form.Item name="description" label="Mô tả" rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}>
            <Input.TextArea placeholder="Mô tả ngắn gọn về chủ đề này" rows={3} />
          </Form.Item>
          <Form.Item name="imageUrl" label="Đường dẫn ảnh bìa (URL)" rules={[{ required: true, message: 'Vui lòng cung cấp ảnh bìa!' }]}>
            <Input placeholder="Nhập URL hình ảnh" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminTopicTab;
