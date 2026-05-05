import React, { useState, useEffect } from "react";
import { Mail, Calendar, Zap, Edit2 } from "lucide-react";
import "./ProfileHeader.css";
import authService from "../../services/authService";
import statsService from "../../services/statsService";

export default function ProfileHeader() {
  const [userInfo, setUserInfo] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const maNguoiDung = localStorage.getItem("maNguoiDung");
        const tenTuLocal = localStorage.getItem("tenNguoiDung");
        
        if (maNguoiDung) {
          // Khởi tạo thông tin cơ bản từ local trước để tránh hiện "Người dùng"
          setUserInfo({ username: tenTuLocal || "Người dùng", email: "..." });

          const [userRes, statsRes] = await Promise.all([
            authService.getUserInfo(maNguoiDung).catch(e => null),
            statsService.getUserStats(maNguoiDung).catch(e => null)
          ]);

          if (userRes && userRes.data) {
            setUserInfo(userRes.data);
          }
          if (statsRes && statsRes.data) {
            setUserStats(statsRes.data);
          }
        }
      } catch (error) {
        console.error("Lỗi khi tải thông tin hồ sơ:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString || dateString === "0001-01-01T00:00:00") return "Đang cập nhật...";
    const date = new Date(dateString);
    return `Tham gia ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  if (loading && !userInfo) return <div className="loading-header">Đang tải hồ sơ...</div>;

  return (
    <div className="profile-header-card">
      <div className="profile-header-left">
        <div className="profile-avatar-wrapper">
          <img
            src={`https://i.pravatar.cc/150?u=${userInfo?.username || 'user'}`}
            alt="Avatar"
            className="profile-avatar"
          />
          <button className="profile-avatar-edit" aria-label="Edit Avatar">
            <Edit2 size={14} />
          </button>
        </div>
        <div className="profile-info">
          <h1 className="profile-name">{userInfo?.username || "Người dùng"}</h1>
          <div className="profile-meta">
            <span className="meta-item">
              <Mail size={16} /> {userInfo?.email || "Đang tải..."}
            </span>
            <span className="meta-item">
              <Calendar size={16} /> {formatDate(userInfo?.joinDate)}
            </span>
          </div>
          <div className="profile-level-badge">
            <Zap size={16} className="level-icon" fill="currentColor" />
            <span>
              Cấp độ {userStats?.capDo || 1} <span className="level-separator">·</span> {userStats?.diemKinhNghiem || 0} XP
            </span>
          </div>
        </div>
      </div>
      <div className="profile-header-right">
        <button className="profile-edit-btn">
          <Edit2 size={16} />
          Chỉnh sửa hồ sơ
        </button>
        <div className="profile-header-placeholder"></div>
      </div>
    </div>
  );
}
