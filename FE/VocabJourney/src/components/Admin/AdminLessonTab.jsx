import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Tag, Space, Tooltip, Modal, Form, Select, message, Spin, Popconfirm, InputNumber } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import './AdminLessonTab.css';
import baihocService from '../../services/baihocService';
import topicService from '../../services/topicService';

const AdminLessonTab = () => {
  const [lessons, setLessons] = useState([]);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();

  const fetchData = async () => {
    try {
      setLoading(true);
      const [lessonRes, topicRes] = await Promise.all([
        baihocService.getAllLessons(),
        topicService.getAllTopics()
      ]);
      setLessons(lessonRes || []);
      setTopics(topicRes.data || []);
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu:', error);
      message.error('Không thể tải danh sách bài học');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const showAddModal = () => {
    setEditingRecord(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const showEditModal = (record) => {
    setEditingRecord(record);
    form.setFieldsValue({
      tieuDe: record.tieuDe,
      moTa: record.moTa,
      maChuDe: record.maChuDe,
      thuTu: record.thuTu
    });
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    form.validateFields().then(async (values) => {
      try {
        if (editingRecord) {
          await baihocService.updateLesson(editingRecord.maBaiHoc, values);
          message.success('Cập nhật bài học thành công!');
        } else {
          await baihocService.createLesson(values);
          message.success('Thêm bài học thành công!');
        }
        setIsModalVisible(false);
        fetchData();
      } catch (error) {
        message.error('Lưu thất bại');
      }
    });
  };

  const handleDelete = async (id) => {
    try {
      await baihocService.deleteLesson(id);
      message.success('Xóa bài học thành công!');
      fetchData();
    } catch (error) {
      message.error('Xóa thất bại');
    }
  };

  const filteredLessons = lessons.filter(l => 
    l.tieuDe?.toLowerCase().includes(searchText.toLowerCase()) ||
    l.tenChuDe?.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: 'TÊN BÀI HỌC',
      dataIndex: 'tieuDe',
      key: 'tieuDe',
      render: (text) => <span className="lesson-name">{text}</span>,
    },
    {
      title: 'CHỦ ĐỀ',
      dataIndex: 'tenChuDe',
      key: 'tenChuDe',
      render: (topic) => (
        <Tag color="blue" className="topic-tag">
          {topic}
        </Tag>
      ),
    },
    {
      title: 'SỐ TỪ VỰNG',
      dataIndex: 'soTuVung',
      key: 'soTuVung',
      render: (count) => <span className="words-count">{count} từ</span>,
    },
    {
      title: 'THỨ TỰ',
      dataIndex: 'thuTu',
      key: 'thuTu',
    },
    {
      title: 'HÀNH ĐỘNG',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Chỉnh sửa">
            <Button 
              type="text" 
              icon={<EditOutlined style={{ color: '#475569' }} />} 
              onClick={() => showEditModal(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Xóa bài học"
            description="Bạn có chắc chắn muốn xóa bài học này không?"
            onConfirm={() => handleDelete(record.maBaiHoc)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="admin-lesson-tab">
      <div className="tab-header">
        <h2 className="tab-title">Quản Lý Bài Học ({filteredLessons.length})</h2>
        <Button type="primary" icon={<PlusOutlined />} className="add-btn" onClick={showAddModal}>
          Thêm Bài Học
        </Button>
      </div>

      <div className="search-container">
        <Input
          placeholder="Tìm kiếm theo tên bài học hoặc chủ đề..."
          prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
          className="search-input"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /></div>
      ) : (
        <Table 
          columns={columns} 
          dataSource={filteredLessons} 
          rowKey="maBaiHoc"
          pagination={{ pageSize: 8 }} 
          className="custom-table"
        />
      )}

      <Modal
        title={editingRecord ? "Sửa Bài Học" : "Thêm Bài Học Mới"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        okText="Lưu"
        cancelText="Hủy"
        destroyOnHidden
      >
        <Form form={form} layout="vertical">
          <Form.Item name="tieuDe" label="Tên bài học" rules={[{ required: true, message: 'Vui lòng nhập tên bài học!' }]}>
            <Input placeholder="Nhập tên bài học" />
          </Form.Item>
          <Form.Item name="maChuDe" label="Thuộc chủ đề" rules={[{ required: true, message: 'Vui lòng chọn chủ đề!' }]}>
            <Select placeholder="Chọn chủ đề">
              {topics.map(t => (
                <Select.Option key={t.maChuDe} value={t.maChuDe}>{t.tenChuDe}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="moTa" label="Mô tả">
            <Input.TextArea placeholder="Mô tả ngắn gọn về bài học" rows={3} />
          </Form.Item>
          <Form.Item name="thuTu" label="Thứ tự hiển thị" initialValue={1}>
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminLessonTab;
