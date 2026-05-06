import React, { useState, useEffect } from 'react';
import { Button, Row, Col, Modal, Form, Input, message, Popconfirm, Spin } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import './AdminTopicTab.css';
import topicService from '../../services/topicService';

const AdminTopicTab = () => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();

  const fetchTopics = async () => {
    try {
      setLoading(true);
      const response = await topicService.getAllTopics();
      if (response && response.data) {
        setTopics(response.data);
      }
    } catch (error) {
      console.error('Lỗi khi tải chủ đề:', error);
      message.error('Không thể tải danh sách chủ đề');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  const showAddModal = () => {
    setEditingRecord(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const showEditModal = (record) => {
    setEditingRecord(record);
    form.setFieldsValue({
      title: record.tenChuDe,
      description: record.moTa,
      imageUrl: record.anhMinhHoa
    });
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    form.validateFields().then(async (values) => {
      try {
        const topicData = {
          tenChuDe: values.title,
          moTa: values.description,
          anhMinhHoa: values.imageUrl
        };

        if (editingRecord) {
          await topicService.updateTopic(editingRecord.maChuDe, topicData);
          message.success('Cập nhật chủ đề thành công!');
        } else {
          await topicService.createTopic(topicData);
          message.success('Thêm chủ đề mới thành công!');
        }
        setIsModalVisible(false);
        fetchTopics();
      } catch (error) {
        message.error('Lưu thất bại: ' + (error.response?.data?.message || error.message));
      }
    });
  };

  const handleDelete = async (id) => {
    try {
      await topicService.deleteTopic(id);
      message.success('Xóa chủ đề thành công!');
      fetchTopics();
    } catch (error) {
      const msg = error.response?.data?.message || 'Xóa thất bại, vui lòng thử lại.';
      message.error(msg);
    }
  };

  if (loading && topics.length === 0) {
    return <div className="admin-loading"><Spin size="large" description="Đang tải dữ liệu..." /></div>;
  }

  return (
    <div className="admin-topic-tab">
      <div className="topic-header">
        <h2 className="topic-title">Quản Lý Chủ Đề ({topics.length})</h2>
        <Button type="primary" icon={<PlusOutlined />} className="add-topic-btn" onClick={showAddModal}>
          Thêm Chủ Đề
        </Button>
      </div>

      <Row gutter={[24, 24]}>
        {topics.map((topic) => (
          <Col xs={24} md={12} lg={8} key={topic.maChuDe}>
            <div className="topic-card">
              <div className="topic-image-wrapper">
                <img 
                  src={topic.anhMinhHoa || 'https://via.placeholder.com/500x200?text=No+Image'} 
                  alt={topic.tenChuDe} 
                  className="topic-image" 
                />
              </div>
              
              <div className="topic-info">
                <h3 className="topic-name">{topic.tenChuDe}</h3>
                <p className="topic-desc">{topic.moTa}</p>
                
                <div className="topic-stats">
                  <span>{topic.soBaiHoc} bài học</span>
                  <span>{topic.soTuVung} từ vựng</span>
                </div>
                
                <div className="topic-actions">
                  <Button type="default" icon={<EditOutlined />} className="action-btn-outline" onClick={() => showEditModal(topic)}>
                    Sửa
                  </Button>
                  <Popconfirm
                    title="Xóa chủ đề"
                    description="Bạn có chắc chắn muốn xóa chủ đề này không? Các bài học liên quan sẽ bị ảnh hưởng."
                    onConfirm={() => handleDelete(topic.maChuDe)}
                    okText="Xóa"
                    cancelText="Hủy"
                    okButtonProps={{ danger: true }}
                  >
                    <Button type="default" danger icon={<DeleteOutlined />} className="action-btn-outline">
                      Xóa
                    </Button>
                  </Popconfirm>
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
        onCancel={() => setIsModalVisible(false)}
        okText="Lưu"
        cancelText="Hủy"
        destroyOnHidden
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
