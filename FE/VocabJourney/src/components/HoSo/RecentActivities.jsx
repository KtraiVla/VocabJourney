import React, { useState, useEffect } from 'react';
import { CheckSquare, Trophy, Book, Target, Zap } from 'lucide-react';
import ActivityItem from './ActivityItem';
import './RecentActivities.css';
import statsService from '../../services/statsService';

const RecentActivities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const maNguoiDung = localStorage.getItem("maNguoiDung");
        if (maNguoiDung) {
          const response = await statsService.getRecentActivities(maNguoiDung);
          if (response && response.data && response.data.success) {
            const formattedActivities = response.data.data.map((act, index) => {
              // Ánh xạ Icon và Màu sắc dựa trên loại hoạt động
              let config = { icon: Book, color: '#3b82f6', bgColor: '#dbeafe' };
              
              if (act.type === 'VOCAB') {
                config = { icon: CheckSquare, color: '#22c55e', bgColor: '#dcfce7' };
              } else if (act.type === 'QUIZ') {
                config = { icon: Target, color: '#ec4899', bgColor: '#fce7f3' };
              } else if (act.type === 'BADGE') {
                config = { icon: Trophy, color: '#eab308', bgColor: '#fef9c3' };
              }

              return {
                id: index,
                title: act.title,
                time: formatRelativeTime(act.time),
                ...config
              };
            });
            setActivities(formattedActivities);
          }
        }
      } catch (error) {
        console.error("Lỗi khi tải hoạt động gần đây:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, []);

  const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'Vừa xong';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} phút trước`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
    return `${Math.floor(diffInSeconds / 86400)} ngày trước`;
  };

  if (loading) return <div className="loading-activities">Đang tải hoạt động...</div>;

  return (
    <div className="recent-activities-card">
      <h2 className="section-title">Hoạt động gần đây</h2>
      <div className="activities-list">
        {activities.length > 0 ? (
          activities.map(activity => (
            <ActivityItem key={activity.id} {...activity} />
          ))
        ) : (
          <p className="no-data">Chưa có hoạt động nào gần đây.</p>
        )}
      </div>
    </div>
  );
};

export default RecentActivities;
