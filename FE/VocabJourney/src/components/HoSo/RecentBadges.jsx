import React from 'react';
import BadgeItem from './BadgeItem';
import './RecentBadges.css';

const RecentBadges = () => {
  const badges = [
    { id: 1, title: 'Bước Đầu Tiên', desc: 'Hoàn thành bài học đầu tiên', date: '16/12/2025', bgColor: '#fffbeb' },
    { id: 2, title: 'Chiến Binh 7 Ngày', desc: 'Duy trì chuỗi ngày học 7 ngày', date: '5/1/2026', bgColor: '#fffbeb' },
    { id: 3, title: 'Bậc Thầy Từ Vựng', desc: 'Học 100 từ vựng', date: '10/2/2026', bgColor: '#fffbeb' },
  ];

  return (
    <div className="recent-badges-card">
      <h2 className="section-title">Huy hiệu gần đây</h2>
      <div className="badges-list">
        {badges.map(badge => (
          <BadgeItem key={badge.id} {...badge} />
        ))}
      </div>
    </div>
  );
};

export default RecentBadges;
