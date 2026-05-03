import React, { useState } from 'react';
import { Table, Input, Button, Tag, Space, Tooltip, Modal, Form, Select, message } from 'antd';
import { 
  SearchOutlined, 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined 
} from '@ant-design/icons';
import './AdminLessonTab.css';

const AdminLessonTab = () => {
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
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
      console.log('Lưu bài học:', values);
      message.success(editingRecord ? 'Cập nhật bài học thành công!' : 'Thêm bài học thành công!');
      setIsModalVisible(false);
    }).catch((info) => {
      console.log('Lỗi validate:', info);
    });
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  // Dữ liệu giả lập (Mock data) cho bảng bài học
  const dataSource = [
    {
      key: '1',
      name: 'Từ vựng Sân bay',
      topic: 'Du Lịch & Khám Phá',
      wordsCount: 15,
      status: 'active',
    },
    {
      key: '2',
      name: 'Giao tiếp Khách sạn',
      topic: 'Du Lịch & Khám Phá',
      wordsCount: 20,
      status: 'active',
    },
    {
      key: '3',
      name: 'Phỏng vấn xin việc',
      topic: 'Tiếng Anh Thương Mại',
      wordsCount: 25,
      status: 'hidden',
    },
    {
      key: '4',
      name: 'Gọi món ăn',
      topic: 'Ẩm Thực & Nhà Hàng',
      wordsCount: 12,
      status: 'active',
    },
    {
      key: '5',
      name: 'Thiết bị máy tính',
      topic: 'Công Nghệ',
      wordsCount: 18,
      status: 'active',
    },
  ];

  const columns = [
    {
      title: 'TÊN BÀI HỌC',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <span className="lesson-name">{text}</span>,
    },
    {
      title: 'CHỦ ĐỀ',
      dataIndex: 'topic',
      key: 'topic',
      render: (topic) => (
        <Tag color="blue" className="topic-tag">
          {topic}
        </Tag>
      ),
    },
    {
      title: 'SỐ TỪ VỰNG',
      dataIndex: 'wordsCount',
      key: 'wordsCount',
      render: (count) => <span className="words-count">{count} từ</span>,
    },
    {
      title: 'TRẠNG THÁI',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag 
          color={status === 'active' ? '#dcfce7' : '#f1f5f9'} 
          style={{ color: status === 'active' ? '#16a34a' : '#64748b', border: 'none', borderRadius: '12px', padding: '2px 10px', fontWeight: 600 }}
        >
          {status === 'active' ? 'Hoạt động' : 'Đang ẩn'}
        </Tag>
      ),
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
          <Tooltip title="Xóa">
            <Button 
              type="text" 
              danger 
              icon={<DeleteOutlined />} 
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="admin-lesson-tab">
      <div className="tab-header">
        <h2 className="tab-title">Quản Lý Bài Học</h2>
        <Button type="primary" icon={<PlusOutlined />} className="add-btn" onClick={showAddModal}>
          Thêm Bài Học
        </Button>
      </div>

      <div className="search-container">
        <Input
          placeholder="Tìm kiếm bài học..."
          prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
          className="search-input"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      <Table 
        columns={columns} 
        dataSource={dataSource} 
        pagination={{ pageSize: 5 }} 
        className="custom-table"
        rowClassName="custom-table-row"
      />

      <Modal
        title={editingRecord ? "Sửa Bài Học" : "Thêm Bài Học Mới"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Tên bài học" rules={[{ required: true, message: 'Vui lòng nhập tên bài học!' }]}>
            <Input placeholder="Nhập tên bài học" />
          </Form.Item>
          <Form.Item name="topic" label="Thuộc chủ đề" rules={[{ required: true, message: 'Vui lòng chọn chủ đề!' }]}>
            <Select placeholder="Chọn chủ đề">
              <Select.Option value="Du Lịch & Khám Phá">Du Lịch & Khám Phá</Select.Option>
              <Select.Option value="Tiếng Anh Thương Mại">Tiếng Anh Thương Mại</Select.Option>
              <Select.Option value="Ẩm Thực & Nhà Hàng">Ẩm Thực & Nhà Hàng</Select.Option>
              <Select.Option value="Giao Tiếp Hàng Ngày">Giao Tiếp Hàng Ngày</Select.Option>
              <Select.Option value="Công Nghệ">Công Nghệ</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="status" label="Trạng thái" initialValue="active">
            <Select>
              <Select.Option value="active">Hoạt động</Select.Option>
              <Select.Option value="hidden">Đang ẩn</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminLessonTab;
