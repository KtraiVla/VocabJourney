using System;
using System.Collections.Generic;
using Microsoft.Data.SqlClient;
using VocabJourney.Models;

namespace VocabJourney.Repositories
{
    public class ThuThachRepository
    {
        private readonly string _connectionString;

        public ThuThachRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        public List<object> GetThuThachNgay(int maNguoiDung)
        {
            List<object> dsThuThach = new List<object>();
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                // Logic: Lấy các thử thách (HuyHieu loại 2) và tiến độ của người dùng trong ngày hôm nay
                // Nếu chưa có dòng trong TienDoThuThachNgay cho ngày hôm nay, ta có thể tự động tạo hoặc trả về 0
                string query = @"
                    SELECT h.MaHuyHieu, h.TenHuyHieu, h.MoTa, h.MucTieu, h.PhanThuongXP,
                           ISNULL(td.TienDoHienTai, 0) AS TienDoHienTai,
                           ISNULL(td.DaNhanThuong, 0) AS DaNhanThuong
                    FROM HuyHieu h
                    LEFT JOIN TienDoThuThachNgay td ON h.MaHuyHieu = td.MaHuyHieu 
                         AND td.MaNguoiDung = @MaNguoiDung 
                         AND td.NgayGhiNhan = CAST(GETDATE() AS DATE)
                    WHERE h.LoaiHuyHieu = 2"; // Loại 2 là thử thách hàng ngày

                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@MaNguoiDung", maNguoiDung);
                    conn.Open();
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            dsThuThach.Add(new
                            {
                                MaHuyHieu = Convert.ToInt32(reader["MaHuyHieu"]),
                                Title = reader["TenHuyHieu"].ToString(),
                                Desc = reader["MoTa"].ToString(),
                                Total = Convert.ToInt32(reader["MucTieu"]),
                                Reward = Convert.ToInt32(reader["PhanThuongXP"]),
                                Progress = Convert.ToInt32(reader["TienDoHienTai"]),
                                IsCompleted = Convert.ToBoolean(reader["DaNhanThuong"])
                            });
                        }
                    }
                }
            }
            return dsThuThach;
        }
    }
}
