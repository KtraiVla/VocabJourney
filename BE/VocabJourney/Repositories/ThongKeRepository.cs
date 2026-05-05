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
                            return new ThongKeNguoiDung
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
                                TongTuDaGap = Convert.ToInt32(reader["TongTuDaGap"]),
                                TongQuizDaLam = Convert.ToInt32(reader["TongQuizDaLam"])
                            };
                        }
                    }
                }
            }
            return null;
        }

        public void CongXP(int maNguoiDung, string actionType, int xpGoc = 0)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                conn.Open();

                // 1. Lấy thông tin hiện tại
                string selectQuery = "SELECT DiemKinhNghiem, CapDo, ChuoiNgayHoc, XPHomNay, SoTuOnHomNay, SoTuHocHomNay, SoQuizHomNay, DailyChallengeStatus, NgayCapNhatXP FROM ThongKeNguoiDung WHERE MaNguoiDung = @MaNguoiDung";
                
                int currentXP = 0, currentLevel = 1, currentStreak = 0;
                int xpHomNay = 0, soTuOn = 0, soTuHoc = 0, soQuiz = 0, challengeStatus = 0;
                DateTime? lastUpdateXP = null;
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
                        }
                    }
                }

                // 2. Reset ngày mới
                if (lastUpdateXP.HasValue && lastUpdateXP.Value.Date < DateTime.Today)
                {
                    xpHomNay = 0;
                    soTuOn = 0;
                    soTuHoc = 0;
                    soQuiz = 0;
                    challengeStatus = 0;
                }

                // 3. Tính hệ số Streak
                double multiplier = 1.0;
                if (currentStreak >= 15) multiplier = 1.6;
                else if (currentStreak >= 8) multiplier = 1.4;
                else if (currentStreak >= 4) multiplier = 1.2;

                int xpToAdd = 0;
                int bonusXP = 0;

                // 4. Xử lý từng loại hành động
                switch (actionType.ToUpper())
                {
                    case "LEARN": // Học từ mới
                        xpToAdd = 4; // Học bài mới không nhân streak theo yêu cầu
                        soTuHoc++;
                        if (soTuHoc == 5 && (challengeStatus & 1) == 0) { bonusXP += 20; challengeStatus |= 1; }
                        break;

                    case "REVIEW": // Ôn tập
                        if (soTuOn < 50) 
                        {
                            xpToAdd = (int)(3 * multiplier);
                            soTuOn++;
                            if (soTuOn == 10 && (challengeStatus & 2) == 0) { bonusXP += 30; challengeStatus |= 2; }
                        }
                        break;

                    case "LESSON": // Xong bài học
                        xpToAdd = 20;
                        break;

                    case "QUIZ": // Làm Quiz
                        xpToAdd = (int)(xpGoc * multiplier);
                        soQuiz++;
                        if (soQuiz == 1 && (challengeStatus & 4) == 0) { bonusXP += 40; challengeStatus |= 4; }
                        break;
                }

                // Thưởng Combo hoàn thành cả 3 nhiệm vụ
                if (challengeStatus == 7 && (challengeStatus & 8) == 0)
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
            }
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
    }
}
