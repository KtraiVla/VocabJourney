using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using VocabJourney.Models;
using VocabJourney.Repositories;

namespace VocabJourney.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BaiHocController : ControllerBase
    {
        private readonly BaiHocRepository _repo;
        public BaiHocController(IConfiguration configuration)
        {
            string connectionString = configuration.GetConnectionString("DefaultConnection");
            _repo = new BaiHocRepository(connectionString);
        }
        [HttpGet("chude/{maChuDe}")]
        public IActionResult GetByChuDe(int maChuDe, [FromQuery] int? maNguoiDung = null)
        {
            try
            {
                List<BaiHoc> danhSach = _repo.GetDanhSachBaiHoc(maChuDe, maNguoiDung);
                return Ok(new { success = true, data = danhSach });
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Lỗi hệ thống: " + ex.Message });
            }
        }

    }
}
