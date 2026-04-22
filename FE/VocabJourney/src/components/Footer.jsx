import React from "react";
import { BookOpen } from "lucide-react";
import "./Footer.css";

function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-left">
          <div className="logo-section">
            <div className="logo-icon">
              <BookOpen size={24} color="white" />
            </div>
            <span className="logo-text">VocabJourney</span>
          </div>
        </div>
        
        <div className="footer-right">
          <p className="copyright">
            © {currentYear} VocabJourney. Bảo lưu mọi quyền.
          </p>
          <p className="tagline">
            Làm cho việc học từ vựng trở nên vui vẻ và hiệu quả
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
