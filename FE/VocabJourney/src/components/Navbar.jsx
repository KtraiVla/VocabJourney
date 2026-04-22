import React from "react";
import { BookOpen } from "lucide-react";
import "./Navbar.css";
function Navbar() {
  return (
    <>
      <nav className="navbar">
        <div className="container nav-container">
          {/* logo bên trái */}
          <div className="logo-section">
            <div className="logo-icon">
              <BookOpen size={24} color="white"></BookOpen>
            </div>
            <span className="logo-text">VocabJourney</span>
          </div>
          {/* cta bên phải */}
          <div className="nav-actions">
            <button className="btn-login">Đăng nhập</button>
            <button className="btn-get-started">Bắt đầu</button>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
