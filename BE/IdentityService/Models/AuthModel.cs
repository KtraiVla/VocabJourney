using System.ComponentModel.DataAnnotations;

namespace IdentityService.Models
{
    public class RegisterRequest
    {
        [Required(ErrorMessage = "Tên đăng nhập không được để trống!")]
        [MinLength(3, ErrorMessage = "Tên đăng nhập phải có ít nhất 3 ký tự!")]
        public string Username { get; set; }

        [Required(ErrorMessage = "Email không được để trống!")]
        [EmailAddress(ErrorMessage = "Định dạng email không hợp lệ (phải có @...)!")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Mật khẩu không được để trống!")]
        [MinLength(6, ErrorMessage = "Mật khẩu phải có ít nhất 6 ký tự!")]
        // Cậu có thể thêm Regex nếu muốn mật khẩu cực khó (phải có chữ hoa, số...)
        // [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$", ErrorMessage = "Mật khẩu quá yếu!")]
        public string Password { get; set; }
    }

    public class LoginRequest
    {
        [Required(ErrorMessage = "Vui lòng nhập tên đăng nhập!")]
        public string Username { get; set; }

        [Required(ErrorMessage = "Vui lòng nhập mật khẩu!")]
        public string Password { get; set; }
    }
}
