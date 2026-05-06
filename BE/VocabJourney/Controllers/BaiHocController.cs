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

        [HttpGet]
        public IActionResult GetAll()
        {
            try { return Ok(_repo.GetAllBaiHocAdmin()); }
            catch (System.Exception ex) { return StatusCode(500, ex.Message); }
        }

        [HttpPost]
        public IActionResult Create([FromBody] BaiHoc bh)
        {
            if (_repo.AddBaiHoc(bh)) return Ok(new { success = true, message = "Thêm bài học thành công" });
            return BadRequest(new { success = false, message = "Lỗi khi thêm bài học" });
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] BaiHoc bh)
        {
            bh.MaBaiHoc = id;
            if (_repo.UpdateBaiHoc(bh)) return Ok(new { success = true, message = "Cập nhật bài học thành công" });
            return BadRequest(new { success = false, message = "Lỗi khi cập nhật bài học" });
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            if (_repo.DeleteBaiHoc(id)) return Ok(new { success = true, message = "Xóa bài học thành công" });
            return BadRequest(new { success = false, message = "Lỗi khi xóa bài học" });
        }
    }
}
