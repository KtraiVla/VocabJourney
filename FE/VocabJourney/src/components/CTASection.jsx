import { Zap } from "lucide-react";
import "./CTASection.css";
import { Link } from "react-router-dom";

export default function CTASection() {
  return (
    <>
      <div className="cta-section">
        <div className="container">
          <div className="cta-content">
            <div className="cta-icon-wrapper">
              <Zap className="cta-icon" />
            </div>
            <h2 className="cta-title">Sẵn Sàng Bắt Đầu Hành Trình Từ Vựng?</h2>
            <p className="cta-desc">
              Tham gia cùng hàng ngàn học viên đang cải thiện từ vựng tiếng Anh
              mỗi ngày. Bắt đầu học miễn phí ngay hôm nay!
            </p>
            <button>
              <Link className="cta-button" to="./dangky">
                Bắt Đầu Miễn Phí
              </Link>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
