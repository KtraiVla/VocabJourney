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

        public TienDoController(IConfiguration configuration)
        {
            string connectionString = configuration.GetConnectionString("DefaultConnection");
            _repo = new TienDoRepository(connectionString);
        }

        [HttpPost("luu-tu-vung")]
        public IActionResult LuuTienDoTuVung([FromBody] TienDoTuVungRequest request)
        {
            bool success = _repo.LuuTienDoTuVung(request.MaNguoiDung, request.MaTuVung, request.DaHoc);
            if (success)
            {
                // Sau khi lưu tiến độ từ vựng, tự động cập nhật streak
                var thongKeRepo = new ThongKeRepository(new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetConnectionString("DefaultConnection"));
                thongKeRepo.CapNhatStreak(request.MaNguoiDung);
                return Ok(new { success = true, message = "Lưu tiến độ thành công" });
            }
            return BadRequest(new { success = false, message = "Lưu tiến độ thất bại" });
        }

        [HttpPost("hoan-thanh-bai-hoc")]
        public IActionResult LuuTienDoBaiHoc([FromBody] TienDoBaiHocRequest request)
        {
            bool success = _repo.LuuTienDoBaiHoc(request.MaNguoiDung, request.MaBaiHoc);
            if (success) return Ok(new { success = true, message = "Hoàn thành bài học" });
            return BadRequest(new { success = false, message = "Lưu thất bại" });
        }

        [HttpPost("luu-ket-qua-quiz")]
        public IActionResult LuuKetQuaQuiz([FromBody] KetQuaQuizRequest request)
        {
            bool success = _repo.LuuKetQuaKiemTra(request.MaNguoiDung, request.SoCauDung, request.TongCauHoi);
            if (success) return Ok(new { success = true, message = "Lưu kết quả Quiz thành công" });
            return BadRequest(new { success = false, message = "Lưu kết quả Quiz thất bại" });
        }

        [HttpGet("bai-hoc-gan-nhat/{maNguoiDung}")]
        public IActionResult GetBaiHocGanNhat(int maNguoiDung)
        {
            try
            {
                var result = _repo.GetBaiHocGanNhat(maNguoiDung);
                if (result == null) return Ok(new { success = false, message = "Chưa có tiến độ" });

                return Ok(new { success = true, data = result });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        [HttpGet("so-tu-on-tap/{maNguoiDung}")]
        public IActionResult GetSoTuOnTap(int maNguoiDung)
        {
            int count = _repo.GetSoTuCanOnTap(maNguoiDung);
            return Ok(new { success = true, count = count });
        }
    }
}
