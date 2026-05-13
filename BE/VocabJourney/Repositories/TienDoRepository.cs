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
                // Lấy số lần ôn đúng cũ để phân biệt là Học mới hay Ôn tập
                string checkSql = "SELECT ISNULL(SoLanOnDung, 0) FROM TienDoTuVung WHERE MaNguoiDung = @MaNguoiDung AND MaTuVung = @MaTuVung";
                int oldSoLanOnDung = 0;
                
                string query = @"
                    DECLARE @SoLanOnDung INT = 0;
                    SELECT @SoLanOnDung = ISNULL(SoLanOnDung, 0) FROM TienDoTuVung WHERE MaNguoiDung = @MaNguoiDung AND MaTuVung = @MaTuVung;

                    DECLARE @NextReview INT = 1;
                    IF @daHoc = 1 
                    BEGIN
                        SET @SoLanOnDung = ISNULL(@SoLanOnDung, 0) + 1;
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
                            NgayOnTiepTheo = CAST(DATEADD(day, @NextReview, GETDATE()) AS DATE),
                            SoLanOn = ISNULL(SoLanOn, 0) + 1
                        WHERE MaNguoiDung = @MaNguoiDung AND MaTuVung = @MaTuVung
                    END
                    ELSE
                    BEGIN
                        INSERT INTO TienDoTuVung (MaNguoiDung, MaTuVung, DaHoc, NgayOnCuoi, SoLanOnDung, NgayOnTiepTheo, SoLanOn) 
                        VALUES (@MaNguoiDung, @MaTuVung, @DaHoc, GETDATE(), @SoLanOnDung, CAST(DATEADD(day, @NextReview, GETDATE()) AS DATE), 1)
                    END";

                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@MaNguoiDung", maNguoiDung);
                    cmd.Parameters.AddWithValue("@MaTuVung", maTuVung);
                    cmd.Parameters.AddWithValue("@DaHoc", daHoc ? 1 : 0);

                    conn.Open();
                    
                    // Lấy giá trị cũ trước khi thực hiện Query
                    using (SqlCommand checkCmd = new SqlCommand(checkSql, conn))
                    {
                        checkCmd.Parameters.AddWithValue("@MaNguoiDung", maNguoiDung);
                        checkCmd.Parameters.AddWithValue("@MaTuVung", maTuVung);
                        var res = checkCmd.ExecuteScalar();
                        oldSoLanOnDung = res != null ? Convert.ToInt32(res) : 0;
                    }

                    int rowsAffected = cmd.ExecuteNonQuery();
                    
                    if (rowsAffected > 0)
                    {
                        var thongKeRepo = new ThongKeRepository(_connectionString);
                        
                        if (daHoc)
                        {
                            // Phân biệt: Nếu là lần đầu tiên bấm "Đã thuộc" (old=0) thì là LEARN, ngược lại là REVIEW
                            string actionType = (oldSoLanOnDung == 0) ? "LEARN" : "REVIEW";
                            thongKeRepo.CongXP(maNguoiDung, actionType);
                        }
                        
                        if (daHoc || oldSoLanOnDung > 0)
                        {
                            // Tính streak nếu:
                            // 1. Học từ mới và đánh dấu "Đã thuộc"
                            // 2. Hoặc đang ôn tập lại từ cũ (bất kể kết quả thuộc hay quên)
                            thongKeRepo.CapNhatStreak(maNguoiDung);
                        }
                    }
                    
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

                    if (rowsAffected > 0)
                    {
                        var thongKeRepo = new ThongKeRepository(_connectionString);
                        thongKeRepo.CongXP(maNguoiDung, "LESSON");
                    }

                    return rowsAffected > 0;
                }
            }
        }

        public object GetBaiHocGanNhat(int maNguoiDung)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query = @"
                    SELECT TOP 1 
                        b.MaBaiHoc, 
                        b.TieuDe, 
                        c.TenChuDe, 
                        b.MaChuDe,
                        c.AnhMinhHoa,
                        (SELECT MAX(val) FROM (VALUES 
                            (ISNULL((SELECT MAX(NgayOnCuoi) FROM TienDoTuVung WHERE MaNguoiDung = @MaNguoiDung AND MaTuVung IN (SELECT MaTuVung FROM TuVung WHERE MaBaiHoc = b.MaBaiHoc)), '1900-01-01')),
                            (ISNULL((SELECT NgayHoanThanh FROM TienDoBaiHoc WHERE MaNguoiDung = @MaNguoiDung AND MaBaiHoc = b.MaBaiHoc), '1900-01-01'))
                        ) AS v(val)) AS NgayGanNhat,
                        CASE 
                            WHEN EXISTS (SELECT 1 FROM TienDoBaiHoc WHERE MaNguoiDung = @MaNguoiDung AND MaBaiHoc = b.MaBaiHoc AND DaHoanThanh = 1) THEN 100
                            ELSE (CAST((SELECT COUNT(*) FROM TienDoTuVung tdtv2 
                                       JOIN TuVung tv2 ON tdtv2.MaTuVung = tv2.MaTuVung 
                                       WHERE tv2.MaBaiHoc = b.MaBaiHoc AND tdtv2.MaNguoiDung = @MaNguoiDung AND tdtv2.DaHoc = 1) AS FLOAT) 
                                 / NULLIF((SELECT COUNT(*) FROM TuVung WHERE MaBaiHoc = b.MaBaiHoc), 0) * 100)
                        END AS TienDo
                    FROM BaiHoc b
                    JOIN ChuDe c ON b.MaChuDe = c.MaChuDe
                    WHERE EXISTS (SELECT 1 FROM TienDoTuVung WHERE MaNguoiDung = @MaNguoiDung AND MaTuVung IN (SELECT MaTuVung FROM TuVung WHERE MaBaiHoc = b.MaBaiHoc))
                       OR EXISTS (SELECT 1 FROM TienDoBaiHoc WHERE MaNguoiDung = @MaNguoiDung AND MaBaiHoc = b.MaBaiHoc)
                    ORDER BY NgayGanNhat DESC";

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
                                maBaiHoc = Convert.ToInt32(reader["MaBaiHoc"]),
                                tieuDe = reader["TieuDe"].ToString(),
                                tenChuDe = reader["TenChuDe"].ToString(),
                                maChuDe = Convert.ToInt32(reader["MaChuDe"]),
                                anhMinhHoa = reader["AnhMinhHoa"] != DBNull.Value ? reader["AnhMinhHoa"].ToString() : null,
                                tienDo = reader["TienDo"] != DBNull.Value ? Math.Round(Convert.ToDouble(reader["TienDo"]), 0) : 0
                            };
                        }
                    }
                }
            }
            return null;
        }

        public bool LuuKetQuaKiemTra(int maNguoiDung, int maBaiKiemTra, int soCauDung, int tongCauHoi)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query = @"
                    INSERT INTO KetQuaKiemTra (MaNguoiDung, MaBaiKiemTra, SoCauDung, TongSoCau, DiemSo, NgayLamBai) 
                    VALUES (@MaNguoiDung, @MaBaiKiemTra, @SoCauDung, @TongSoCau, @DiemSo, GETDATE())";

                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@MaNguoiDung", maNguoiDung);
                    cmd.Parameters.AddWithValue("@MaBaiKiemTra", maBaiKiemTra);
                    cmd.Parameters.AddWithValue("@SoCauDung", soCauDung);
                    cmd.Parameters.AddWithValue("@TongSoCau", tongCauHoi);
                    cmd.Parameters.AddWithValue("@DiemSo", soCauDung); // Giả định điểm số = số câu đúng

                    conn.Open();
                    int rowsAffected = cmd.ExecuteNonQuery();

                    if (rowsAffected > 0)
                    {
                        // Tính toán XP theo đúng bản thiết kế
                        // Mỗi câu đúng +4 XP, Hoàn thành +20 XP, Perfect +20 XP
                        int xpGoc = (soCauDung * 4) + 20;
                        if (soCauDung == tongCauHoi && tongCauHoi >= 15) 
                        {
                            xpGoc += 20;
                        }

                        var thongKeRepo = new ThongKeRepository(_connectionString);
                        thongKeRepo.CongXP(maNguoiDung, "QUIZ", xpGoc);
                    }

                    return rowsAffected > 0;
                }
            }
        }

        public int GetSoTuCanOnTap(int maNguoiDung)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query = @"
                    SELECT COUNT(*) 
                    FROM TienDoTuVung 
                    WHERE MaNguoiDung = @MaNguoiDung 
                    AND CAST(NgayOnTiepTheo AS DATE) <= CAST(GETDATE() AS DATE)";

                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@MaNguoiDung", maNguoiDung);
                    conn.Open();
                    return (int)cmd.ExecuteScalar();
                }
            }
        }
        public List<TuVung> GetDanhSachTuCanOnTap(int maNguoiDung)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query = @"
                    SELECT v.* 
                    FROM TienDoTuVung t
                    JOIN TuVung v ON t.MaTuVung = v.MaTuVung
                    WHERE t.MaNguoiDung = @MaNguoiDung 
                    AND CAST(t.NgayOnTiepTheo AS DATE) <= CAST(GETDATE() AS DATE)
                    ORDER BY t.NgayOnTiepTheo ASC";

                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@MaNguoiDung", maNguoiDung);
                    conn.Open();
                    List<TuVung> danhSach = new List<TuVung>();
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            danhSach.Add(new TuVung
                            {
                                MaTuVung = Convert.ToInt32(reader["MaTuVung"]),
                                TuTiengAnh = reader["TuTiengAnh"].ToString(),
                                NghiaTiengViet = reader["NghiaTiengViet"].ToString(),
                                PhienAm = reader["PhienAm"].ToString(),
                                AnhMinhHoa = reader["AnhMinhHoa"] != DBNull.Value ? reader["AnhMinhHoa"].ToString() : null,
                                DinhNghia = reader["DinhNghia"] != DBNull.Value ? reader["DinhNghia"].ToString() : null,
                                ViDu = reader["ViDu"] != DBNull.Value ? reader["ViDu"].ToString() : null
                            });
                        }
                    }
                    return danhSach;
                }
            }
        }
    }
}
