import React, { useState } from 'react';
import { Table, Input, Button, Tag, Space, Tooltip, Avatar } from 'antd';
import { 
  SearchOutlined, 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined 
} from '@ant-design/icons';
import './AdminUserTab.css';

const AdminUserTab = () => {
  // Trạng thái (state) lưu trữ từ khóa tìm kiếm
  const [searchText, setSearchText] = useState('');

  // Dữ liệu giả lập (Mock data) cho bảng người dùng
  const dataSource = [
    {
      key: '1',
      name: 'Nguyễn Văn An',
      email: 'nguyenvanan@example.com',
      level: 'Cấp 8',
      xp: 2450,
      wordsLearned: 347,
      status: 'active',
    },
    {
      key: '2',
      name: 'Trần Thị Bình',
      email: 'tranthibinh@example.com',
      level: 'Cấp 12',
      xp: 4200,
      wordsLearned: 589,
      status: 'active',
    },
    {
      key: '3',
      name: 'Lê Minh Cường',
      email: 'leminhcuong@example.com',
      level: 'Cấp 5',
      xp: 1350,
      wordsLearned: 178,
      status: 'active',
    },
    {
      key: '4',
      name: 'Phạm Thu Dung',
      email: 'phamthudung@example.com',
      level: 'Cấp 15',
      xp: 6100,
      wordsLearned: 823,
      status: 'active',
    },
  ];

  // Định nghĩa các cột (Columns) cho bảng Ant Design
  const columns = [
    {
      title: 'NGƯỜI DÙNG',
      dataIndex: 'user', // Cột này sẽ gộp name và email lại
      key: 'user',
      render: (_, record) => (
        <div className="user-info-cell">
          <div className="user-name">{record.name}</div>
          <div className="user-email">{record.email}</div>
        </div>
      ),
    },
    {
      title: 'CẤP ĐỘ',
      dataIndex: 'level',
      key: 'level',
      render: (level) => (
        <Tag className="level-tag" color="#f3e8ff" style={{ color: '#9333ea', border: 'none' }}>
          {level}
        </Tag>
      ),
    },
    {
      title: 'XP',
      dataIndex: 'xp',
      key: 'xp',
    },
    {
      title: 'TỪ ĐÃ HỌC',
      dataIndex: 'wordsLearned',
      key: 'wordsLearned',
    },
    {
      title: 'TRẠNG THÁI',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag className="status-tag" color="#dcfce7" style={{ color: '#16a34a', border: 'none' }}>
          {status}
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
              onClick={() => console.log('Edit', record.key)}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Button 
              type="text" 
              danger 
              icon={<DeleteOutlined />} 
              onClick={() => console.log('Delete', record.key)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="admin-user-tab">
      
      {/* Header của Tab: Tiêu đề và Nút Thêm Mới */}
      <div className="tab-header">
        <h2 className="tab-title">Quản Lý Người Dùng</h2>
        <Button type="primary" icon={<PlusOutlined />} className="add-user-btn">
          Thêm Người Dùng
        </Button>
      </div>

      {/* Thanh Tìm Kiếm */}
      <div className="search-container">
        <Input
          placeholder="Tìm kiếm người dùng..."
          prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
          className="search-input"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      {/* Bảng Hiển Thị Dữ Liệu */}
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

export default AdminUserTab;
