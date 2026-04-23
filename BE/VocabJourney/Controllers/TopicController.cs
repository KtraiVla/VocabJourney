using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using VocabJourney.Models;
using VocabJourney.Repositories;

namespace VocabJourney.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TopicController : ControllerBase
    {
        private readonly TopicRepository _topicRepo;

        // Gọi IConfiguration ra để đọc file appsettings.json
        public TopicsController(IConfiguration configuration)
        {
            string connString = configuration.GetConnectionString("DefaultConnection");

            _topicRepo = new TopicRepository(connString);
        }

        // GET: api/topics
        [HttpGet]
        public IActionResult GetTopics()
        {
            try
            {
                // Gọi repository lấy danh sách chủ đề (đã có AnhMinhHoa và NgayTao)
                List<Topic> topics = _topicRepo.GetAllTopics();

                if (topics == null || topics.Count == 0)
                {
                    return NotFound(new { message = "Hiện tại chưa có chủ đề nào!" });
                }

                // Trả về danh sách JSON cho Frontend
                return Ok(topics);
            }
            catch (Exception ex)
            {
                // Trả về lỗi 500 nếu có biến cố ở SQL hoặc Server
                return StatusCode(500, new { message = "Lỗi hệ thống: " + ex.Message });
            }
        }

    }
}
