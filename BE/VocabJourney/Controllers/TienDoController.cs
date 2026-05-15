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
            var result = _repo.LuuTienDoTuVung(request.MaNguoiDung, request.MaTuVung, request.DaHoc);
            if (result.Success)
            {
                return Ok(new { 
                    success = true, 
                    message = "Lưu tiến độ thành công",
                    leveledUp = result.LeveledUp,
                    newLevel = result.NewLevel
                });
            }
            return BadRequest(new { success = false, message = "Lưu tiến độ thất bại" });
        }

        [HttpPost("hoan-thanh-bai-hoc")]
        public IActionResult LuuTienDoBaiHoc([FromBody] TienDoBaiHocRequest request)
        {
            var result = _repo.LuuTienDoBaiHoc(request.MaNguoiDung, request.MaBaiHoc);
            if (result.Success) return Ok(new { 
                success = true, 
                message = "Hoàn thành bài học",
                leveledUp = result.LeveledUp,
                newLevel = result.NewLevel
            });
            return BadRequest(new { success = false, message = "Lưu thất bại" });
        }

        [HttpPost("luu-ket-qua-quiz")]
        public IActionResult LuuKetQuaQuiz([FromBody] KetQuaQuizRequest request)
        {
            var result = _repo.LuuKetQuaKiemTra(request.MaNguoiDung, request.MaBaiKiemTra, request.SoCauDung, request.TongCauHoi);
            if (result.Success) return Ok(new { 
                success = true, 
                message = "Lưu kết quả Quiz thành công",
                leveledUp = result.LeveledUp,
                newLevel = result.NewLevel
            });
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

        [HttpGet("danh-sach-on-tap/{maNguoiDung}")]
        public IActionResult GetDanhSachOnTap(int maNguoiDung)
        {
            var data = _repo.GetDanhSachTuCanOnTap(maNguoiDung);
            return Ok(new { success = true, data = data });
        }
    }

    public class TienDoTuVungRequest
    {
        public int MaNguoiDung { get; set; }
        public int MaTuVung { get; set; }
        public bool DaHoc { get; set; }
    }

    public class TienDoBaiHocRequest
    {
        public int MaNguoiDung { get; set; }
        public int MaBaiHoc { get; set; }
    }

    public class KetQuaQuizRequest
    {
        public int MaNguoiDung { get; set; }
        public int MaBaiKiemTra { get; set; }
        public int SoCauDung { get; set; }
        public int TongCauHoi { get; set; }
    }
}
