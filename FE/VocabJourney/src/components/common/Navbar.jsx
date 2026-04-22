import React from "react";
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
import "./DashboardNavbar.css";

function DashboardNavbar() {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { path: "/dashboard", icon: <Home size={20} />, label: "Trang Chủ" },
    { path: "/dashboard/topics", icon: <Book size={20} />, label: "Chủ Đề" },
    {
      path: "/dashboard/rewards",
      icon: <Trophy size={20} />,
      label: "Phần Thưởng",
    },
    {
      path: "/dashboard/progress",
      icon: <BarChart3 size={20} />,
      label: "Tiến Độ",
    },
    { path: "/dashboard/profile", icon: <User size={20} />, label: "Hồ Sơ" },
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

        {/* Streak Indicator */}
        <div className="db-streak-pill">
          <div className="db-streak-icon">
            {/* <Flame size={20} fill="#f97316" color="#f97316"  */}
            🔥
          </div>
          <div className="db-streak-info">
            <span className="db-streak-count">12</span>
            <span className="db-streak-text">ngày liên tục</span>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default DashboardNavbar;
