import React, { useState, useEffect } from 'react';
import { Table, Button, Tag, Space, Tooltip, message, Spin, Popconfirm } from 'antd';
import { PlusOutlined, DeleteOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import './AdminQuizTab.css';
import quizService from '../../services/quizService';

const AdminQuizTab = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const data = await quizService.getAllQuizzes();
      setQuizzes(data || []);
    } catch (error) {
      console.error('Lỗi khi tải quiz:', error);
      message.error('Không thể tải danh sách quiz');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const handleDelete = async (id) => {
    try {
      await quizService.deleteQuiz(id);
      message.success('Xóa bài quiz thành công!');
      fetchQuizzes();
    } catch (error) {
      message.error('Xóa thất bại');
    }
  };

  const columns = [
    {
      title: 'TÊN BÀI QUIZ',
      dataIndex: 'tieuDe',
      key: 'tieuDe',
      render: (text) => <span className="quiz-name">{text}</span>,
    },
    {
      title: 'BÀI HỌC',
      dataIndex: 'tenBaiHoc',
      key: 'tenBaiHoc',
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: 'SỐ CÂU HỎI',
      dataIndex: 'soCauHoi',
      key: 'soCauHoi',
      render: (count) => <span className="questions-count">{count} câu hỏi</span>,
    },
    {
      title: 'HÀNH ĐỘNG',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Xóa">
            <Popconfirm
              title="Xóa bài Quiz"
              description="Bạn có chắc chắn muốn xóa bài kiểm tra này không? Mọi câu hỏi và đáp án liên quan sẽ bị xóa sạch."
              onConfirm={() => handleDelete(record.maBaiKiemTra)}
              okText="Xóa"
              cancelText="Hủy"
              okButtonProps={{ danger: true }}
            >
              <Button type="text" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="admin-quiz-tab">
      <div className="tab-header">
        <h2 className="tab-title">Quản Lý Bài Quiz ({quizzes.length})</h2>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          className="add-btn"
          onClick={() => message.info('Tính năng soạn thảo câu hỏi đang được phát triển')}
        >
          Thêm Bài Quiz
        </Button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /></div>
      ) : (
        <Table 
          columns={columns} 
          dataSource={quizzes} 
          rowKey="maBaiKiemTra"
          pagination={{ pageSize: 8 }} 
          className="custom-table"
        />
      )}
    </div>
  );
};

export default AdminQuizTab;
