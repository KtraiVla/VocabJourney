using System;
using System.Collections.Generic;

namespace VocabJourney.Models
{
    public class BaiKiemTra
    {
        public int MaBaiKiemTra { get; set; }
        public int MaBaiHoc { get; set; }
        public string TieuDe { get; set; } = string.Empty;
        public int? ThoiGianLamBai { get; set; }
        public List<CauHoi> DanhSachCauHoi { get; set; } = new List<CauHoi>();
    }
}
