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
    }
}
