using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using VocabJourney.Models;
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

        [HttpGet("nguoidung/{maNguoiDung}")]
        public IActionResult GetThongKe(int maNguoiDung)
        {
            try
            {
                var thongKe = _repo.GetThongKe(maNguoiDung);
                if (thongKe == null)
                {
                    // Trả về mặc định nếu chưa có thống kê
                    return Ok(new ThongKeNguoiDung
                    {
                        MaNguoiDung = maNguoiDung,
                        ChuoiNgayHoc = 0,
                        DiemKinhNghiem = 0,
                        CapDo = 1
                    });
                }
                return Ok(thongKe);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi hệ thống: " + ex.Message });
            }
        }
    }
}
