using System;
using Microsoft.Data.SqlClient;
using VocabJourney.Models;
using System.Collections.Generic;

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
                // Cập nhật logic Leitner cơ bản
                // Nếu thuộc (daHoc=true): Tăng số lần ôn đúng, ngày ôn tiếp theo = hôm nay + (2^số lần ôn đúng)
                // Nếu chưa thuộc: Reset số lần ôn đúng, ngày ôn tiếp theo = ngày mai
                string query = @"
                    DECLARE @SoLanOnDung INT = 0;
                    SELECT @SoLanOnDung = ISNULL(SoLanOnDung, 0) FROM TienDoTuVung WHERE MaNguoiDung = @MaNguoiDung AND MaTuVung = @MaTuVung;

                    IF @SoLanOnDung IS NULL SET @SoLanOnDung = 0;

                    DECLARE @NextReview DAYS INT = 1;
                    IF @daHoc = 1 
                    BEGIN
                        SET @SoLanOnDung = @SoLanOnDung + 1;
                        SET @NextReview = POWER(2, @SoLanOnDung - 1);
                    END
                    ELSE
                    BEGIN
                        SET @SoLanOnDung = 0;
                        SET @NextReview = 1;
                    END

                    IF EXISTS (SELECT 1 FROM TienDoTuVung WHERE MaNguoiDung = @MaNguoiDung AND MaTuVung = @MaTuVung)
                    BEGIN
                        UPDATE TienDoTuVung 
                        SET DaHoc = @DaHoc, 
                            NgayOnCuoi = GETDATE(),
                            SoLanOnDung = @SoLanOnDung,
                            NgayOnTiepTheo = DATEADD(day, @NextReview, GETDATE()),
                            SoLanOn = SoLanOn + 1
                        WHERE MaNguoiDung = @MaNguoiDung AND MaTuVung = @MaTuVung
                    END
                    ELSE
                    BEGIN
                        INSERT INTO TienDoTuVung (MaNguoiDung, MaTuVung, DaHoc, NgayOnCuoi, SoLanOnDung, NgayOnTiepTheo, SoLanOn) 
                        VALUES (@MaNguoiDung, @MaTuVung, @DaHoc, GETDATE(), @SoLanOnDung, DATEADD(day, @NextReview, GETDATE()), 1)
                    END";

                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@MaNguoiDung", maNguoiDung);
                    cmd.Parameters.AddWithValue("@MaTuVung", maTuVung);
                    cmd.Parameters.AddWithValue("@DaHoc", daHoc ? 1 : 0);

                    conn.Open();
                    int rowsAffected = cmd.ExecuteNonQuery();
                    return rowsAffected > 0;
                }
            }
        }

        public bool LuuTienDoBaiHoc(int maNguoiDung, int maBaiHoc)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query = @"
                    IF EXISTS (SELECT 1 FROM TienDoBaiHoc WHERE MaNguoiDung = @MaNguoiDung AND MaBaiHoc = @MaBaiHoc)
                    BEGIN
                        UPDATE TienDoBaiHoc 
                        SET DaHoanThanh = 1, NgayHoanThanh = GETDATE()
                        WHERE MaNguoiDung = @MaNguoiDung AND MaBaiHoc = @MaBaiHoc
                    END
                    ELSE
                    BEGIN
                        INSERT INTO TienDoBaiHoc (MaNguoiDung, MaBaiHoc, DaHoanThanh, NgayHoanThanh) 
                        VALUES (@MaNguoiDung, @MaBaiHoc, 1, GETDATE())
                    END";

                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@MaNguoiDung", maNguoiDung);
                    cmd.Parameters.AddWithValue("@MaBaiHoc", maBaiHoc);

                    conn.Open();
                    int rowsAffected = cmd.ExecuteNonQuery();
                    return rowsAffected > 0;
                }
            }
        }

        // Lấy bài học gần nhất đang học dở hoặc vừa học xong
        public object GetBaiHocGanNhat(int maNguoiDung)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query = @"
                    SELECT TOP 1 b.MaBaiHoc, b.TieuDe, c.TenChuDe, b.MaChuDe,
                           (CAST((SELECT COUNT(*) FROM TienDoTuVung tdtv 
                                  JOIN TuVung tv ON tdtv.MaTuVung = tv.MaTuVung 
                                  WHERE tv.MaBaiHoc = b.MaBaiHoc AND tdtv.MaNguoiDung = @MaNguoiDung AND tdtv.DaHoc = 1) AS FLOAT) 
                            / NULLIF((SELECT COUNT(*) FROM TuVung WHERE MaBaiHoc = b.MaBaiHoc), 0) * 100) AS TienDo
                    FROM TienDoTuVung tdtv
                    JOIN TuVung tv ON tdtv.MaTuVung = tv.MaTuVung
                    JOIN BaiHoc b ON tv.MaBaiHoc = b.MaBaiHoc
                    JOIN ChuDe c ON b.MaChuDe = c.MaChuDe
                    WHERE tdtv.MaNguoiDung = @MaNguoiDung
                    ORDER BY tdtv.NgayOnCuoi DESC";

                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@MaNguoiDung", maNguoiDung);
                    conn.Open();
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            return new
                            {
                                MaBaiHoc = Convert.ToInt32(reader["MaBaiHoc"]),
                                TieuDe = reader["TieuDe"].ToString(),
                                TenChuDe = reader["TenChuDe"].ToString(),
                                MaChuDe = Convert.ToInt32(reader["MaChuDe"]),
                                TienDo = reader["TienDo"] != DBNull.Value ? Math.Round(Convert.ToDouble(reader["TienDo"]), 0) : 0
                            };
                        }
                    }
                }
            }
            return null;
        }

        // Đếm số từ vựng cần ôn tập hôm nay
        public int GetSoTuCanOnTap(int maNguoiDung)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query = @"
                    SELECT COUNT(*) 
                    FROM TienDoTuVung 
                    WHERE MaNguoiDung = @MaNguoiDung 
                    AND NgayOnTiepTheo <= GETDATE()";

                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@MaNguoiDung", maNguoiDung);
                    conn.Open();
                    return (int)cmd.ExecuteScalar();
                }
            }
        }
    }
}
