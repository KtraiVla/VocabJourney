import React, { useState } from 'react';
import { Table, Input, Button, Tag, Space, Tooltip, Modal, Form, Select, message, Card, Row, Col } from 'antd';
import { 
  SearchOutlined, 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined,
  MinusCircleOutlined
} from '@ant-design/icons';
import './AdminQuizTab.css';

const AdminQuizTab = () => {
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
      console.log('Lưu quiz:', values);
      message.success(editingRecord ? 'Cập nhật bài quiz thành công!' : 'Thêm bài quiz thành công!');
      setIsModalVisible(false);
    }).catch((info) => {
      console.log('Lỗi validate:', info);
    });
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

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
    <div className="admin-quiz-tab">
      <div className="tab-header">
        <h2 className="tab-title">Quản Lý Bài Quiz</h2>
        <Button type="primary" icon={<PlusOutlined />} className="add-btn" onClick={showAddModal}>
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

      <Modal
        title={editingRecord ? "Sửa Bài Quiz" : "Thêm Bài Quiz Mới"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="Lưu"
        cancelText="Hủy"
        width={800}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Tên bài quiz" rules={[{ required: true, message: 'Vui lòng nhập tên quiz!' }]}>
            <Input placeholder="Nhập tên bài quiz" />
          </Form.Item>
          <Form.Item name="lesson" label="Bài học liên quan" rules={[{ required: true, message: 'Vui lòng chọn bài học!' }]}>
            <Select placeholder="Chọn bài học">
              <Select.Option value="Từ vựng Sân bay">Từ vựng Sân bay</Select.Option>
              <Select.Option value="Giao tiếp Khách sạn">Giao tiếp Khách sạn</Select.Option>
              <Select.Option value="Phỏng vấn xin việc">Phỏng vấn xin việc</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="timeLimit" label="Thời gian làm bài" rules={[{ required: true, message: 'Vui lòng nhập thời gian!' }]}>
            <Input placeholder="VD: 15 phút" />
          </Form.Item>
          <Form.Item name="status" label="Trạng thái" initialValue="active">
            <Select>
              <Select.Option value="active">Hoạt động</Select.Option>
              <Select.Option value="draft">Bản nháp</Select.Option>
            </Select>
          </Form.Item>

          <div className="quiz-questions-section" style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: '#1e293b' }}>Danh sách câu hỏi</h3>
            <Form.List name="questions">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Card size="small" key={key} style={{ marginBottom: 16, backgroundColor: '#f8fafc', borderColor: '#e2e8f0' }} 
                      extra={<MinusCircleOutlined onClick={() => remove(name)} style={{ color: '#ef4444', fontSize: '16px', cursor: 'pointer' }} />}
                    >
                      <Form.Item
                        {...restField}
                        name={[name, 'question']}
                        label={`Câu hỏi ${name + 1}`}
                        rules={[{ required: true, message: 'Vui lòng nhập câu hỏi!' }]}
                      >
                        <Input placeholder="VD: How do you say 'Xin chào' in English?" />
                      </Form.Item>

                      <Row gutter={16}>
                        <Col span={12}>
                          <Form.Item {...restField} name={[name, 'optionA']} label="Đáp án A" rules={[{ required: true, message: 'Nhập đáp án A' }]}>
                            <Input placeholder="Đáp án A" />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item {...restField} name={[name, 'optionB']} label="Đáp án B" rules={[{ required: true, message: 'Nhập đáp án B' }]}>
                            <Input placeholder="Đáp án B" />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item {...restField} name={[name, 'optionC']} label="Đáp án C" rules={[{ required: true, message: 'Nhập đáp án C' }]}>
                            <Input placeholder="Đáp án C" />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item {...restField} name={[name, 'optionD']} label="Đáp án D" rules={[{ required: true, message: 'Nhập đáp án D' }]}>
                            <Input placeholder="Đáp án D" />
                          </Form.Item>
                        </Col>
                      </Row>

                      <Form.Item
                        {...restField}
                        name={[name, 'correctAnswer']}
                        label="Đáp án đúng"
                        rules={[{ required: true, message: 'Vui lòng chọn đáp án đúng!' }]}
                      >
                        <Select placeholder="Chọn đáp án đúng (A, B, C, D)">
                          <Select.Option value="A">Đáp án A</Select.Option>
                          <Select.Option value="B">Đáp án B</Select.Option>
                          <Select.Option value="C">Đáp án C</Select.Option>
                          <Select.Option value="D">Đáp án D</Select.Option>
                        </Select>
                      </Form.Item>
                    </Card>
                  ))}
                  <Form.Item>
                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />} style={{ height: '40px', borderColor: '#0ea5e9', color: '#0ea5e9' }}>
                      Thêm câu hỏi mới
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminQuizTab;
