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
        [HttpGet]
        public IActionResult GetAll()
        {
            try { return Ok(_repo.GetAllTuVungAdmin()); }
            catch (System.Exception ex) { return StatusCode(500, ex.Message); }
        }

        [HttpPost]
        public IActionResult Create([FromBody] TuVung tu)
        {
            if (_repo.AddTuVung(tu)) return Ok(new { success = true, message = "Thêm từ vựng thành công" });
            return BadRequest(new { success = false, message = "Lỗi khi thêm từ vựng" });
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] TuVung tu)
        {
            tu.MaTuVung = id;
            if (_repo.UpdateTuVung(tu)) return Ok(new { success = true, message = "Cập nhật từ vựng thành công" });
            return BadRequest(new { success = false, message = "Lỗi khi cập nhật từ vựng" });
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            if (_repo.DeleteTuVung(id)) return Ok(new { success = true, message = "Xóa từ vựng thành công" });
            return BadRequest(new { success = false, message = "Lỗi khi xóa từ vựng" });
        }
    }
}
