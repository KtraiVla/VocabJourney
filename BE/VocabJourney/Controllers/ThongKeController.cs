using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using VocabJourney.Repositories;

namespace VocabJourney.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ThongKeController : ControllerBase
    {
        private readonly ThongKeRepository _repo;

        public ThongKeController(IConfiguration configuration)
        {
            string connectionString = configuration.GetConnectionString("DefaultConnection");
            _repo = new ThongKeRepository(connectionString);
        }

        [HttpGet("{maNguoiDung}")]
        public IActionResult GetThongKe(int maNguoiDung)
        {
            var stats = _repo.GetThongKe(maNguoiDung);
            if (stats == null) return NotFound(new { message = "Không tìm thấy thống kê" });

            // Tính toán XP cần thiết để lên cấp tiếp theo dựa trên Level hiện tại
            // Công thức: 120 + 80 * (Level ^ 1.5)
            int xpTarget = 120 + (int)(80 * Math.Pow(stats.CapDo, 1.5));

            // Trả về thêm thông tin XP Target để FE vẽ Progress Bar
            return Ok(new
            {
                maNguoiDung = stats.MaNguoiDung,
                diemKinhNghiem = stats.DiemKinhNghiem,
                capDo = stats.CapDo,
                chuoiNgayHoc = stats.ChuoiNgayHoc,
                ngayHocCuoi = stats.NgayHocCuoi,
                tongTuDaHoc = stats.TongTuDaHoc,
                tongTuDaGap = stats.TongTuDaGap,
                tongQuizDaLam = stats.TongQuizDaLam,
                xpTarget = xpTarget,
                xpProgress = Math.Round((double)stats.DiemKinhNghiem / xpTarget * 100, 1)
            });
        }
    }
}
