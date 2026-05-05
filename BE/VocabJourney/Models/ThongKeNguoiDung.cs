using System;

namespace VocabJourney.Models
{
    public class ThongKeNguoiDung
    {
        public int MaNguoiDung { get; set; }
        public int DiemKinhNghiem { get; set; }
        public int CapDo { get; set; }
        public int ChuoiNgayHoc { get; set; }
        public DateTime? NgayHocCuoi { get; set; }
        public int TongTuDaHoc { get; set; }
        public int TongQuizDaLam { get; set; }
    }
}
