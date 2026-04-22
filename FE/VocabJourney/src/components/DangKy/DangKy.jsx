import {
  User,
  Mail,
  Lock,
  BookOpen,
  Target,
  Brain,
  Sparkles,
  Github,
} from "lucide-react";
import "./DangKy.css";

import bgDangKy from "../../assets/images/hoctienganh.jpg"


export default function DangKy() {
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
                <input type="text" placeholder="Nguyễn Văn A" required />
              </div>
            </div>

            <div className="form-group">
              <label>Địa Chỉ Email</label>
              <div className="input-wrapper">
                <Mail className="input-icon" size={20} />
                <input
                  type="email"
                  placeholder="nguyenvana@example.com"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Mật Khẩu</label>
              <div className="input-wrapper">
                <Lock className="input-icon" size={20} />
                <input type="password" placeholder="••••••••" required />
              </div>
              <span className="input-hint">Phải có ít nhất 8 ký tự</span>
            </div>

            <div className="auth-checkbox-container">
              <input type="checkbox" id="terms" required />
              <label htmlFor="terms">
                Tôi đồng ý với <Link to="/terms">Điều Khoản Dịch Vụ</Link> và{" "}
                <Link to="/privacy">Chính Sách Bảo Mật</Link>
              </label>
            </div>

            <button type="submit" className="auth-submit-btn">
              Tạo Tài Khoản
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
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
              <Github size={20} />
              <span>GitHub</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
