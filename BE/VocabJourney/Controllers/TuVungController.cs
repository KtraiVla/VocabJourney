using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using VocabJourney.Models;
using VocabJourney.Repositories;

namespace VocabJourney.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TuVungController : ControllerBase
    {
        private readonly TuVungRepository _repo;

        public TuVungController(IConfiguration configuration)
        {
            // Đọc chuỗi kết nối từ appsettings.json và truyền vào Repo
            string connectionString = configuration.GetConnectionString("DefaultConnection");
            _repo = new TuVungRepository(connectionString);
        }

        [HttpGet("baihoc/{maBaiHoc}")]
        public IActionResult GetByBaiHoc(int maBaiHoc)
        {
            try
            {
                List<TuVung> danhSach = _repo.GetTuVungByBaiHoc(maBaiHoc);
                return Ok(new { success = true, data = danhSach });
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Lỗi hệ thống: " + ex.Message });
            }
        }
    }
}
