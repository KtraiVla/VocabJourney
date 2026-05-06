import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Tag, Space, Tooltip, Modal, Form, Select, message, Spin, Popconfirm, Avatar, Row, Col } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import './AdminVocabTab.css';
import vocabService from '../../services/vocabService';
import baihocService from '../../services/baihocService';

const AdminVocabTab = () => {
  const [vocabs, setVocabs] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();

  const fetchVocabs = async () => {
    try {
      setLoading(true);
      const data = await vocabService.getAllVocab();
      setVocabs(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Lỗi khi tải từ vựng:', error);
      message.error('Không thể tải danh sách từ vựng: ' + (error.response?.data || error.message));
    } finally {
      setLoading(false);
    }
  };

  const fetchLessons = async () => {
    try {
      const data = await baihocService.getAllLessons();
      setLessons(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Lỗi khi tải bài học:', error);
    }
  };

  useEffect(() => {
    fetchVocabs();
    fetchLessons();
  }, []);

  const showAddModal = () => {
    setEditingRecord(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const showEditModal = (record) => {
    setEditingRecord(record);
    form.setFieldsValue({
      tuTiengAnh: record.tuTiengAnh,
      nghiaTiengViet: record.nghiaTiengViet,
      phienAm: record.phienAm,
      maBaiHoc: record.maBaiHoc,
      doKho: record.doKho,
      dinhNghia: record.dinhNghia,
      viDu: record.viDu,
      anhMinhHoa: record.anhMinhHoa
    });
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    form.validateFields().then(async (values) => {
      try {
        if (editingRecord) {
          await vocabService.updateVocab(editingRecord.maTuVung, values);
          message.success('Cập nhật từ vựng thành công!');
        } else {
          await vocabService.createVocab(values);
          message.success('Thêm từ vựng thành công!');
        }
        setIsModalVisible(false);
        fetchVocabs();
      } catch (error) {
        message.error('Lưu thất bại: ' + (error.response?.data?.message || error.message));
      }
    });
  };

  const handleDelete = async (id) => {
    try {
      await vocabService.deleteVocab(id);
      message.success('Xóa từ vựng thành công!');
      fetchVocabs();
    } catch (error) {
      message.error('Xóa thất bại');
    }
  };

  const filteredVocabs = vocabs.filter(v =>
    v.tuTiengAnh?.toLowerCase().includes(searchText.toLowerCase()) ||
    v.nghiaTiengViet?.toLowerCase().includes(searchText.toLowerCase()) ||
    v.tenBaiHoc?.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: 'TỪ VỰNG',
      key: 'word',
      render: (_, record) => (
        <div className="vocab-word-cell">
          <Avatar
            shape="square"
            size={48}
            src={record.anhMinhHoa || 'https://via.placeholder.com/48?text=No'}
            className="vocab-avatar"
          />
          <div className="vocab-word-info">
            <div className="word-en">{record.tuTiengAnh}</div>
            <div className="word-vi">{record.nghiaTiengViet}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'PHIÊN ÂM',
      dataIndex: 'phienAm',
      key: 'phienAm',
      render: (text) => text ? <span className="phien-am">/{text}/</span> : <span style={{ color: '#ccc' }}>—</span>,
    },
    {
      title: 'BÀI HỌC',
      dataIndex: 'tenBaiHoc',
      key: 'tenBaiHoc',
      render: (text) => <Tag color="cyan">{text}</Tag>,
    },
    {
      title: 'ĐỘ KHÓ',
      dataIndex: 'doKho',
      key: 'doKho',
      render: (level) => {
        const map = { 1: { color: 'green', label: 'Dễ' }, 2: { color: 'orange', label: 'Trung bình' }, 3: { color: 'red', label: 'Khó' } };
        const item = map[level] || { color: 'default', label: 'Không rõ' };
        return <Tag color={item.color}>{item.label}</Tag>;
      },
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
            title="Xóa từ vựng"
            description="Bạn có chắc chắn muốn xóa từ này không?"
            onConfirm={() => handleDelete(record.maTuVung)}
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
    <div className="admin-vocab-tab">
      <div className="tab-header">
        <h2 className="tab-title">Quản Lý Từ Vựng ({filteredVocabs.length})</h2>
        <Button type="primary" icon={<PlusOutlined />} className="add-btn" onClick={showAddModal}>
          Thêm Từ Vựng
        </Button>
      </div>

      <div className="search-container">
        <Input
          placeholder="Tìm kiếm theo từ, nghĩa hoặc bài học..."
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
          dataSource={filteredVocabs}
          rowKey="maTuVung"
          pagination={{ pageSize: 8 }}
          className="custom-table"
        />
      )}

      <Modal
        title={editingRecord ? 'Sửa Từ Vựng' : 'Thêm Từ Vựng Mới'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={700}
        okText="Lưu"
        cancelText="Hủy"
        destroyOnHidden
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="tuTiengAnh" label="Từ tiếng Anh" rules={[{ required: true, message: 'Bắt buộc' }]}>
                <Input placeholder="VD: Hello" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="nghiaTiengViet" label="Nghĩa tiếng Việt" rules={[{ required: true, message: 'Bắt buộc' }]}>
                <Input placeholder="VD: Xin chào" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="phienAm" label="Phiên âm">
                <Input placeholder="VD: /həˈləʊ/" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="maBaiHoc" label="Thuộc bài học" rules={[{ required: true, message: 'Bắt buộc' }]}>
                <Select placeholder="Chọn bài học" showSearch optionFilterProp="children">
                  {lessons.map(l => (
                    <Select.Option key={l.maBaiHoc} value={l.maBaiHoc}>
                      {l.tieuDe} {l.tenChuDe ? `(${l.tenChuDe})` : ''}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="anhMinhHoa" label="URL Ảnh minh họa">
            <Input placeholder="Nhập URL hình ảnh" />
          </Form.Item>

          <Form.Item name="dinhNghia" label="Định nghĩa">
            <Input.TextArea rows={2} placeholder="Giải thích chi tiết về từ" />
          </Form.Item>

          <Form.Item name="viDu" label="Câu ví dụ">
            <Input.TextArea rows={2} placeholder="Ví dụ sử dụng từ trong câu" />
          </Form.Item>

          <Form.Item name="doKho" label="Độ khó" initialValue={1}>
            <Select>
              <Select.Option value={1}>Dễ</Select.Option>
              <Select.Option value={2}>Trung bình</Select.Option>
              <Select.Option value={3}>Khó</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminVocabTab;
