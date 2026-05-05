import React, { useState, useEffect } from "react";
import {
  Home,
  Book,
  Trophy,
  BarChart3,
  User,
  Flame,
  BookOpen,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";
import statsService from "../../services/statsService";

function DashboardNavbar() {
  const location = useLocation();
  const currentPath = location.pathname;
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const maNguoiDung = localStorage.getItem("maNguoiDung");
        if (maNguoiDung) {
          const response = await statsService.getUserStats(maNguoiDung);
          if (response.data) {
            setStreak(response.data.chuoiNgayHoc);
          }
        }
      } catch (error) {
        console.error("Lỗi khi lấy streak:", error);
      }
    };

    fetchStats();
    
    // Lắng nghe sự kiện storage (nếu đăng nhập ở tab khác hoặc logout)
    window.addEventListener("storage", fetchStats);
    return () => window.removeEventListener("storage", fetchStats);
  }, []);

  const navItems = [
    { path: "/homeuser", icon: <Home size={20} />, label: "Trang Chủ" },
    { path: "/chude", icon: <Book size={20} />, label: "Chủ Đề" },
    {
      path: "/phanthuong",
      icon: <Trophy size={20} />,
      label: "Phần Thưởng",
    },
    {
      path: "/tiendo",
      icon: <BarChart3 size={20} />,
      label: "Tiến Độ",
    },
    { path: "/hoso", icon: <User size={20} />, label: "Hồ Sơ" },
  ];

  return (
    <nav className="dashboard-navbar">
      <div className="db-nav-container">
        {/* Logo */}
        <Link to="/dashboard" className="db-nav-logo">
          <div className="db-logo-icon">
            <BookOpen size={24} color="white" />
          </div>
          <span className="db-logo-text">VocabJourney</span>
        </Link>
 
        {/* Navigation Links */}
        <div className="db-nav-links">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`db-nav-item ${currentPath === item.path ? "active" : ""}`}
            >
              <span className="db-item-icon">{item.icon}</span>
              <span className="db-item-label">{item.label}</span>
            </Link>
          ))}
        </div>

        {/* chuỗi */}
        <div className="db-streak-pill">
          <div className="db-streak-icon">
             <Flame size={20} fill={streak > 0 ? "#f97316" : "#94a3b8"} color={streak > 0 ? "#f97316" : "#94a3b8"} />
          </div>
          <div className="db-streak-info">
            <span className="db-streak-count">{streak}</span>
            <span className="db-streak-text">ngày liên tục</span>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default DashboardNavbar;
