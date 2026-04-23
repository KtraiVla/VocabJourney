import React, { useState } from "react";
import {
  User,
  Mail,
  Lock,
  BookOpen,
  Target,
  Brain,
  Sparkles,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import "./DangKy.css";
import bgDangKy from "../../assets/images/hoctienganh.jpg";
import authService from "../../services/authService";

export default function DangKy() {
  const navigate = useNavigate();
  // Sử dụng state để quản lý trạng thái: họ tên, email, mk
  const [hoten, setHoTen] = useState("");
  const [email, setEmail] = useState("");
  const [matkhau, setMatKhau] = useState("");

  function thayDoiHoTen(e) {
    setHoTen(e.target.value);
  }
  function thayDoiEmail(e) {
    setEmail(e.target.value);
  }
  function thayDoiMatKhau(e) {
    setMatKhau(e.target.value);
  }

  async function handleDangKy(e) {
    e.preventDefault();
    // Kiểm tra các trường nhập vào
    if (!hoten || !email || !matkhau) {
      alert("Vui lòng điền đủ thông tin vào các trường!");
      return;
    }
    if (!email.includes("@")) {
      alert("Email sai định dạng, phải có ý tự '@'!");
      return;
    }
    if (matkhau.length < 6) {
      alert("Mật khẩu phải có ít nhất 6 ký tự!");
      return;
    }
    if (!document.getElementById("terms").checked) {
      alert("Bạn phải đồng ý với Điều khoản dịch vụ mới được đăng ký!");
      return;
    }

    try {
      const response = await authService.register(hoten, email, matkhau);
      alert(
        response.data.message || "Tuyệt vời! Đăng ký tài khoản thành công!",
      );
      navigate("/dangnhap");
    } catch {
      alert("Đăng ký thất bại! Có thể tên hoặc email đã có người sử dụng!");
    }
  }

  return (
    <div className="register-page">
      {/* Left side - Info & Illustration */}
      <div className="register-left">
        <div className="register-left-content">
          <h1 className="register-left-title">
            Bắt Đầu Hành Trình Từ Vựng Hôm Nay
          </h1>
          <p className="register-left-desc">
            Tham gia cùng hàng ngàn người học đang làm chủ từ vựng tiếng Anh với
            nền tảng sáng tạo của chúng tôi.
          </p>

          <div className="register-features">
            <div className="register-feature-item">
              <div className="register-feature-icon">
                <Target size={24} color="#ff4d4d" />
              </div>
              <div className="register-feature-info">
                <h3>Học Tập Cá Nhân Hóa</h3>
                <p>Bài học thích ứng được thiết kế riêng cho bạn</p>
              </div>
            </div>

            <div className="register-feature-item">
              <div className="register-feature-icon">
                <Brain size={24} color="#a855f7" />
              </div>
              <div className="register-feature-info">
                <h3>Lặp Lại Có Khoảng Cách Thông Minh</h3>
                <p>Học hiệu quả với khoa học</p>
              </div>
            </div>

            <div className="register-feature-item">
              <div className="register-feature-icon">
                <Sparkles size={24} color="#f97316" />
              </div>
              <div className="register-feature-info">
                <h3>Trải Nghiệm Trò Chơi Hóa</h3>
                <p>Làm cho việc học trở nên thú vị và hấp dẫn</p>
              </div>
            </div>
          </div>

          <div className="register-illustration">
            <img src={bgDangKy} alt="Students studying" className="auth-img" />
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="register-right">
        <div className="register-right-container">
          <div className="auth-logo">
            <div className="logo-icon-auth">
              <BookOpen size={28} color="white" />
            </div>
            <span className="logo-text-auth">VocabJourney</span>
          </div>

          <div className="auth-header">
            <h2>Tạo Tài Khoản Của Bạn</h2>
            <p>Bắt đầu học từ vựng miễn phí</p>
          </div>

          <form className="auth-form">
            <div className="form-group">
              <label>Họ và Tên</label>
              <div className="input-wrapper">
                <User className="input-icon" size={20} />
                <input
                  type="text"
                  placeholder="Nguyễn Văn A"
                  value={hoten}
                  onChange={thayDoiHoTen}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Địa Chỉ Email</label>
              <div className="input-wrapper">
                <Mail className="input-icon" size={20} />
                <input
                  type="email"
                  placeholder="nguyenvana@example.com"
                  value={email}
                  onChange={thayDoiEmail}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Mật Khẩu</label>
              <div className="input-wrapper">
                <Lock className="input-icon" size={20} />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={matkhau}
                  onChange={thayDoiMatKhau}
                />
              </div>
              <span className="input-hint">Phải có ít nhất 6 ký tự</span>
            </div>

            <div className="auth-checkbox-container">
              <input type="checkbox" id="terms" required />
              <label htmlFor="terms">
                Tôi đồng ý với Điều Khoản Dịch Vụ và Chính Sách Bảo Mật
              </label>
            </div>

            <button
              type="submit"
              className="auth-submit-btn"
              onClick={handleDangKy}
            >
              Tạo Tài Khoản
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Đã có tài khoản? <Link to="/dangnhap">Đăng nhập</Link>
            </p>
          </div>

          <div className="auth-divider">
            <span>Hoặc đăng ký với</span>
          </div>

          <div className="auth-social">
            <button className="social-btn">
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                size={20}
              />
              <span>Google</span>
            </button>
            <button className="social-btn">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                <path d="M9 18c-4.51 2-4.51-2-7-2"></path>
              </svg>
              <span>GitHub</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
