using System;

namespace VocabJourney.Models
{
    public class ThongKeNguoiDung
    {
        public int MaThongKe { get; set; }
        public int MaNguoiDung { get; set; }
        public int DiemKinhNghiem { get; set; }
        public int CapDo { get; set; }
        public int ChuoiNgayHoc { get; set; }
        public DateTime? NgayHocCuoi { get; set; }

        // Mới thêm cho hệ thống XP chuyên nghiệp
        public int XPHomNay { get; set; }
        public int SoTuOnHomNay { get; set; }
        public int SoTuHocHomNay { get; set; }
        public int SoQuizHomNay { get; set; }
        public int DailyChallengeStatus { get; set; }
        public DateTime? NgayCapNhatXP { get; set; }

        // Thuộc tính tính toán (không lưu DB)
        public int TongTuDaHoc { get; set; }
        public int TongTuDaGap { get; set; }
        public int TongQuizDaLam { get; set; }
    }
}
