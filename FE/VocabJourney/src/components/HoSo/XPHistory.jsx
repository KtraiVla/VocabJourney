import React, { useState, useEffect } from 'react';
import { Zap, ArrowUpRight } from 'lucide-react';
import './XPHistory.css';
import statsService from '../../services/statsService';

const XPHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchXPHistory = async () => {
      try {
        const maNguoiDung = localStorage.getItem("maNguoiDung");
        if (maNguoiDung) {
          const response = await statsService.getRecentActivities(maNguoiDung);
          if (response && response.data && response.data.success) {
            setHistory(response.data.data);
          }
        }
      } catch (error) {
        console.error("Lỗi khi tải lịch sử XP:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchXPHistory();
  }, []);

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')} - ${date.getDate()}/${date.getMonth() + 1}`;
  };

  if (loading) return <div className="loading-xp">Đang tải lịch sử XP...</div>;

  return (
    <div className="xp-history-card">
      <div className="xp-history-header">
        <h2 className="section-title">Lịch sử nhận XP</h2>
        <div className="xp-total-badge">
          <Zap size={14} fill="currentColor" />
          <span>Gần đây</span>
        </div>
      </div>
      
      <div className="xp-history-list">
        {history.length > 0 ? (
          history.map((item, index) => (
            <div key={index} className="xp-history-item">
              <div className="xp-item-left">
                <div className="xp-icon-circle">
                  <ArrowUpRight size={16} />
                </div>
                <div className="xp-item-info">
                  <p className="xp-item-title">{item.title}</p>
                  <p className="xp-item-time">{formatTime(item.time)}</p>
                </div>
              </div>
              <div className="xp-item-value">
                +{item.xp} XP
              </div>
            </div>
          ))
        ) : (
          <p className="no-data">Chưa có lịch sử nhận điểm.</p>
        )}
      </div>
    </div>
  );
};

export default XPHistory;
