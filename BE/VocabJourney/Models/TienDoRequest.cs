namespace VocabJourney.Models
{
    public class TienDoRequest
    {
        public int MaNguoiDung { get; set; }
        public int MaTuVung { get; set; }

        // true: Người dùng bấm "Đã thuộc" | false: Bấm "Chưa thuộc"
        public bool DaHoc { get; set; }
    }
}
