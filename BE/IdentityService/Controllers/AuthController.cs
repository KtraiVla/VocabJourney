using Microsoft.AspNetCore.Mvc;
using IdentityService.Models;
using IdentityService.Repositories;
using IdentityService.Services;
using BCrypt.Net;

namespace IdentityService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly UserRepository _repo;
        private readonly TokenGenerator _tokenGen;

        public AuthController(UserRepository repo, TokenGenerator tokenGen)
        {
            _repo = repo;
            _tokenGen = tokenGen;
        }

        [HttpPost("register")]
        public IActionResult Register(RegisterRequest request)
        {
            if (_repo.IsUserExists(request.Username, request.Email))
                return BadRequest(new { message = "Tên đăng nhập hoặc Email đã tồn tại!" });

            // Mã hóa mật khẩu trước khi lưu
            string passHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

            if (_repo.CreateUser(request, passHash))
                return Ok(new { message = "Đăng ký thành công!" });

            return StatusCode(500, "Lỗi hệ thống khi tạo tài khoản.");
        }

        [HttpPost("login")]
        public IActionResult Login(LoginRequest request)
        {
            var user = _repo.GetUserCredentials(request.Username);

            // Kiểm tra user có tồn tại và mật khẩu băm có khớp không
            if (user.hashedPassword == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.hashedPassword))
            {
                return Unauthorized(new { message = "Tài khoản hoặc mật khẩu không chính xác!" });
            }

            // Tạo Token cho phiên làm việc
            string token = _tokenGen.GenerateToken(user.userId, request.Username, user.role);

            return Ok(new { token = token, userId = user.userId, message = "Đăng nhập thành công!" });
        }

        [HttpGet("user/{id}")]
        public IActionResult GetUserInfo(int id)
        {
            var user = _repo.GetUserById(id);
            if (user.username == null) return NotFound(new { message = "Không tìm thấy người dùng" });

            return Ok(new
            {
                username = user.username,
                email = user.email,
                joinDate = user.joinDate
            });
        }
        [HttpGet("users")]
        public IActionResult GetAllUsers()
        {
            var users = _repo.GetAllUsers();
            return Ok(users);
        }
    }
}