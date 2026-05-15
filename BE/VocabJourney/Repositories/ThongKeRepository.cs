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
                string query = @"
                    SELECT 
                        @MaNguoiDung AS MaNguoiDung,
                        ISNULL(t.DiemKinhNghiem, 0) AS DiemKinhNghiem,
                        ISNULL(t.CapDo, 1) AS CapDo,
                        ISNULL(t.ChuoiNgayHoc, 0) AS ChuoiNgayHoc,
                        t.NgayHocCuoi,
                        t.XPHomNay,
                        t.SoTuOnHomNay,
                        t.SoTuHocHomNay,
                        t.SoQuizHomNay,
                        t.DailyChallengeStatus,
                        t.NgayCapNhatXP,
                        ISNULL((SELECT COUNT(*) + 1 FROM ThongKeNguoiDung WHERE DiemKinhNghiem > ISNULL(t.DiemKinhNghiem, 0)), (SELECT COUNT(*) + 1 FROM ThongKeNguoiDung)) AS ThuHang,
                        (SELECT COUNT(*) FROM TienDoTuVung WHERE MaNguoiDung = @MaNguoiDung AND DaHoc = 1) AS TongTuDaHoc,
                        (SELECT COUNT(*) FROM TienDoBaiHoc WHERE MaNguoiDung = @MaNguoiDung AND DaHoanThanh = 1) AS TongBaiHocDaXong,
                        (SELECT ISNULL(AVG(CAST(SoCauDung AS FLOAT) / CAST(NULLIF(TongSoCau, 0) AS FLOAT) * 100), 0) FROM KetQuaKiemTra WHERE MaNguoiDung = @MaNguoiDung) AS DoChinhXacTB,
                        (SELECT COUNT(*) FROM HuyHieuNguoiDung WHERE MaNguoiDung = @MaNguoiDung) AS TongHuyHieu,
                        (SELECT COUNT(*) FROM TienDoTuVung WHERE MaNguoiDung = @MaNguoiDung) AS TongTuDaGap,
                        (SELECT COUNT(*) FROM KetQuaKiemTra WHERE MaNguoiDung = @MaNguoiDung) AS TongQuizDaLam
                    FROM (SELECT 1 AS x) dummy
                    LEFT JOIN ThongKeNguoiDung t ON t.MaNguoiDung = @MaNguoiDung";

                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@MaNguoiDung", maNguoiDung);
                    conn.Open();
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            var thongKe = new ThongKeNguoiDung
                            {
                                MaNguoiDung = Convert.ToInt32(reader["MaNguoiDung"]),
                                DiemKinhNghiem = Convert.ToInt32(reader["DiemKinhNghiem"]),
                                CapDo = Convert.ToInt32(reader["CapDo"]),
                                ChuoiNgayHoc = Convert.ToInt32(reader["ChuoiNgayHoc"]),
                                NgayHocCuoi = reader["NgayHocCuoi"] != DBNull.Value ? Convert.ToDateTime(reader["NgayHocCuoi"]) : (DateTime?)null,
                                XPHomNay = reader["XPHomNay"] != DBNull.Value ? Convert.ToInt32(reader["XPHomNay"]) : 0,
                                SoTuOnHomNay = reader["SoTuOnHomNay"] != DBNull.Value ? Convert.ToInt32(reader["SoTuOnHomNay"]) : 0,
                                SoTuHocHomNay = reader["SoTuHocHomNay"] != DBNull.Value ? Convert.ToInt32(reader["SoTuHocHomNay"]) : 0,
                                SoQuizHomNay = reader["SoQuizHomNay"] != DBNull.Value ? Convert.ToInt32(reader["SoQuizHomNay"]) : 0,
                                DailyChallengeStatus = reader["DailyChallengeStatus"] != DBNull.Value ? Convert.ToInt32(reader["DailyChallengeStatus"]) : 0,
                                NgayCapNhatXP = reader["NgayCapNhatXP"] != DBNull.Value ? Convert.ToDateTime(reader["NgayCapNhatXP"]) : (DateTime?)null,
                                ThuHang = Convert.ToInt32(reader["ThuHang"]),
                                TongTuDaHoc = Convert.ToInt32(reader["TongTuDaHoc"]),
                                TongBaiHocDaXong = Convert.ToInt32(reader["TongBaiHocDaXong"]),
                                DoChinhXacTB = Convert.ToDouble(reader["DoChinhXacTB"]),
                                TongHuyHieu = Convert.ToInt32(reader["TongHuyHieu"]),
                                TongTuDaGap = Convert.ToInt32(reader["TongTuDaGap"]),
                                TongQuizDaLam = Convert.ToInt32(reader["TongQuizDaLam"])
                            };

                            // Kiểm tra và reset streak nếu quá hạn
                            if (thongKe.NgayHocCuoi.HasValue && thongKe.NgayHocCuoi.Value.Date < DateTime.Today.AddDays(-1))
                            {
                                thongKe.ChuoiNgayHoc = 0;
                            }
                            return thongKe;
                        }
                    }
                }
            }
            return null;
        }

        public LevelUpResult CongXP(int maNguoiDung, string actionType, int xpGoc = 0)
        {
            var result = new LevelUpResult { LeveledUp = false, NewLevel = 1 };
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                conn.Open();

                // 1. Lấy thông tin hiện tại
                string selectQuery = "SELECT DiemKinhNghiem, CapDo, ChuoiNgayHoc, NgayHocCuoi, XPHomNay, SoTuOnHomNay, SoTuHocHomNay, SoQuizHomNay, DailyChallengeStatus, NgayCapNhatXP FROM ThongKeNguoiDung WHERE MaNguoiDung = @MaNguoiDung";
                
                int currentXP = 0, currentLevel = 1, currentStreak = 0;
                int xpHomNay = 0, soTuOn = 0, soTuHoc = 0, soQuiz = 0, challengeStatus = 0;
                DateTime? lastUpdateXP = null;
                DateTime? lastHocCuoi = null;
                bool exists = false;

                using (SqlCommand cmd = new SqlCommand(selectQuery, conn))
                {
                    cmd.Parameters.AddWithValue("@MaNguoiDung", maNguoiDung);
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            exists = true;
                            currentXP = Convert.ToInt32(reader["DiemKinhNghiem"]);
                            currentLevel = Convert.ToInt32(reader["CapDo"]);
                            currentStreak = Convert.ToInt32(reader["ChuoiNgayHoc"]);
                            xpHomNay = reader["XPHomNay"] != DBNull.Value ? Convert.ToInt32(reader["XPHomNay"]) : 0;
                            soTuOn = reader["SoTuOnHomNay"] != DBNull.Value ? Convert.ToInt32(reader["SoTuOnHomNay"]) : 0;
                            soTuHoc = reader["SoTuHocHomNay"] != DBNull.Value ? Convert.ToInt32(reader["SoTuHocHomNay"]) : 0;
                            soQuiz = reader["SoQuizHomNay"] != DBNull.Value ? Convert.ToInt32(reader["SoQuizHomNay"]) : 0;
                            challengeStatus = reader["DailyChallengeStatus"] != DBNull.Value ? Convert.ToInt32(reader["DailyChallengeStatus"]) : 0;
                            lastUpdateXP = reader["NgayCapNhatXP"] != DBNull.Value ? Convert.ToDateTime(reader["NgayCapNhatXP"]) : (DateTime?)null;
                            lastHocCuoi = reader["NgayHocCuoi"] != DBNull.Value ? Convert.ToDateTime(reader["NgayHocCuoi"]) : (DateTime?)null;
                        }
                    }
                }

                // 2. Kiểm tra Streak thực tế
                if (lastHocCuoi.HasValue && lastHocCuoi.Value.Date < DateTime.Today.AddDays(-1))
                {
                    currentStreak = 0;
                }

                // 3. Reset ngày mới
                if (lastUpdateXP.HasValue && lastUpdateXP.Value.Date < DateTime.Today)
                {
                    xpHomNay = 0;
                    soTuOn = 0;
                    soTuHoc = 0;
                    soQuiz = 0;
                    challengeStatus = 0;
                }

                // 3. Tính hệ số Streak (x1.0, x1.2, x1.4, x1.6)
                double multiplier = 1.0;
                if (currentStreak >= 15) multiplier = 1.6;
                else if (currentStreak >= 8) multiplier = 1.4;
                else if (currentStreak >= 4) multiplier = 1.2;

                int xpToAdd = 0;
                int bonusXP = 0;

                // 4. Xử lý từng loại hành động
                switch (actionType.ToUpper())
                {
                    case "LEARN": // Học từ mới (+4 XP)
                        xpToAdd = 4; // Không nhân streak theo yêu cầu
                        soTuHoc++;
                        // Challenge: Học 5 từ -> +20 XP
                        if (soTuHoc >= 5 && (challengeStatus & 1) == 0) { bonusXP += 20; challengeStatus |= 1; }
                        break;
 
                    case "REVIEW": // Ôn tập (+3 XP/từ)
                        if (soTuOn < 50) // Giới hạn 50 từ/ngày
                        {
                            xpToAdd = (int)(3 * multiplier);
                            soTuOn++;
                            // Challenge: Ôn 10 từ -> +30 XP
                            if (soTuOn >= 10 && (challengeStatus & 2) == 0) { bonusXP += 30; challengeStatus |= 2; }
                        }
                        break;

                    case "LESSON": // Xong bài học (+20 XP)
                        xpToAdd = 20; // Không nhân streak
                        break;

                    case "QUIZ": // Làm Quiz (xpGoc = câu đúng * 4 + 20 hoàn thành + 20 perfect)
                        if (soQuiz == 0) // Chỉ nhận XP cho bài Quiz đầu tiên trong ngày
                        {
                            xpToAdd = xpGoc; // Không nhân streak theo yêu cầu
                        }
                        else
                        {
                            xpToAdd = 0; // Các bài Quiz sau chỉ để luyện tập, không có XP
                        }
                        soQuiz++;
                        // Challenge: Làm 1 quiz -> +40 XP
                        if (soQuiz >= 1 && (challengeStatus & 4) == 0) { bonusXP += 40; challengeStatus |= 4; }
                        break;
                }

                // Thưởng combo hoàn thành cả 3 nhiệm vụ (+50 XP)
                if ((challengeStatus & 7) == 7 && (challengeStatus & 8) == 0)
                {
                    bonusXP += 50;
                    challengeStatus |= 8;
                }

                int totalAdd = xpToAdd + bonusXP;

                // 5. Kiểm tra Hard Cap 200 XP
                if (xpHomNay >= 200) totalAdd = 0;
                else if (xpHomNay + totalAdd > 200) totalAdd = 200 - xpHomNay;

                if (totalAdd <= 0 && xpToAdd <= 0 && bonusXP <= 0) 
                {
                    // Vẫn cập nhật các chỉ số đếm cho dù không cộng XP
                    CapNhatChiSoHienTai(maNguoiDung, xpHomNay, soTuOn, soTuHoc, soQuiz, challengeStatus, conn, exists);
                    return;
                }

                int newXP = currentXP + totalAdd;
                int startLevel = currentLevel;
                int newLevel = currentLevel;
                int newXPHomNay = xpHomNay + totalAdd;

                // 6. Tính toán thăng cấp
                while (true)
                {
                    int xpCanDeLenCap = 120 + (int)(80 * Math.Pow(newLevel, 1.5));
                    if (newXP >= xpCanDeLenCap)
                    {
                        newXP -= xpCanDeLenCap;
                        newLevel++;
                    }
                    else break;
                }

                // 7. Cập nhật DB
                string updateQuery = exists 
                    ? @"UPDATE ThongKeNguoiDung SET DiemKinhNghiem = @XP, CapDo = @Level, XPHomNay = @XPHomNay, 
                               SoTuOnHomNay = @SoTuOn, SoTuHocHomNay = @SoTuHoc, SoQuizHomNay = @SoQuiz, 
                               DailyChallengeStatus = @Status, NgayCapNhatXP = GETDATE() 
                        WHERE MaNguoiDung = @MaNguoiDung"
                    : @"INSERT INTO ThongKeNguoiDung (MaNguoiDung, DiemKinhNghiem, CapDo, ChuoiNgayHoc, XPHomNay, SoTuOnHomNay, SoTuHocHomNay, SoQuizHomNay, DailyChallengeStatus, NgayCapNhatXP) 
                        VALUES (@MaNguoiDung, @XP, @Level, 0, @XPHomNay, @SoTuOn, @SoTuHoc, @SoQuiz, @Status, GETDATE())";

                using (SqlCommand cmd = new SqlCommand(updateQuery, conn))
                {
                    cmd.Parameters.AddWithValue("@XP", newXP);
                    cmd.Parameters.AddWithValue("@Level", newLevel);
                    cmd.Parameters.AddWithValue("@XPHomNay", newXPHomNay);
                    cmd.Parameters.AddWithValue("@SoTuOn", soTuOn);
                    cmd.Parameters.AddWithValue("@SoTuHoc", soTuHoc);
                    cmd.Parameters.AddWithValue("@SoQuiz", soQuiz);
                    cmd.Parameters.AddWithValue("@Status", challengeStatus);
                    cmd.Parameters.AddWithValue("@MaNguoiDung", maNguoiDung);
                    cmd.ExecuteNonQuery();
                }

                result.LeveledUp = newLevel > startLevel;
                result.NewLevel = newLevel;
            }
            return result;
        }

        public class LevelUpResult {
            public bool LeveledUp { get; set; }
            public int NewLevel { get; set; }
        }

        private void CapNhatChiSoHienTai(int maNguoiDung, int xpHomNay, int soTuOn, int soTuHoc, int soQuiz, int status, SqlConnection conn, bool exists)
        {
            string query = exists 
                ? "UPDATE ThongKeNguoiDung SET XPHomNay = @XPHomNay, SoTuOnHomNay = @SoTuOn, SoTuHocHomNay = @SoTuHoc, SoQuizHomNay = @SoQuiz, DailyChallengeStatus = @Status, NgayCapNhatXP = GETDATE() WHERE MaNguoiDung = @MaNguoiDung"
                : "INSERT INTO ThongKeNguoiDung (MaNguoiDung, XPHomNay, SoTuOnHomNay, SoTuHocHomNay, SoQuizHomNay, DailyChallengeStatus, NgayCapNhatXP, DiemKinhNghiem, CapDo, ChuoiNgayHoc) VALUES (@MaNguoiDung, @XPHomNay, @SoTuOn, @SoTuHoc, @SoQuiz, @Status, GETDATE(), 0, 1, 0)";
            
            using (SqlCommand cmd = new SqlCommand(query, conn))
            {
                cmd.Parameters.AddWithValue("@XPHomNay", xpHomNay);
                cmd.Parameters.AddWithValue("@SoTuOn", soTuOn);
                cmd.Parameters.AddWithValue("@SoTuHoc", soTuHoc);
                cmd.Parameters.AddWithValue("@SoQuiz", soQuiz);
                cmd.Parameters.AddWithValue("@Status", status);
                cmd.Parameters.AddWithValue("@MaNguoiDung", maNguoiDung);
                cmd.ExecuteNonQuery();
            }
        }

        public void CapNhatStreak(int maNguoiDung)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                conn.Open();
                string checkQuery = "SELECT ChuoiNgayHoc, NgayHocCuoi FROM ThongKeNguoiDung WHERE MaNguoiDung = @MaNguoiDung";
                int currentStreak = 0;
                DateTime? lastDate = null;
                bool exists = false;

                using (SqlCommand checkCmd = new SqlCommand(checkQuery, conn))
                {
                    checkCmd.Parameters.AddWithValue("@MaNguoiDung", maNguoiDung);
                    using (SqlDataReader reader = checkCmd.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            exists = true;
                            currentStreak = Convert.ToInt32(reader["ChuoiNgayHoc"]);
                            lastDate = reader["NgayHocCuoi"] != DBNull.Value ? Convert.ToDateTime(reader["NgayHocCuoi"]).Date : (DateTime?)null;
                        }
                    }
                }

                DateTime homNay = DateTime.Today;
                int streakMoi = 1;

                if (exists && lastDate.HasValue)
                {
                    if (lastDate.Value == homNay) return;
                    if (lastDate.Value == homNay.AddDays(-1)) streakMoi = currentStreak + 1;
                }

                string upsertQuery = exists 
                    ? "UPDATE ThongKeNguoiDung SET ChuoiNgayHoc = @Streak, NgayHocCuoi = @NgayHocCuoi WHERE MaNguoiDung = @MaNguoiDung"
                    : "INSERT INTO ThongKeNguoiDung (MaNguoiDung, ChuoiNgayHoc, NgayHocCuoi, DiemKinhNghiem, CapDo) VALUES (@MaNguoiDung, @Streak, @NgayHocCuoi, 0, 1)";

                using (SqlCommand cmd = new SqlCommand(upsertQuery, conn))
                {
                    cmd.Parameters.AddWithValue("@Streak", streakMoi);
                    cmd.Parameters.AddWithValue("@NgayHocCuoi", homNay);
                    cmd.Parameters.AddWithValue("@MaNguoiDung", maNguoiDung);
                    cmd.ExecuteNonQuery();
                }
            }
        }
        public List<object> GetHoatDongTuan(int maNguoiDung)
        {
            List<object> dsHoatDong = new List<object>();
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                // Logic: 
                // 1. Tìm ngày Thứ 2 của tuần hiện tại
                // 2. Tạo danh sách 7 ngày trong tuần
                // 3. JOIN với dữ liệu học tập
                string query = @"
                    SET DATEFIRST 1; -- Đặt Thứ 2 là ngày đầu tuần
                    DECLARE @DauTuan DATE = DATEADD(day, 1 - DATEPART(weekday, GETDATE()), CAST(GETDATE() AS DATE));

                    WITH DaysOfWeek AS (
                        SELECT @DauTuan AS Ngay, N'Th 2' AS Thu, 1 AS OrderBy
                        UNION ALL SELECT DATEADD(day, 1, @DauTuan), N'Th 3', 2
                        UNION ALL SELECT DATEADD(day, 2, @DauTuan), N'Th 4', 3
                        UNION ALL SELECT DATEADD(day, 3, @DauTuan), N'Th 5', 4
                        UNION ALL SELECT DATEADD(day, 4, @DauTuan), N'Th 6', 5
                        UNION ALL SELECT DATEADD(day, 5, @DauTuan), N'Th 7', 6
                        UNION ALL SELECT DATEADD(day, 6, @DauTuan), N'CN', 7
                    )
                    SELECT 
                        d.Thu,
                        d.Ngay,
                        COUNT(t.MaTuVung) AS SoTu
                    FROM DaysOfWeek d
                    LEFT JOIN TienDoTuVung t ON CAST(t.NgayOnCuoi AS DATE) = d.Ngay 
                                            AND t.MaNguoiDung = @MaNguoiDung 
                                            AND t.DaHoc = 1
                    GROUP BY d.Thu, d.Ngay, d.OrderBy
                    ORDER BY d.OrderBy ASC";

                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@MaNguoiDung", maNguoiDung);
                    conn.Open();
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            dsHoatDong.Add(new
                            {
                                day = reader["Thu"].ToString(), // Trả về "Th 2", "Th 3"...
                                date = Convert.ToDateTime(reader["Ngay"]).ToString("dd/MM"),
                                value = Convert.ToInt32(reader["SoTu"])
                            });
                        }
                    }
                }
            }
            return dsHoatDong;
        }
        public List<object> GetXuHuongDoChinhXac(int maNguoiDung)
        {
            List<object> dsChinhXac = new List<object>();
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                // Lấy 5 kết quả bài kiểm tra gần nhất
                string query = @"
                    SELECT TOP 5 
                        FORMAT(NgayLamBai, 'dd/MM') AS Ngay,
                        ROUND(CAST(SoCauDung AS FLOAT) / CAST(NULLIF(TongSoCau, 0) AS FLOAT) * 100, 0) AS TiLe
                    FROM KetQuaKiemTra
                    WHERE MaNguoiDung = @MaNguoiDung
                    ORDER BY NgayLamBai ASC";

                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@MaNguoiDung", maNguoiDung);
                    conn.Open();
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            dsChinhXac.Add(new
                            {
                                label = reader["Ngay"].ToString(),
                                value = Convert.ToInt32(reader["TiLe"])
                            });
                        }
                    }
                }
            }
            return dsChinhXac;
        }
        public List<object> GetPhanBoHocTap(int maNguoiDung)
        {
            List<object> dsPhanBo = new List<object>();
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query = @"
                    SELECT 
                        c.TenChuDe,
                        COUNT(*) AS SoTu
                    FROM TienDoTuVung t
                    JOIN TuVung v ON t.MaTuVung = v.MaTuVung
                    JOIN BaiHoc b ON v.MaBaiHoc = b.MaBaiHoc
                    JOIN ChuDe c ON b.MaChuDe = c.MaChuDe
                    WHERE t.MaNguoiDung = @MaNguoiDung AND t.DaHoc = 1
                    GROUP BY c.TenChuDe";

                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@MaNguoiDung", maNguoiDung);
                    conn.Open();
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            dsPhanBo.Add(new
                            {
                                name = reader["TenChuDe"].ToString(),
                                value = Convert.ToInt32(reader["SoTu"])
                            });
                        }
                    }
                }
            }
            return dsPhanBo;
        }
        public List<object> GetHoatDongGanDay(int maNguoiDung)
        {
            List<object> dsHoatDong = new List<object>();
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                // Tăng lên TOP 10 để không bị trôi mất các sự kiện quan trọng như hoàn thành thử thách
                string query = @"
                    SELECT TOP 10 * FROM (
                        -- 1. Từ vựng (Phân biệt Học mới và Ôn tập)
                        SELECT 
                            'VOCAB' AS Loai, 
                            CASE WHEN t.SoLanOn = 1 THEN N'Học từ mới: ' + v.TuTiengAnh ELSE N'Ôn tập từ: ' + v.TuTiengAnh END AS NoiDung, 
                            t.NgayOnCuoi AS ThoiGian,
                            CASE WHEN t.SoLanOn = 1 THEN 4 ELSE 3 END AS DiemXP
                        FROM TienDoTuVung t
                        JOIN TuVung v ON t.MaTuVung = v.MaTuVung
                        WHERE t.MaNguoiDung = @MaNguoiDung AND t.DaHoc = 1

                        UNION ALL

                        -- 2. Bài học
                        SELECT 
                            'LESSON' AS Loai, 
                            N'Hoàn thành bài học' AS NoiDung, 
                            NgayHoanThanh AS ThoiGian,
                            20 AS DiemXP
                        FROM TienDoBaiHoc
                        WHERE MaNguoiDung = @MaNguoiDung AND DaHoanThanh = 1
                        
                        UNION ALL

                        -- 3. Bài kiểm tra (Tính XP thực tế)
                        SELECT 
                            'QUIZ' AS Loai, 
                            N'Làm bài kiểm tra (' + CAST(SoCauDung AS NVARCHAR) + '/' + CAST(TongSoCau AS NVARCHAR) + ')' AS NoiDung, 
                            NgayLamBai AS ThoiGian,
                            (SoCauDung * 4 + 20 + (CASE WHEN SoCauDung = TongSoCau AND TongSoCau >= 15 THEN 30 ELSE 0 END)) AS DiemXP
                        FROM KetQuaKiemTra
                        WHERE MaNguoiDung = @MaNguoiDung

                        UNION ALL

                        -- 4. Huy hiệu vĩnh viễn
                        SELECT 
                            'BADGE' AS Loai, 
                            N'Đạt huy hiệu: ' + h.TenHuyHieu AS NoiDung, 
                            n.NgayNhan AS ThoiGian,
                            h.PhanThuongXP AS DiemXP
                        FROM HuyHieuNguoiDung n
                        JOIN HuyHieu h ON n.MaHuyHieu = h.MaHuyHieu
                        WHERE n.MaNguoiDung = @MaNguoiDung

                        UNION ALL

                        -- 5. Thử thách hàng ngày (Mở rộng điều kiện LIKE để chính xác hơn)
                        SELECT 
                            'CHALLENGE' AS Loai, 
                            h.TenHuyHieu AS NoiDung, 
                            t.NgayCapNhatXP AS ThoiGian,
                            h.PhanThuongXP AS DiemXP
                        FROM HuyHieu h
                        CROSS JOIN ThongKeNguoiDung t
                        WHERE t.MaNguoiDung = @MaNguoiDung 
                          AND h.LoaiHuyHieu = 2
                          AND CAST(t.NgayCapNhatXP AS DATE) = CAST(GETDATE() AS DATE)
                          AND (
                              ((h.TenHuyHieu LIKE N'%Học%' OR h.MoTa LIKE N'%Học%') AND (t.DailyChallengeStatus & 1) = 1) OR
                              ((h.TenHuyHieu LIKE N'%Ôn%' OR h.MoTa LIKE N'%Ôn%') AND (t.DailyChallengeStatus & 2) = 2) OR
                              ((h.TenHuyHieu LIKE N'%Quiz%' OR h.TenHuyHieu LIKE N'%Kiểm tra%' OR h.MoTa LIKE N'%Quiz%') AND (t.DailyChallengeStatus & 4) = 4)
                          )

                        UNION ALL

                        -- 6. Thưởng Combo
                        SELECT 
                            'CHALLENGE' AS Loai, 
                            N'Thưởng hoàn thành tất cả thử thách' AS NoiDung, 
                            NgayCapNhatXP AS ThoiGian,
                            50 AS DiemXP
                        FROM ThongKeNguoiDung
                        WHERE MaNguoiDung = @MaNguoiDung 
                          AND (DailyChallengeStatus & 8) = 8
                          AND CAST(NgayCapNhatXP AS DATE) = CAST(GETDATE() AS DATE)
                    ) AS Activities
                    ORDER BY ThoiGian DESC";

                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@MaNguoiDung", maNguoiDung);
                    conn.Open();
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            dsHoatDong.Add(new
                            {
                                type = reader["Loai"].ToString(),
                                title = reader["NoiDung"].ToString(),
                                time = reader["ThoiGian"],
                                xp = Convert.ToInt32(reader["DiemXP"])
                            });
                        }
                    }
                }
            }
            return dsHoatDong;
        }
    }
}

