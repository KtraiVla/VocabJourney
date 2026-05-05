using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using VocabJourney.Repositories;

namespace VocabJourney.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ThuThachController : ControllerBase
    {
        private readonly ThuThachRepository _repo;

        public ThuThachController(IConfiguration configuration)
        {
            string connectionString = configuration.GetConnectionString("DefaultConnection");
            _repo = new ThuThachRepository(connectionString);
        }

        [HttpGet("ngay/{maNguoiDung}")]
        public IActionResult GetThuThachNgay(int maNguoiDung)
        {
            try
            {
                var data = _repo.GetThuThachNgay(maNguoiDung);
                return Ok(new { success = true, data = data });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }
    }
}
