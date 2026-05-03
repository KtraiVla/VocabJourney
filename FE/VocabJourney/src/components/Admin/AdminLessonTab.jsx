import React, { useState } from 'react';
import { Table, Input, Button, Tag, Space, Tooltip } from 'antd';
import { 
  SearchOutlined, 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined 
} from '@ant-design/icons';
import './AdminLessonTab.css';

const AdminLessonTab = () => {
  const [searchText, setSearchText] = useState('');

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
        <Button type="primary" icon={<PlusOutlined />} className="add-btn">
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
    </div>
  );
};

export default AdminLessonTab;
