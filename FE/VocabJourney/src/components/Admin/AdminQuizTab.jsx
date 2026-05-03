import React, { useState } from 'react';
import { Table, Input, Button, Tag, Space, Tooltip } from 'antd';
import { 
  SearchOutlined, 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined 
} from '@ant-design/icons';
import './AdminQuizTab.css';

const AdminQuizTab = () => {
  const [searchText, setSearchText] = useState('');

  // Dữ liệu giả lập (Mock data) cho bảng quiz
  const dataSource = [
    {
      key: '1',
      name: 'Quiz Bài 1 - Sân bay',
      lesson: 'Từ vựng Sân bay',
      questionsCount: 10,
      timeLimit: '15 phút',
      status: 'active',
    },
    {
      key: '2',
      name: 'Kiểm tra Khách sạn',
      lesson: 'Giao tiếp Khách sạn',
      questionsCount: 15,
      timeLimit: '20 phút',
      status: 'active',
    },
    {
      key: '3',
      name: 'Test Phỏng vấn',
      lesson: 'Phỏng vấn xin việc',
      questionsCount: 20,
      timeLimit: '30 phút',
      status: 'draft',
    },
  ];

  const columns = [
    {
      title: 'TÊN BÀI QUIZ',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <span className="quiz-name">{text}</span>,
    },
    {
      title: 'BÀI HỌC LIÊN QUAN',
      dataIndex: 'lesson',
      key: 'lesson',
      render: (lesson) => (
        <Tag color="purple" className="lesson-tag">
          {lesson}
        </Tag>
      ),
    },
    {
      title: 'SỐ CÂU HỎI',
      dataIndex: 'questionsCount',
      key: 'questionsCount',
      render: (count) => <span className="questions-count">{count} câu</span>,
    },
    {
      title: 'THỜI GIAN',
      dataIndex: 'timeLimit',
      key: 'timeLimit',
    },
    {
      title: 'TRẠNG THÁI',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag 
          color={status === 'active' ? '#dcfce7' : '#fef08a'} 
          style={{ color: status === 'active' ? '#16a34a' : '#ca8a04', border: 'none', borderRadius: '12px', padding: '2px 10px', fontWeight: 600 }}
        >
          {status === 'active' ? 'Hoạt động' : 'Bản nháp'}
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
    <div className="admin-quiz-tab">
      <div className="tab-header">
        <h2 className="tab-title">Quản Lý Bài Quiz</h2>
        <Button type="primary" icon={<PlusOutlined />} className="add-btn">
          Thêm Bài Quiz
        </Button>
      </div>

      <div className="search-container">
        <Input
          placeholder="Tìm kiếm quiz..."
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

export default AdminQuizTab;
