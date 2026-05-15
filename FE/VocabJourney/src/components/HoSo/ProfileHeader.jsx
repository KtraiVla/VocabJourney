import React, { useState, useEffect } from "react";
import { Mail, Calendar, Zap, Edit2, LogOut } from "lucide-react";
import "./ProfileHeader.css";
import authService from "../../services/authService";
import statsService from "../../services/statsService";
import { X, Check } from "lucide-react";

export default function ProfileHeader() {
  const [userInfo, setUserInfo] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({ username: "", email: "" });
  const [isSaving, setIsSaving] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/dangnhap";
  };

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
            setEditForm({ 
              username: userRes.data.username || "", 
              email: userRes.data.email || "" 
            });
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

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const maNguoiDung = localStorage.getItem("maNguoiDung");
      const response = await authService.updateProfile(
        maNguoiDung, 
        editForm.username, 
        editForm.email,
        editForm.hinhAnh
      );
      
      if (response && response.status === 200) {
        setUserInfo({ 
          ...userInfo, 
          username: editForm.username, 
          email: editForm.email
        });
        localStorage.setItem("tenNguoiDung", editForm.username);
        setIsEditModalOpen(false);
        alert("Cập nhật hồ sơ thành công!");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật hồ sơ:", error);
      alert(error.response?.data?.message || "Cập nhật thất bại, vui lòng thử lại.");
    } finally {
      setIsSaving(false);
    }
  };

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
          <button className="profile-avatar-edit" onClick={() => setIsEditModalOpen(true)}>
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
        <button className="profile-edit-btn" onClick={() => setIsEditModalOpen(true)}>
          <Edit2 size={16} />
          Chỉnh sửa hồ sơ
        </button>
        <button className="profile-logout-btn" onClick={handleLogout}>
          <LogOut size={16} />
          Đăng xuất
        </button>
      </div>

      {/* MODAL CHỈNH SỬA HỒ SƠ */}
      {isEditModalOpen && (
        <div className="modal-overlay">
          <div className="edit-profile-modal">
            <div className="modal-header">
              <h3>Chỉnh Sửa Hồ Sơ</h3>
              <button className="close-btn" onClick={() => setIsEditModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label>Tên hiển thị</label>
                <input 
                  type="text" 
                  value={editForm.username}
                  onChange={(e) => setEditForm({...editForm, username: e.target.value})}
                  placeholder="Nhập tên mới..."
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input 
                  type="email" 
                  value={editForm.email}
                  onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                  placeholder="Nhập email mới..."
                />
              </div>
              <p className="modal-note">Lưu ý: Tên hiển thị sẽ được dùng để đăng nhập.</p>
            </div>

            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setIsEditModalOpen(false)}>Hủy</button>
              <button 
                className="save-btn" 
                onClick={handleSaveProfile}
                disabled={isSaving}
              >
                {isSaving ? "Đang lưu..." : (
                  <>
                    <Check size={18} /> Lưu thay đổi
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
