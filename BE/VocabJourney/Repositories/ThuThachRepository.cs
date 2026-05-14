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
                // Logic: Lấy các thử thách (HuyHieu loại 2) và ánh xạ tiến độ từ bảng ThongKeNguoiDung
                // Chúng ta so khớp tên thử thách để lấy đúng cột dữ liệu (SoTuHoc, SoTuOn, SoQuiz)
                string query = @"
                    SELECT h.MaHuyHieu, h.TenHuyHieu, h.MoTa, h.MucTieu, h.PhanThuongXP,
                           CASE 
                               WHEN h.TenHuyHieu LIKE N'%Học%' OR h.MoTa LIKE N'%Học%' THEN ISNULL(t.SoTuHocHomNay, 0)
                               WHEN h.TenHuyHieu LIKE N'%Ôn%' OR h.MoTa LIKE N'%Ôn%' THEN ISNULL(t.SoTuOnHomNay, 0)
                               WHEN h.TenHuyHieu LIKE N'%Quiz%' OR h.TenHuyHieu LIKE N'%Kiểm tra%' THEN ISNULL(t.SoQuizHomNay, 0)
                               ELSE 0
                           END AS TienDoHienTai,
                           CASE 
                               WHEN (h.TenHuyHieu LIKE N'%Học%' OR h.MoTa LIKE N'%Học%') AND (t.DailyChallengeStatus & 1) = 1 THEN 1
                               WHEN (h.TenHuyHieu LIKE N'%Ôn%' OR h.MoTa LIKE N'%Ôn%') AND (t.DailyChallengeStatus & 2) = 2 THEN 1
                               WHEN (h.TenHuyHieu LIKE N'%Quiz%' OR h.TenHuyHieu LIKE N'%Kiểm tra%' OR h.MoTa LIKE N'%Quiz%') AND (t.DailyChallengeStatus & 4) = 4 THEN 1
                               ELSE 0
                           END AS DaNhanThuong
                    FROM HuyHieu h
                    LEFT JOIN ThongKeNguoiDung t ON t.MaNguoiDung = @MaNguoiDung
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
                                IsCompleted = Convert.ToInt32(reader["DaNhanThuong"]) == 1
                            });
                        }
                    }
                }
            }
            return dsThuThach;
        }
    }
}
