import React, { useState } from "react";
import bgDangNhap from "../../assets/images/bg.jpg";
import { Mail, Lock, BookOpen, Library, Trophy, Flame } from "lucide-react";
import "./DangNhap.css";
import { Link, useNavigate } from "react-router-dom";

function DangNhap() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [matkhau, setMatKhau] = useState("");

  const thayDoiEmail = (e) => {setEmail(e.target.value)}; 
  const thayDoiMK = (e) => {setMatKhau(e.target.value)}

  async function handleLogin(e) {
    e.preventDefault();
    // kiểm tra email và mật khẩu
    if(email === ""){
      alert("Bạn chưa nhập email!");
      return;
    }
    if(matkhau === ""){
      alert("Bạn chưa nhập mật khẩu")
    }
    if(email.includes("@") === false){
      alert("Email sai định dạng, phải có ý tự '@'!");
    }
    if(matkhau.length < 6){
      alert("Mật khẩu phải có ít nhất 6 ký tự!")
    }

    const response = await fetch("https://localhost:7251/api/Auth/login", {
      method: "POST", 
      headers: {
        "Content-Type": "application/json"
      }, 
      body: JSON.strongify({
        username: email,
        password: matkhau,
      }),
    });

    if(response.ok){
      alert("Bạn đã đăng nhập thành công!"); 
      navigate("/homeuser");
    }
    else{
      alert("Sai tài khoản hoặc mật khẩu!")
    }
  }

  return (
    <div className="login-page">
      {/* Left side - Form */}
      <div className="login-left">
        <div className="login-left-container">
          <Link to="/" className="auth-logo">
            <div className="logo-icon-auth">
              <BookOpen size={28} color="white" />
            </div>
            <span className="logo-text-auth">VocabJourney</span>
          </Link>

          <div className="auth-header">
            <h2>Chào Mừng Trở Lại!</h2>
            <p>Tiếp tục hành trình học từ vựng của bạn</p>
          </div>

          <form className="auth-form">
            <div className="form-group">
              <label>Địa Chỉ Email</label>
              <div className="input-wrapper">
                <Mail className="input-icon" size={20} />
                <input
                 type="email" 
                 placeholder="alex@example.com" 
                 value = {email} 
                 onChange={thayDoiEmail}/>
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
                onChange={thayDoiMK} />
              </div>
            </div>

            <div className="auth-options">
              <div className="auth-checkbox-container">
                <input type="checkbox" id="remember" />
                <label htmlFor="remember">Ghi nhớ đăng nhập</label>
              </div>
              <Link
                to="/forgot-password"
                title="Quên mật khẩu?"
                className="forgot-link"
              >
                Quên mật khẩu?
              </Link>
            </div>

            <button type="submit" className="auth-submit-btn" onClick = {handleLogin}>
              Đăng Nhập
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Chưa có tài khoản? <Link to="/dangky">Đăng ký miễn phí</Link>
            </p>
          </div>

          <div className="auth-divider">
            <span>Hoặc tiếp tục với</span>
          </div>

          <div className="auth-social">
            <button className="social-btn">
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
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

      {/* Right side - Info & Illustration */}
      <div className="login-right">
        <div className="login-right-content">
          <h1 className="login-right-title">Tiếp Tục Hành Trình Học Tập</h1>
          <p className="login-right-desc">
            Tiếp tục từ nơi bạn đã dừng lại và phát triển kỹ năng từ vựng của
            bạn.
          </p>

          <div className="login-features">
            <div className="login-feature-item">
              <div className="login-feature-icon color-cyan">
                <Library size={24} />
              </div>
              <div className="login-feature-info">
                <h3>Theo Dõi Tiến Độ</h3>
                <p>Giám sát hành trình học tập của bạn</p>
              </div>
            </div>

            <div className="login-feature-item">
              <div className="login-feature-icon color-orange">
                <Trophy size={24} />
              </div>
              <div className="login-feature-info">
                <h3>Đạt Thành Tích</h3>
                <p>Mở khóa huy hiệu và phần thưởng</p>
              </div>
            </div>

            <div className="login-feature-item">
              <div className="login-feature-icon color-red">
                <Flame size={24} />
              </div>
              <div className="login-feature-info">
                <h3>Duy Trì Chuỗi Ngày</h3>
                <p>Xây dựng thói quen học tập nhất quán</p>
              </div>
            </div>
          </div>

          <div className="login-illustration">
            <img
              src={bgDangNhap}
              alt="Student studying"
              className="login-img"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DangNhap;
