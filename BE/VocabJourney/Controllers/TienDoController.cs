using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using VocabJourney.Models;
using VocabJourney.Repositories;

namespace VocabJourney.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TienDoController : ControllerBase
    {
        private readonly TienDoRepository _repo;
        private readonly ThongKeRepository _thongKeRepo;

        public TienDoController(IConfiguration configuration)
        {
            string connectionString = configuration.GetConnectionString("DefaultConnection");
            _repo = new TienDoRepository(connectionString);
            _thongKeRepo = new ThongKeRepository(connectionString);
        }

        [HttpPost("luu-tu-vung")]
        public IActionResult LuuTuVung([FromBody] TienDoRequest request)
        {
            try
            {
                bool ketQua = _repo.LuuTienDoTuVung(request.MaNguoiDung, request.MaTuVung, request.DaHoc);

                if (ketQua)
                {
                    _thongKeRepo.CapNhatStreak(request.MaNguoiDung);
                    return Ok(new { success = true, message = "Đã lưu tiến độ!" });
                }
                return BadRequest(new { success = false, message = "Lưu thất bại." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Lỗi hệ thống: " + ex.Message });
            }
        }

        [HttpPost("luu-bai-hoc")]
        public IActionResult LuuBaiHoc([FromBody] TienDoRequest request)
        {
            try
            {
                bool ketQua = _repo.LuuTienDoBaiHoc(request.MaNguoiDung, request.MaBaiHoc);
                if (ketQua)
                {
                    _thongKeRepo.CapNhatStreak(request.MaNguoiDung);
                    return Ok(new { success = true, message = "Đã lưu tiến độ bài học!" });
                }
                return BadRequest(new { success = false, message = "Lưu thất bại." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Lỗi hệ thống: " + ex.Message });
            }
        }

        [HttpGet("bai-hoc-gan-nhat/{maNguoiDung}")]
        public IActionResult GetBaiHocGanNhat(int maNguoiDung)
        {
            try
            {
                var data = _repo.GetBaiHocGanNhat(maNguoiDung);
                return Ok(new { success = true, data = data });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        [HttpGet("so-tu-on-tap/{maNguoiDung}")]
        public IActionResult GetSoTuOnTap(int maNguoiDung)
        {
            try
            {
                var count = _repo.GetSoTuCanOnTap(maNguoiDung);
                return Ok(new { success = true, count = count });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }
    }
}
