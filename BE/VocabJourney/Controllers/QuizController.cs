using Microsoft.AspNetCore.Mvc;
using VocabJourney.Repositories;
using Microsoft.Extensions.Configuration;
using System;

namespace VocabJourney.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuizController : ControllerBase
    {
        private readonly QuizRepository _repo;

        public QuizController(IConfiguration configuration)
        {
            string connectionString = configuration.GetConnectionString("DefaultConnection");
            _repo = new QuizRepository(connectionString);
        }

        [HttpGet("bai-hoc/{maBaiHoc}")]
        public IActionResult GetQuizByBaiHoc(int maBaiHoc)
        {
            try
            {
                var quiz = _repo.GetQuizByBaiHoc(maBaiHoc);
                if (quiz == null) 
                {
                    return Ok(new { success = false, message = "Không tìm thấy bài Quiz cho bài học này" });
                }
                
                return Ok(new { success = true, data = quiz });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }
        [HttpGet]
        public IActionResult GetAll()
        {
            try { return Ok(_repo.GetAllQuizzesAdmin()); }
            catch (Exception ex) { return StatusCode(500, ex.Message); }
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            if (_repo.HasCompletedResults(id))
                return BadRequest(new { success = false, message = "Không thể xóa bài kiểm tra này vì đã có người dùng làm bài. Việc xóa sẽ mất lịch sử kết quả của họ." });

            if (_repo.DeleteQuiz(id)) return Ok(new { success = true, message = "Xóa bài Quiz thành công" });
            return BadRequest(new { success = false, message = "Lỗi khi xóa bài Quiz" });
        }
    }
}
