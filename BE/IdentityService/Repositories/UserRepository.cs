using System.Data.SqlClient;
using Microsoft.Data.SqlClient;
using IdentityService.Models;

namespace IdentityService.Repositories
{
    public class UserRepository
    {
        private readonly string _connectionString;

        // Lấy chuỗi kết nối từ appsettings.json
        public UserRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        // 1. Hàm kiểm tra xem Username hoặc Email đã tồn tại chưa
        public bool IsUserExists(string username, string email)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query = "SELECT COUNT(1) FROM NguoiDung WHERE TenDangNhap = @Username OR Email = @Email";
                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@Username", username);
                    cmd.Parameters.AddWithValue("@Email", email);

                    conn.Open();
                    int count = (int)cmd.ExecuteScalar();
                    return count > 0;
                }
            }
        }

        // 2. Hàm thêm User mới vào bảng NguoiDung
        public bool CreateUser(RegisterRequest request, string hashedPassword)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query = @"INSERT INTO NguoiDung (TenDangNhap, Email, MatKhau, VaiTro, TrangThaiHoatDong, NgayTao) 
                                 VALUES (@Username, @Email, @Password, 'User', 1, GETDATE())";
                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@Username", request.Username);
                    cmd.Parameters.AddWithValue("@Email", request.Email);
                    cmd.Parameters.AddWithValue("@Password", hashedPassword); // Lưu mật khẩu đã mã hóa, tuyệt đối không lưu pass gốc

                    conn.Open();
                    int result = cmd.ExecuteNonQuery();
                    return result > 0;
                }
            }
        }

        public (string hashedPassword, int userId, string role) GetUserCredentials(string username)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                // Lấy mật khẩu đã băm, ID và Vai trò của người dùng
                string query = "SELECT MatKhau, MaNguoiDung, VaiTro FROM NguoiDung WHERE (TenDangNhap = @Username OR Email = @Username) AND TrangThaiHoatDong = 1";
                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@Username", username);
                    conn.Open();
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            return (reader["MatKhau"].ToString(), (int)reader["MaNguoiDung"], reader["VaiTro"].ToString());
                        }
                    }
                }
            }
            return (null, 0, null);
        }

        public (string username, string email, DateTime joinDate) GetUserById(int userId)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query = "SELECT TenDangNhap, Email, NgayTao FROM NguoiDung WHERE MaNguoiDung = @UserId";
                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@UserId", userId);
                    conn.Open();
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            return (reader["TenDangNhap"].ToString(), 
                                    reader["Email"].ToString(), 
                                    Convert.ToDateTime(reader["NgayTao"]));
                        }
                    }
                }
            }
            return (null, null, DateTime.MinValue);
        }
        public List<object> GetAllUsers()
        {
            var users = new List<object>();
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query = @"
                    SELECT 
                        n.MaNguoiDung, 
                        n.TenDangNhap, 
                        n.Email, 
                        n.VaiTro, 
                        n.NgayTao,
                        ISNULL(tk.CapDo, 1) AS CapDo,
                        ISNULL(tk.DiemKinhNghiem, 0) AS DiemKinhNghiem,
                        ISNULL(tk.TongTuDaHoc, 0) AS TongTuDaHoc,
                        n.TrangThaiHoatDong
                    FROM NguoiDung n
                    LEFT JOIN ThongKeNguoiDung tk ON n.MaNguoiDung = tk.MaNguoiDung";
                
                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    conn.Open();
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            users.Add(new
                            {
                                id = (int)reader["MaNguoiDung"],
                                username = reader["TenDangNhap"].ToString(),
                                email = reader["Email"].ToString(),
                                role = reader["VaiTro"].ToString(),
                                joinDate = Convert.ToDateTime(reader["NgayTao"]),
                                level = Convert.ToInt32(reader["CapDo"]),
                                xp = Convert.ToInt32(reader["DiemKinhNghiem"]),
                                wordsLearned = Convert.ToInt32(reader["TongTuDaHoc"]),
                                status = Convert.ToInt32(reader["TrangThaiHoatDong"]) == 1 ? "active" : "inactive"
                            });
                        }
                    }
                }
            }
            return users;
        }
    }
}