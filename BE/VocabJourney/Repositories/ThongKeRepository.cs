using System;
using System.Collections.Generic;
using Microsoft.Data.SqlClient;
using VocabJourney.Models;

namespace VocabJourney.Repositories
{
    public class ThongKeRepository
    {
        private readonly string _connectionString;

        public ThongKeRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        public ThongKeNguoiDung GetThongKe(int maNguoiDung)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query = "SELECT * FROM ThongKeNguoiDung WHERE MaNguoiDung = @MaNguoiDung";
                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@MaNguoiDung", maNguoiDung);
                    conn.Open();
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            return new ThongKeNguoiDung
                            {
                                MaNguoiDung = Convert.ToInt32(reader["MaNguoiDung"]),
                                DiemKinhNghiem = Convert.ToInt32(reader["DiemKinhNghiem"]),
                                CapDo = Convert.ToInt32(reader["CapDo"]),
                                ChuoiNgayHoc = Convert.ToInt32(reader["ChuoiNgayHoc"]),
                                NgayHocCuoi = reader["NgayHocCuoi"] != DBNull.Value ? Convert.ToDateTime(reader["NgayHocCuoi"]) : (DateTime?)null,
                                TongTuDaHoc = reader["TongTuDaHoc"] != DBNull.Value ? Convert.ToInt32(reader["TongTuDaHoc"]) : 0,
                                TongQuizDaLam = reader["TongQuizDaLam"] != DBNull.Value ? Convert.ToInt32(reader["TongQuizDaLam"]) : 0
                            };
                        }
                    }
                }
            }
            return null;
        }

        public void CapNhatStreak(int maNguoiDung)
        {
            var thongKe = GetThongKe(maNguoiDung);
            DateTime homNay = DateTime.Today;

            // Nếu chưa có bản ghi thống kê, tạo mới
            if (thongKe == null)
            {
                using (SqlConnection conn = new SqlConnection(_connectionString))
                {
                    string query = "INSERT INTO ThongKeNguoiDung (MaNguoiDung, ChuoiNgayHoc, NgayHocCuoi, TongTuDaHoc) VALUES (@MaNguoiDung, 1, @NgayHocCuoi, 1)";
                    using (SqlCommand cmd = new SqlCommand(query, conn))
                    {
                        cmd.Parameters.AddWithValue("@MaNguoiDung", maNguoiDung);
                        cmd.Parameters.AddWithValue("@NgayHocCuoi", homNay);
                        conn.Open();
                        cmd.ExecuteNonQuery();
                    }
                }
                return;
            }

            // Tính toán streak
            int streakMoi = thongKe.ChuoiNgayHoc;
            if (thongKe.NgayHocCuoi.HasValue)
            {
                DateTime ngayCuoi = thongKe.NgayHocCuoi.Value.Date;
                if (ngayCuoi == homNay.AddDays(-1))
                {
                    streakMoi = thongKe.ChuoiNgayHoc + 1;
                }
                else if (ngayCuoi < homNay.AddDays(-1))
                {
                    streakMoi = 1;
                }
                // Nếu là hôm nay thì giữ nguyên streakMoi
            }
            else
            {
                streakMoi = 1;
            }

            // Cập nhật Database (Tăng cả tổng số từ đã học nếu cần - ở đây mình cứ tăng mỗi lần học)
            // Lưu ý: TongTuDaHoc nên được tính chính xác bằng COUNT(DISTINCT MaTuVung) ở TienDoTuVung
            // Nhưng để đơn giản tạm thời, mình sẽ lấy COUNT từ Database
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query = @"
                    UPDATE ThongKeNguoiDung 
                    SET ChuoiNgayHoc = @Streak, 
                        NgayHocCuoi = @NgayHocCuoi,
                        TongTuDaHoc = (SELECT COUNT(*) FROM TienDoTuVung WHERE MaNguoiDung = @MaNguoiDung AND DaHoc = 1)
                    WHERE MaNguoiDung = @MaNguoiDung";

                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@Streak", streakMoi);
                    cmd.Parameters.AddWithValue("@NgayHocCuoi", homNay);
                    cmd.Parameters.AddWithValue("@MaNguoiDung", maNguoiDung);
                    conn.Open();
                    cmd.ExecuteNonQuery();
                }
            }
        }
    }
}
