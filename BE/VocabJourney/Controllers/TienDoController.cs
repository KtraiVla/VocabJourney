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
        public IActionResult LuuTuVung([FromBody] TienDoRequest request)
        {
            try
            {
                bool ketQua = _repo.LuuTienDoTuVung(request.MaNguoiDung, request.MaTuVung, request.DaHoc);

                if (ketQua)
                {
                    return Ok(new { success = true, message = "Đã lưu tiến độ!" });
                }
                return BadRequest(new { success = false, message = "Lưu thất bại." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Lỗi hệ thống: " + ex.Message });
            }
        }
    }
}
