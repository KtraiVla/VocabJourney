import './LearningSetting.css';

export default function LearningSetting() {
  return (
    <div className="learning-settings-card">
      <h2 className="section-title">Tùy chọn học tập</h2>
      <div className="settings-grid">
        <div className="setting-group">
          <label>Mục tiêu hàng ngày</label>
          <select defaultValue="20">
            <option value="10">10 từ mỗi ngày</option>
            <option value="20">20 từ mỗi ngày</option>
            <option value="30">30 từ mỗi ngày</option>
          </select>
        </div>
        <div className="setting-group">
          <label>Thời gian nhắc nhở</label>
          <select defaultValue="14:00">
            <option value="08:00">Sáng (8:00 AM)</option>
            <option value="14:00">Chiều (2:00 PM)</option>
            <option value="20:00">Tối (8:00 PM)</option>
          </select>
        </div>
        <div className="setting-group">
          <label>Mức độ khó</label>
          <select defaultValue="Trung cấp">
            <option value="Cơ bản">Cơ bản</option>
            <option value="Trung cấp">Trung cấp</option>
            <option value="Nâng cao">Nâng cao</option>
          </select>
        </div>
        <div className="setting-group">
          <label>Tần suất ôn tập</label>
          <select defaultValue="Mỗi 2 ngày">
            <option value="Mỗi ngày">Mỗi ngày</option>
            <option value="Mỗi 2 ngày">Mỗi 2 ngày</option>
            <option value="Mỗi tuần">Mỗi tuần</option>
          </select>
        </div>
      </div>
      <div className="settings-actions">
        <button className="save-settings-btn">Lưu tùy chọn</button>
      </div>
    </div>
  );
}
