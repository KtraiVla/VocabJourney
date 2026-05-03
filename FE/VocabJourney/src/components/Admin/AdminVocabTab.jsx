import React from 'react';
import { Button, Row, Col, Tag, Space, Typography, Modal, Form, Input, Select, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import './AdminVocabTab.css';

const { Text } = Typography;

const AdminVocabTab = () => {
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
      console.log('Lưu từ vựng:', values);
      message.success(editingRecord ? 'Cập nhật từ vựng thành công!' : 'Thêm từ vựng thành công!');
      setIsModalVisible(false);
    }).catch((info) => {
      console.log('Lỗi validate:', info);
    });
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  // Dữ liệu giả lập cho danh sách từ vựng
  const vocabData = [
    {
      id: 1,
      word: 'Luggage',
      pronunciation: '/ˈlʌɡɪdʒ/',
      meaning: 'Túi xách và vali mà bạn mang theo khi đi du lịch',
      difficulty: 'easy',
      imageUrl: 'https://images.unsplash.com/photo-1551522435-a13afa10f103?w=150&h=150&fit=crop'
    },
    {
      id: 2,
      word: 'Departure',
      pronunciation: '/dɪˈpɑːrtʃər/',
      meaning: 'Hành động rời khỏi một địa điểm',
      difficulty: 'medium',
      imageUrl: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=150&h=150&fit=crop'
    },
    {
      id: 3,
      word: 'Boarding Pass',
      pronunciation: '/ˈbɔːrdɪŋ pæs/',
      meaning: 'Tài liệu cho phép bạn lên máy bay',
      difficulty: 'easy',
      imageUrl: 'https://images.unsplash.com/photo-1544640808-32ca72ac7f37?w=150&h=150&fit=crop'
    },
    {
      id: 4,
      word: 'Immigration',
      pronunciation: '/ˌɪmɪˈɡreɪʃn/',
      meaning: 'Quá trình nhập cảnh vào một quốc gia',
      difficulty: 'hard',
      imageUrl: 'https://images.unsplash.com/photo-1569949381669-ecf31ae8e613?w=150&h=150&fit=crop'
    },
    {
      id: 5,
      word: 'Reservation',
      pronunciation: '/ˌrezərˈveɪʃn/',
      meaning: 'Sự sắp xếp để giữ chỗ cho bạn',
      difficulty: 'medium',
      imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=150&h=150&fit=crop'
    },
    {
      id: 6,
      word: 'Amenities',
      pronunciation: '/əˈmenətiz/',
      meaning: 'Các tiện nghi hoặc dịch vụ hữu ích, thoải mái',
      difficulty: 'hard',
      imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=150&h=150&fit=crop'
    }
  ];

  // Hàm để render nhãn độ khó với màu sắc tương ứng
  const renderDifficultyTag = (difficulty) => {
    switch (difficulty) {
      case 'easy':
        return <Tag color="#dcfce7" style={{ color: '#16a34a', border: 'none', borderRadius: '12px', padding: '2px 10px', fontWeight: 600 }}>easy</Tag>;
      case 'medium':
        return <Tag color="#fef08a" style={{ color: '#ca8a04', border: 'none', borderRadius: '12px', padding: '2px 10px', fontWeight: 600 }}>medium</Tag>;
      case 'hard':
        return <Tag color="#fee2e2" style={{ color: '#dc2626', border: 'none', borderRadius: '12px', padding: '2px 10px', fontWeight: 600 }}>hard</Tag>;
      default:
        return <Tag>{difficulty}</Tag>;
    }
  };

  return (
    <div className="admin-vocab-tab">
      {/* Header: Tiêu đề và Nút Thêm */}
      <div className="vocab-header">
        <h2 className="vocab-title">Quản Lý Từ Vựng</h2>
        <Button type="primary" icon={<PlusOutlined />} className="add-vocab-btn" onClick={showAddModal}>
          Thêm Từ
        </Button>
      </div>

      {/* Lưới danh sách các thẻ từ vựng */}
      <Row gutter={[24, 24]}>
        {vocabData.map((vocab) => (
          <Col xs={24} md={12} key={vocab.id}>
            <div className="vocab-card">
              {/* Ảnh minh họa bên trái */}
              <div className="vocab-image-wrapper">
                <img src={vocab.imageUrl} alt={vocab.word} className="vocab-image" />
              </div>
              
              {/* Nội dung thông tin bên phải */}
              <div className="vocab-info">
                <div className="vocab-info-top">
                  <span className="vocab-word">{vocab.word}</span>
                  {renderDifficultyTag(vocab.difficulty)}
                </div>
                
                <div className="vocab-pronunciation">
                  {vocab.pronunciation}
                </div>
                
                <div className="vocab-meaning">
                  {vocab.meaning}
                </div>
                
                {/* Các nút hành động */}
                <div className="vocab-actions">
                  <Button type="text" icon={<EditOutlined />} className="action-btn edit-btn" onClick={() => showEditModal(vocab)}>
                    Sửa
                  </Button>
                  <Button type="text" icon={<DeleteOutlined />} danger className="action-btn delete-btn">
                    Xóa
                  </Button>
                </div>
              </div>
            </div>
          </Col>
        ))}
      </Row>

      <Modal
        title={editingRecord ? "Sửa Từ Vựng" : "Thêm Từ Vựng Mới"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="word" label="Từ vựng" rules={[{ required: true, message: 'Vui lòng nhập từ vựng!' }]}>
            <Input placeholder="Nhập từ vựng tiếng Anh" />
          </Form.Item>
          <Form.Item name="pronunciation" label="Phiên âm" rules={[{ required: true, message: 'Vui lòng nhập phiên âm!' }]}>
            <Input placeholder="VD: /ˈlʌɡɪdʒ/" />
          </Form.Item>
          <Form.Item name="definition" label="Định nghĩa">
            <Input.TextArea placeholder="Nhập định nghĩa của từ" rows={2} />
          </Form.Item>
          <Form.Item name="meaning" label="Nghĩa tiếng Việt" rules={[{ required: true, message: 'Vui lòng nhập nghĩa tiếng Việt!' }]}>
            <Input.TextArea placeholder="Nhập ý nghĩa của từ" rows={2} />
          </Form.Item>
          <Form.Item name="example" label="Ví dụ minh họa">
            <Input.TextArea placeholder="Nhập một câu ví dụ sử dụng từ này" rows={2} />
          </Form.Item>
          <Form.Item name="difficulty" label="Độ khó" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="easy">Dễ (Easy)</Select.Option>
              <Select.Option value="medium">Trung bình (Medium)</Select.Option>
              <Select.Option value="hard">Khó (Hard)</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="imageUrl" label="Đường dẫn ảnh (URL)">
            <Input placeholder="Nhập URL hình ảnh minh họa" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminVocabTab;
