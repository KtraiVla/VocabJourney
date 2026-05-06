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
        public TopicController(IConfiguration configuration)
        {
            string connString = configuration.GetConnectionString("DefaultConnection");

            _topicRepo = new TopicRepository(connString);
        }

        // GET: api/topics
        [HttpGet]
        public IActionResult GetTopics([FromQuery] int? maNguoiDung = null)
        {
            try
            {
                // Gọi repository lấy danh sách chủ đề (đã có AnhMinhHoa và NgayTao)
                List<Topic> topics = _topicRepo.GetAllTopics(maNguoiDung);

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

        [HttpGet("{id}")]
        public IActionResult GetTopic(int id, [FromQuery] int? maNguoiDung = null)
        {
            try
            {
                Topic topic = _topicRepo.GetTopicById(id, maNguoiDung);
                if (topic == null)
                {
                    return NotFound(new { message = "Không tìm thấy chủ đề này!" });
                }
                return Ok(topic);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi hệ thống: " + ex.Message });
            }
        }
        [HttpPost]
        public IActionResult CreateTopic([FromBody] Topic topic)
        {
            if (_topicRepo.AddTopic(topic)) return Ok(new { success = true, message = "Thêm chủ đề thành công" });
            return BadRequest(new { success = false, message = "Không thể thêm chủ đề" });
        }

        [HttpPut("{id}")]
        public IActionResult UpdateTopic(int id, [FromBody] Topic topic)
        {
            topic.MaChuDe = id;
            if (_topicRepo.UpdateTopic(topic)) return Ok(new { success = true, message = "Cập nhật chủ đề thành công" });
            return BadRequest(new { success = false, message = "Không thể cập nhật chủ đề" });
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteTopic(int id)
        {
            if (_topicRepo.DeleteTopic(id)) return Ok(new { success = true, message = "Xóa chủ đề thành công" });
            return BadRequest(new { success = false, message = "Không thể xóa chủ đề" });
        }
    }
}
