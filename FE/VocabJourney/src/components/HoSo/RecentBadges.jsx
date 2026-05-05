import React, { useState, useEffect } from 'react';
import BadgeItem from './BadgeItem';
import './RecentBadges.css';
import badgeService from '../../services/badgeService';

const RecentBadges = () => {
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const maNguoiDung = localStorage.getItem("maNguoiDung");
        if (maNguoiDung) {
          const response = await badgeService.getUserBadges(maNguoiDung);
          if (response && response.data) {
            // Lấy 3 huy hiệu mới nhất
            const formattedBadges = response.data.slice(0, 3).map(b => ({
              id: b.maHuyHieu,
              title: b.tenHuyHieu,
              desc: b.moTa,
              date: b.ngayDatDuoc ? new Date(b.ngayDatDuoc).toLocaleDateString('vi-VN') : 'Đã đạt được',
              bgColor: '#fffbeb'
            }));
            setBadges(formattedBadges);
          }
        }
      } catch (error) {
        console.error("Lỗi khi tải huy hiệu gần đây:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBadges();
  }, []);

  if (loading) return <div className="loading-badges">Đang tải...</div>;

  return (
    <div className="recent-badges-card">
      <h2 className="section-title">Huy hiệu gần đây</h2>
      <div className="badges-list">
        {badges.length > 0 ? (
          badges.map(badge => (
            <BadgeItem key={badge.id} {...badge} />
          ))
        ) : (
          <p className="no-data">Bạn chưa đạt được huy hiệu nào.</p>
        )}
      </div>
    </div>
  );
};

export default RecentBadges;
