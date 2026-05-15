using System;
using System.Collections.Generic;
using Microsoft.Data.SqlClient;
using VocabJourney.Models;

namespace VocabJourney.Repositories
{
    public class HuyHieuRepository
    {
        private readonly string _connectionString;

        public HuyHieuRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        public List<object> GetHuyHieuNguoiDung(int maNguoiDung)
        {
            List<object> dsHuyHieu = new List<object>();
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query = @"
                    SELECT h.MaHuyHieu, h.TenHuyHieu, h.MoTa, h.IconName 
                    FROM HuyHieuNguoiDung hn
                    JOIN HuyHieu h ON hn.MaHuyHieu = h.MaHuyHieu
                    WHERE hn.MaNguoiDung = @MaNguoiDung";

                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@MaNguoiDung", maNguoiDung);
                    conn.Open();
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            dsHuyHieu.Add(new
                            {
                                MaHuyHieu = Convert.ToInt32(reader["MaHuyHieu"]),
                                TenHuyHieu = reader["TenHuyHieu"].ToString(),
                                MoTa = reader["MoTa"].ToString(),
                                IconName = reader["IconName"].ToString()
                            });
                        }
                    }
                }
            }
            return dsHuyHieu;
        }

        public List<object> GetHuyHieuVoiTiendo(int maNguoiDung)
        {
            List<object> dsHuyHieu = new List<object>();
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                conn.Open();

                // 1. Lấy các thông số thống kê của người dùng
                int tongTuDaHoc = 0;
                int streakHienTai = 0;
                int tongBaiKiemTra = 0;

                // Lấy tổng từ đã học
                string sqlVocab = "SELECT COUNT(*) FROM TienDoTuVung WHERE MaNguoiDung = @MaNguoiDung AND DaHoc = 1";
                using (SqlCommand cmd = new SqlCommand(sqlVocab, conn))
                {
                    cmd.Parameters.AddWithValue("@MaNguoiDung", maNguoiDung);
                    tongTuDaHoc = (int)cmd.ExecuteScalar();
                }

                // Lấy streak, bài kiểm tra và số chủ đề đã xong
                int tongBaiHocDaXong = 0;
                int tongChuDeDaXong = 0;
                string sqlStats = @"
                    SELECT 
                        ISNULL((SELECT ChuoiNgayHoc FROM ThongKeNguoiDung WHERE MaNguoiDung = @MaNguoiDung), 0) as ChuoiNgayHoc,
                        ISNULL((SELECT COUNT(*) FROM KetQuaKiemTra WHERE MaNguoiDung = @MaNguoiDung), 0) as TongQuiz,
                        ISNULL((SELECT COUNT(*) FROM TienDoBaiHoc WHERE MaNguoiDung = @MaNguoiDung AND DaHoanThanh = 1), 0) as TongBaiHoc,
                        ISNULL((SELECT COUNT(*) FROM (
                            SELECT b.MaChuDe 
                            FROM BaiHoc b
                            JOIN TienDoBaiHoc t ON b.MaBaiHoc = t.MaBaiHoc
                            WHERE t.MaNguoiDung = @MaNguoiDung AND t.DaHoanThanh = 1
                            GROUP BY b.MaChuDe
                            HAVING COUNT(*) >= (SELECT COUNT(*) FROM BaiHoc WHERE MaChuDe = b.MaChuDe)
                        ) as DoneTopics), 0) as TongChuDe";
                using (SqlCommand cmd = new SqlCommand(sqlStats, conn))
                {
                    cmd.Parameters.AddWithValue("@MaNguoiDung", maNguoiDung);
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            streakHienTai = reader["ChuoiNgayHoc"] != DBNull.Value ? Convert.ToInt32(reader["ChuoiNgayHoc"]) : 0;
                            tongBaiKiemTra = reader["TongQuiz"] != DBNull.Value ? Convert.ToInt32(reader["TongQuiz"]) : 0;
                            tongBaiHocDaXong = reader["TongBaiHoc"] != DBNull.Value ? Convert.ToInt32(reader["TongBaiHoc"]) : 0;
                            tongChuDeDaXong = reader["TongChuDe"] != DBNull.Value ? Convert.ToInt32(reader["TongChuDe"]) : 0;
                        }
                    }
                }

                // 2. Lấy danh sách huy hiệu và tính tiến độ (Chỉ lấy huy hiệu vĩnh viễn LoaiHuyHieu != 2)
                string query = @"
                    SELECT h.MaHuyHieu, h.TenHuyHieu, h.MoTa, h.IconName, h.DieuKien,
                           CAST(CASE WHEN hn.MaNguoiDung IS NOT NULL THEN 1 ELSE 0 END AS BIT) AS DaDatDuoc
                    FROM HuyHieu h
                    LEFT JOIN HuyHieuNguoiDung hn ON h.MaHuyHieu = hn.MaHuyHieu AND hn.MaNguoiDung = @MaNguoiDung
                    WHERE ISNULL(h.LoaiHuyHieu, 1) != 2";

                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@MaNguoiDung", maNguoiDung);
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            int maHuyHieu = Convert.ToInt32(reader["MaHuyHieu"]);
                            string ten = reader["TenHuyHieu"].ToString().ToLower();
                            
                            int currentVal = 0;
                            int targetVal = 100; // Mặc định

                            // Logic phân loại tiến độ thông minh hơn (Kiểm tra cả tên và mô tả)
                            string mota = reader["MoTa"].ToString().ToLower();
                            string searchStr = ten + " " + mota;

                            if (searchStr.Contains("từ vựng") || searchStr.Contains("ngôn ngữ") || searchStr.Contains("từ") || searchStr.Contains("tu")) {
                                currentVal = tongTuDaHoc;
                                targetVal = ExtractNumber(reader["MoTa"].ToString());
                            } else if (searchStr.Contains("streak") || searchStr.Contains("chăm chỉ") || searchStr.Contains("ngày") || searchStr.Contains("ngay")) {
                                currentVal = streakHienTai;
                                targetVal = ExtractNumber(reader["MoTa"].ToString());
                            } else if (searchStr.Contains("kiểm tra") || searchStr.Contains("quiz") || searchStr.Contains("ktr") || searchStr.Contains("trắc nghiệm") || searchStr.Contains("trac nghiem")) {
                                currentVal = tongBaiKiemTra;
                                targetVal = ExtractNumber(reader["MoTa"].ToString());
                            } else if (searchStr.Contains("chủ đề") || searchStr.Contains("chu de")) {
                                currentVal = tongChuDeDaXong;
                                targetVal = ExtractNumber(reader["MoTa"].ToString());
                            } else if (searchStr.Contains("bài học") || searchStr.Contains("bài") || searchStr.Contains("khai phá") || searchStr.Contains("khám phá") || searchStr.Contains("bai") || searchStr.Contains("bách khoa") || searchStr.Contains("bach khoa")) {
                                currentVal = tongBaiHocDaXong;
                                targetVal = ExtractNumber(reader["MoTa"].ToString());
                            }

                            bool daDatDuoc = Convert.ToBoolean(reader["DaDatDuoc"]);
                            
                            // --- LOGIC TỰ ĐỘNG ĐỒNG BỘ ---
                            // Nếu đã đủ tiến độ nhưng chưa có trong bảng HuyHieuNguoiDung
                            if (!daDatDuoc && currentVal >= targetVal && targetVal > 0) {
                                AwardBadgeAutomatically(maNguoiDung, maHuyHieu);
                                daDatDuoc = true; // Cập nhật trạng thái hiển thị ngay
                                currentVal = targetVal; // Ép tiến độ về max
                            }

                            if (daDatDuoc) {
                                currentVal = Math.Max(currentVal, targetVal);
                            }

                            if (targetVal <= 0) targetVal = 1;

                            dsHuyHieu.Add(new
                            {
                                MaHuyHieu = maHuyHieu,
                                TenHuyHieu = reader["TenHuyHieu"].ToString(),
                                MoTa = reader["MoTa"].ToString(),
                                IconName = reader["IconName"].ToString(),
                                DieuKien = reader["DieuKien"] != DBNull.Value ? reader["DieuKien"].ToString() : "",
                                DaDatDuoc = daDatDuoc,
                                CurrentProgress = currentVal,
                                TargetProgress = targetVal,
                                Percentage = Math.Min(100, (int)((float)currentVal / targetVal * 100))
                            });
                        }
                    }
                }
            }
            return dsHuyHieu;
        }

        private void AwardBadgeAutomatically(int maNguoiDung, int maHuyHieu)
        {
            try
            {
                using (SqlConnection conn = new SqlConnection(_connectionString))
                {
                    string query = "IF NOT EXISTS (SELECT 1 FROM HuyHieuNguoiDung WHERE MaNguoiDung = @MaNguoiDung AND MaHuyHieu = @MaHuyHieu) " +
                                   "INSERT INTO HuyHieuNguoiDung (MaNguoiDung, MaHuyHieu, NgayDatDuoc) VALUES (@MaNguoiDung, @MaHuyHieu, GETDATE())";
                    using (SqlCommand cmd = new SqlCommand(query, conn))
                    {
                        cmd.Parameters.AddWithValue("@MaNguoiDung", maNguoiDung);
                        cmd.Parameters.AddWithValue("@MaHuyHieu", maHuyHieu);
                        conn.Open();
                        cmd.ExecuteNonQuery();
                    }
                }
            }
            catch (Exception ex)
            {
                // Ghi log lỗi nếu cần, nhưng không làm gián đoạn luồng chính
                Console.WriteLine("Lỗi tự động trao huy hiệu: " + ex.Message);
            }
        }

        private int ExtractNumber(string text) {
            if (string.IsNullOrEmpty(text)) return 10;
            
            // Loại bỏ dấu chấm/phẩy phân cách hàng nghìn trước khi trích xuất
            string cleanText = text.Replace(".", "").Replace(",", "");
            string resultString = "";
            
            foreach (char c in cleanText) {
                if (char.IsDigit(c)) {
                    resultString += c;
                } else if (resultString.Length > 0) {
                    // Nếu đã tìm thấy số và gặp ký tự khác, dừng lại (để lấy số đầu tiên tìm thấy)
                    break;
                }
            }
            
            int result;
            return int.TryParse(resultString, out result) ? result : 10;
        }
        public List<object> GetAllHuyHieu()
        {
            List<object> list = new List<object>();
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query = "SELECT MaHuyHieu, TenHuyHieu, MoTa, IconName, DieuKien FROM HuyHieu";
                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    conn.Open();
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            list.Add(new {
                                maHuyHieu = Convert.ToInt32(reader["MaHuyHieu"]),
                                tenHuyHieu = reader["TenHuyHieu"].ToString(),
                                moTa = reader["MoTa"].ToString(),
                                iconName = reader["IconName"].ToString(),
                                dieuKien = reader["DieuKien"] != DBNull.Value ? reader["DieuKien"].ToString() : ""
                            });
                        }
                    }
                }
            }
            return list;
        }

        public bool AddHuyHieu(string ten, string moTa, string icon, string dieuKien)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query = "INSERT INTO HuyHieu (TenHuyHieu, MoTa, IconName, DieuKien) VALUES (@Ten, @MoTa, @Icon, @DieuKien)";
                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@Ten", ten);
                    cmd.Parameters.AddWithValue("@MoTa", moTa);
                    cmd.Parameters.AddWithValue("@Icon", icon);
                    cmd.Parameters.AddWithValue("@DieuKien", dieuKien);
                    conn.Open();
                    return cmd.ExecuteNonQuery() > 0;
                }
            }
        }

        public bool UpdateHuyHieu(int id, string ten, string moTa, string icon, string dieuKien)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query = "UPDATE HuyHieu SET TenHuyHieu = @Ten, MoTa = @MoTa, IconName = @Icon, DieuKien = @DieuKien WHERE MaHuyHieu = @Id";
                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@Id", id);
                    cmd.Parameters.AddWithValue("@Ten", ten);
                    cmd.Parameters.AddWithValue("@MoTa", moTa);
                    cmd.Parameters.AddWithValue("@Icon", icon);
                    cmd.Parameters.AddWithValue("@DieuKien", dieuKien);
                    conn.Open();
                    return cmd.ExecuteNonQuery() > 0;
                }
            }
        }

        public bool HasOwners(int badgeId)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query = "SELECT COUNT(1) FROM HuyHieuNguoiDung WHERE MaHuyHieu = @Id";
                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@Id", badgeId);
                    conn.Open();
                    return (int)cmd.ExecuteScalar() > 0;
                }
            }
        }

        public bool DeleteHuyHieu(int id)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query = "DELETE FROM HuyHieu WHERE MaHuyHieu = @Id";
                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@Id", id);
                    conn.Open();
                    return cmd.ExecuteNonQuery() > 0;
                }
            }
        }
    }
}
