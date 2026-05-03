using System;
using Microsoft.Data.SqlClient;
using VocabJourney.Models;
namespace VocabJourney.Repositories
{
    public class TienDoRepository
    {
        private readonly string _connectionString;

        public TienDoRepository(string connectionString)
        {
            _connectionString = connectionString;
        }
        public bool LuuTienDoTuVung(int maNguoiDung, int maTuVung, bool daHoc)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                // Câu lệnh SQL "2 trong 1": Vừa Insert vừa Update
                string query = @"
                    IF EXISTS (SELECT 1 FROM TienDoTuVung WHERE MaNguoiDung = @MaNguoiDung AND MaTuVung = @MaTuVung)
                    BEGIN
                        -- Đã tồn tại -> Cập nhật trạng thái và ngày ôn
                        UPDATE TienDoTuVung 
                        SET DaHoc = @DaHoc, NgayOnCuoi = GETDATE()
                        WHERE MaNguoiDung = @MaNguoiDung AND MaTuVung = @MaTuVung
                    END
                    ELSE
                    BEGIN
                        -- Chưa tồn tại -> Thêm dòng mới
                        INSERT INTO TienDoTuVung (MaNguoiDung, MaTuVung, DaHoc, NgayOnCuoi) 
                        VALUES (@MaNguoiDung, @MaTuVung, @DaHoc, GETDATE())
                    END";

                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@MaNguoiDung", maNguoiDung);
                    cmd.Parameters.AddWithValue("@MaTuVung", maTuVung);
                    // Dưới DB cột DaHoc kiểu BIT (1/0), C# là boolean nên chuyển đổi một chút:
                    cmd.Parameters.AddWithValue("@DaHoc", daHoc ? 1 : 0);

                    conn.Open();
                    // ExecuteNonQuery dùng cho các lệnh INSERT, UPDATE, DELETE (không trả về bảng)
                    int rowsAffected = cmd.ExecuteNonQuery();
                    return rowsAffected > 0;
                }
            }
        }
    }
}
