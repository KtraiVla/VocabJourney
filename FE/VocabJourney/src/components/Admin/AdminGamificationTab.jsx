import React, { useState, useEffect } from 'react';
import { Table, Button, Tag, Space, Tooltip, message, Spin, Popconfirm, Modal, Form, Input } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, TrophyOutlined } from '@ant-design/icons';
import './AdminGamificationTab.css';
import badgeService from '../../services/badgeService';

const AdminGamificationTab = () => {
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();

  const fetchBadges = async () => {
    try {
      setLoading(true);
      const response = await badgeService.getAllBadges();
      setBadges(response.data || []);
    } catch (error) {
      console.error('Lỗi khi tải huy hiệu:', error);
      message.error('Không thể tải danh sách huy hiệu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBadges();
  }, []);

  const handleModalOk = () => {
    form.validateFields().then(async (values) => {
      try {
        const payload = {
          tenHuyHieu: values.tenHuyHieu,
          moTa: values.moTa,
          iconName: values.iconName,
          dieuKien: values.dieuKien
        };

        if (editingRecord) {
          await badgeService.updateBadge(editingRecord.maHuyHieu, payload);
          message.success('Cập nhật huy hiệu thành công!');
        } else {
          await badgeService.createBadge(payload);
          message.success('Thêm huy hiệu mới thành công!');
        }
        setIsModalVisible(false);
        fetchBadges();
      } catch (error) {
        message.error('Lưu thất bại');
      }
    });
  };

  const handleDelete = async (id) => {
    try {
      await badgeService.deleteBadge(id);
      message.success('Xóa huy hiệu thành công!');
      fetchBadges();
    } catch (error) {
      const msg = error.response?.data?.message || 'Xóa thất bại, vui lòng thử lại.';
      message.error(msg);
    }
  };

  const columns = [
    {
      title: 'HUY HIỆU',
      key: 'badge',
      render: (_, record) => (
        <div className="badge-info-cell">
          <div className="badge-icon-preview">
             <TrophyOutlined style={{ fontSize: '24px', color: '#f59e0b' }} />
          </div>
          <div className="badge-text-info">
            <div className="badge-name">{record.tenHuyHieu}</div>
            <div className="badge-desc">{record.moTa}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'ICON NAME',
      dataIndex: 'iconName',
      key: 'iconName',
      render: (text) => <code className="icon-code">{text}</code>,
    },
    {
      title: 'ĐIỀU KIỆN',
      dataIndex: 'dieuKien',
      key: 'dieuKien',
      render: (text) => <Tag color="orange">{text}</Tag>,
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
          <Popconfirm
            title="Xóa huy hiệu"
            description="Bạn có chắc chắn muốn xóa huy hiệu này không?"
            onConfirm={() => handleDelete(record.maHuyHieu)}
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
    <div className="admin-gamification-tab">
      <div className="tab-header">
        <h2 className="tab-title">Quản Lý Huy Hiệu ({badges.length})</h2>
        <Button type="primary" icon={<PlusOutlined />} className="add-btn" onClick={() => {
          setEditingRecord(null);
          form.resetFields();
          setIsModalVisible(true);
        }}>
          Thêm Huy Hiệu
        </Button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /></div>
      ) : (
        <Table 
          columns={columns} 
          dataSource={badges} 
          rowKey="maHuyHieu"
          pagination={{ pageSize: 8 }} 
          className="custom-table"
        />
      )}

      <Modal
        title={editingRecord ? "Sửa Huy Hiệu" : "Thêm Huy Hiệu Mới"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        okText="Lưu"
        cancelText="Hủy"
        destroyOnHidden
      >
        <Form form={form} layout="vertical">
          <Form.Item name="tenHuyHieu" label="Tên huy hiệu" rules={[{ required: true }]}>
            <Input placeholder="VD: Nhà Chinh Phục" />
          </Form.Item>
          <Form.Item name="moTa" label="Mô tả" rules={[{ required: true }]}>
            <Input.TextArea placeholder="VD: Hoàn thành 10 bài học đầu tiên" rows={2} />
          </Form.Item>
          <Form.Item name="iconName" label="Mã Icon" rules={[{ required: true }]}>
            <Input placeholder="VD: trophy, star, medal..." />
          </Form.Item>
          <Form.Item name="dieuKien" label="Điều kiện (Logic)" rules={[{ required: true }]}>
            <Input placeholder="VD: lessons_completed >= 10" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminGamificationTab;
