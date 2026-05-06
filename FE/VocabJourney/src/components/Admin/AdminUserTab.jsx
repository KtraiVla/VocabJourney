import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Tag, Space, Tooltip, Modal, Form, Select, message, Spin } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import './AdminUserTab.css';
import authService from '../../services/authService';

const AdminUserTab = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await authService.getAllUsers();
      if (response && response.data) {
        setUsers(response.data);
      }
    } catch (error) {
      console.error('Lỗi khi tải người dùng:', error);
      message.error('Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleModalOk = () => {
    form.validateFields().then((values) => {
      console.log('Lưu người dùng:', values);
      message.info('Tính năng Thêm/Sửa người dùng từ Admin đang được phát triển');
      setIsModalVisible(false);
    });
  };

  const filteredUsers = users.filter(user => 
    user.username?.toLowerCase().includes(searchText.toLowerCase()) || 
    user.email?.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleDelete = (record) => {
    const currentUserId = localStorage.getItem('userId');
    
    if (record.id.toString() === currentUserId) {
      message.error('Bạn không thể tự xóa tài khoản của chính mình!');
      return;
    }

    Modal.confirm({
      title: 'Xác nhận xóa',
      content: `Bạn có chắc chắn muốn xóa người dùng "${record.username}"? Mọi dữ liệu học tập, tiến độ và huy hiệu của người dùng này sẽ bị xóa vĩnh viễn.`,
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await authService.deleteUser(record.id);
          message.success('Xóa người dùng thành công');
          fetchUsers(); // Tải lại danh sách
        } catch (error) {
          console.error('Lỗi khi xóa người dùng:', error);
          const errorMsg = error.response?.data?.message || 'Không thể xóa người dùng do ràng buộc dữ liệu hoặc lỗi hệ thống.';
          message.error(errorMsg);
        }
      },
    });
  };

  const columns = [
    {
      title: 'NGƯỜI DÙNG',
      key: 'user',
      render: (_, record) => (
        <div className="user-info-cell">
          <div className="user-name">{record.username}</div>
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
          Cấp {level}
        </Tag>
      ),
    },
    {
      title: 'XP',
      dataIndex: 'xp',
      key: 'xp',
      sorter: (a, b) => a.xp - b.xp,
    },
    {
      title: 'TỪ ĐÃ HỌC',
      dataIndex: 'wordsLearned',
      key: 'wordsLearned',
      sorter: (a, b) => a.wordsLearned - b.wordsLearned,
    },
    {
      title: 'TRẠNG THÁI',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag className="status-tag" color={status === 'active' ? "#dcfce7" : "#fee2e2"} style={{ color: status === 'active' ? '#16a34a' : '#dc2626', border: 'none' }}>
          {status === 'active' ? 'Hoạt động' : 'Đã khóa'}
        </Tag>
      ),
    },
    {
      title: 'VAI TRÒ',
      dataIndex: 'role',
      key: 'role',
      render: (role) => (
        <Tag color={role === 'admin' ? 'gold' : 'blue'}>
          {role.toUpperCase()}
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
              onClick={() => {
                setEditingRecord(record);
                form.setFieldsValue(record);
                setIsModalVisible(true);
              }}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Button 
              type="text" 
              danger 
              icon={<DeleteOutlined />} 
              onClick={() => handleDelete(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="admin-user-tab">
      <div className="tab-header">
        <h2 className="tab-title">Quản Lý Người Dùng ({filteredUsers.length})</h2>
        <Button type="primary" icon={<PlusOutlined />} className="add-user-btn" onClick={() => {
          setEditingRecord(null);
          form.resetFields();
          setIsModalVisible(true);
        }}>
          Thêm Người Dùng
        </Button>
      </div>

      <div className="search-container">
        <Input
          placeholder="Tìm kiếm theo tên hoặc email..."
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
          dataSource={filteredUsers} 
          rowKey="id"
          pagination={{ pageSize: 8 }} 
          className="custom-table"
        />
      )}

      <Modal
        title={editingRecord ? "Sửa Người Dùng" : "Thêm Người Dùng Mới"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="username" label="Tên đăng nhập" rules={[{ required: true }]}>
            <Input disabled={!!editingRecord} />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="role" label="Vai trò" initialValue="User">
            <Select>
              <Select.Option value="User">Người dùng</Select.Option>
              <Select.Option value="admin">Quản trị viên</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="status" label="Trạng thái" initialValue="active">
            <Select>
              <Select.Option value="active">Hoạt động</Select.Option>
              <Select.Option value="inactive">Khóa tài khoản</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminUserTab;
