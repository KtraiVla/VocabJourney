using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using VocabJourney.Repositories;

namespace VocabJourney.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HuyHieuController : ControllerBase
    {
        private readonly HuyHieuRepository _repo;

        public HuyHieuController(IConfiguration configuration)
        {
            string connectionString = configuration.GetConnectionString("DefaultConnection");
            _repo = new HuyHieuRepository(connectionString);
        }

        [HttpGet("nguoidung/{maNguoiDung}")]
        public IActionResult GetHuyHieu(int maNguoiDung)
        {
            try
            {
                var data = _repo.GetHuyHieuNguoiDung(maNguoiDung);
                return Ok(new { success = true, data = data });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        [HttpGet("nguoidung/{maNguoiDung}/all")]
        public IActionResult GetAllHuyHieuVoiTiendo(int maNguoiDung)
        {
            try
            {
                var data = _repo.GetHuyHieuVoiTiendo(maNguoiDung);
                return Ok(new { success = true, data = data });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }
        [HttpGet]
        public IActionResult GetAll()
        {
            try { return Ok(_repo.GetAllHuyHieu()); }
            catch (Exception ex) { return StatusCode(500, ex.Message); }
        }

        [HttpPost]
        public IActionResult Create([FromBody] HuyHieuRequest req)
        {
            if (_repo.AddHuyHieu(req.TenHuyHieu, req.MoTa, req.IconName, req.DieuKien))
                return Ok(new { success = true, message = "Thêm huy hiệu thành công" });
            return BadRequest(new { success = false, message = "Lỗi khi thêm" });
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] HuyHieuRequest req)
        {
            if (_repo.UpdateHuyHieu(id, req.TenHuyHieu, req.MoTa, req.IconName, req.DieuKien))
                return Ok(new { success = true, message = "Cập nhật thành công" });
            return BadRequest(new { success = false, message = "Lỗi khi cập nhật" });
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            if (_repo.HasOwners(id))
                return BadRequest(new { success = false, message = "Không thể xóa huy hiệu này vì đã có người dùng sở hữu. Xóa sẽ mất dữ liệu thưởng của họ." });

            if (_repo.DeleteHuyHieu(id)) return Ok(new { success = true, message = "Xóa thành công" });
            return BadRequest(new { success = false, message = "Lỗi khi xóa" });
        }
    }

    public class HuyHieuRequest {
        public string TenHuyHieu { get; set; }
        public string MoTa { get; set; }
        public string IconName { get; set; }
        public string DieuKien { get; set; }
    }
}
