using System;
using System.Collections.Generic;
using Microsoft.Data.SqlClient;
using VocabJourney.Models;

namespace VocabJourney.Repositories
{
    public class BaiHocRepository
    {
        private readonly string _connectionString;

        public BaiHocRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        public List<BaiHoc> GetDanhSachBaiHoc(int maChuDe, int? maNguoiDung = null)
        {
            List<BaiHoc> danhSachBaiHoc = new List<BaiHoc>();

            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                // SQL: Ưu tiên DaHoanThanh trong bảng TienDoBaiHoc. Nếu đã xong thì ép 100%.
                string query = @"
                    SELECT b.MaBaiHoc, b.MaChuDe, b.TieuDe, b.MoTa, b.ThuTu,
                           (SELECT COUNT(*) FROM TuVung t WHERE t.MaBaiHoc = b.MaBaiHoc) AS SoTuVung";

                if (maNguoiDung.HasValue)
                {
                    query += @",
                           ISNULL((SELECT DaHoanThanh FROM TienDoBaiHoc WHERE MaNguoiDung = @MaNguoiDung AND MaBaiHoc = b.MaBaiHoc), 0) AS DaHoanThanh,
                           CASE 
                                WHEN EXISTS (SELECT 1 FROM TienDoBaiHoc WHERE MaNguoiDung = @MaNguoiDung AND MaBaiHoc = b.MaBaiHoc AND DaHoanThanh = 1) THEN 100
                                ELSE (CAST((SELECT COUNT(*) FROM TienDoTuVung tdtv 
                                           JOIN TuVung tv ON tdtv.MaTuVung = tv.MaTuVung 
                                           WHERE tv.MaBaiHoc = b.MaBaiHoc AND tdtv.MaNguoiDung = @MaNguoiDung AND tdtv.DaHoc = 1) AS FLOAT) 
                                      / NULLIF((SELECT COUNT(*) FROM TuVung WHERE MaBaiHoc = b.MaBaiHoc), 0) * 100)
                           END AS TienDo,
                           (SELECT MaBaiKiemTra FROM BaiKiemTra WHERE MaBaiHoc = b.MaBaiHoc) AS MaBaiKiemTra,
                           CAST(CASE WHEN EXISTS (SELECT 1 FROM KetQuaKiemTra kq JOIN BaiKiemTra bk ON kq.MaBaiKiemTra = bk.MaBaiKiemTra WHERE bk.MaBaiHoc = b.MaBaiHoc AND kq.MaNguoiDung = @MaNguoiDung) THEN 1 ELSE 0 END AS BIT) AS QuizHoanThanh";
                }
                else
                {
                    query += ", 0 AS DaHoanThanh, 0 AS TienDo, NULL AS MaBaiKiemTra, 0 AS QuizHoanThanh";
                }

                query += @"
                    FROM BaiHoc b
                    WHERE b.MaChuDe = @MaChuDe 
                    ORDER BY b.ThuTu ASC";

                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@MaChuDe", maChuDe);
                    if (maNguoiDung.HasValue)
                    {
                        cmd.Parameters.AddWithValue("@MaNguoiDung", maNguoiDung.Value);
                    }

                    conn.Open();
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            BaiHoc bh = new BaiHoc();
                            bh.MaBaiHoc = Convert.ToInt32(reader["MaBaiHoc"]);
                            bh.MaChuDe = Convert.ToInt32(reader["MaChuDe"]);
                            bh.TieuDe = reader["TieuDe"].ToString();
                            bh.MoTa = reader["MoTa"] != DBNull.Value ? reader["MoTa"].ToString() : "";
                            bh.ThuTu = reader["ThuTu"] != DBNull.Value ? Convert.ToInt32(reader["ThuTu"]) : 0;
                            bh.SoTuVung = reader["SoTuVung"] != DBNull.Value ? Convert.ToInt32(reader["SoTuVung"]) : 0;
                            bh.DaHoanThanh = Convert.ToBoolean(reader["DaHoanThanh"]);
                            bh.TienDo = reader["TienDo"] != DBNull.Value ? Math.Round(Convert.ToDouble(reader["TienDo"]), 0) : 0;
                            bh.MaBaiKiemTra = reader["MaBaiKiemTra"] != DBNull.Value ? Convert.ToInt32(reader["MaBaiKiemTra"]) : (int?)null;
                            bh.QuizHoanThanh = Convert.ToBoolean(reader["QuizHoanThanh"]);

                            danhSachBaiHoc.Add(bh);
                        }
                    }
                }
            }
            return danhSachBaiHoc;
        }
        public List<object> GetAllBaiHocAdmin()
        {
            List<object> ds = new List<object>();
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query = @"
                    SELECT b.MaBaiHoc, b.TieuDe, b.MoTa, b.ThuTu, b.MaChuDe, c.TenChuDe,
                           (SELECT COUNT(*) FROM TuVung WHERE MaBaiHoc = b.MaBaiHoc) AS SoTuVung
                    FROM BaiHoc b
                    JOIN ChuDe c ON b.MaChuDe = c.MaChuDe
                    ORDER BY c.TenChuDe, b.ThuTu";
                
                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    conn.Open();
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            ds.Add(new {
                                maBaiHoc = Convert.ToInt32(reader["MaBaiHoc"]),
                                tieuDe = reader["TieuDe"].ToString(),
                                moTa = reader["MoTa"].ToString(),
                                thuTu = Convert.ToInt32(reader["ThuTu"]),
                                maChuDe = Convert.ToInt32(reader["MaChuDe"]),
                                tenChuDe = reader["TenChuDe"].ToString(),
                                soTuVung = Convert.ToInt32(reader["SoTuVung"])
                            });
                        }
                    }
                }
            }
            return ds;
        }

        public bool AddBaiHoc(BaiHoc bh)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query = "INSERT INTO BaiHoc (MaChuDe, TieuDe, MoTa, ThuTu) VALUES (@MaChuDe, @TieuDe, @MoTa, @ThuTu)";
                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@MaChuDe", bh.MaChuDe);
                    cmd.Parameters.AddWithValue("@TieuDe", bh.TieuDe);
                    cmd.Parameters.AddWithValue("@MoTa", (object)bh.MoTa ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@ThuTu", bh.ThuTu);
                    conn.Open();
                    return cmd.ExecuteNonQuery() > 0;
                }
            }
        }

        public bool UpdateBaiHoc(BaiHoc bh)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query = "UPDATE BaiHoc SET MaChuDe = @MaChuDe, TieuDe = @TieuDe, MoTa = @MoTa, ThuTu = @ThuTu WHERE MaBaiHoc = @Id";
                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@Id", bh.MaBaiHoc);
                    cmd.Parameters.AddWithValue("@MaChuDe", bh.MaChuDe);
                    cmd.Parameters.AddWithValue("@TieuDe", bh.TieuDe);
                    cmd.Parameters.AddWithValue("@MoTa", (object)bh.MoTa ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@ThuTu", bh.ThuTu);
                    conn.Open();
                    return cmd.ExecuteNonQuery() > 0;
                }
            }
        }

        public bool HasVocab(int lessonId)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query = "SELECT COUNT(1) FROM TuVung WHERE MaBaiHoc = @Id";
                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@Id", lessonId);
                    conn.Open();
                    return (int)cmd.ExecuteScalar() > 0;
                }
            }
        }

        public bool HasQuiz(int lessonId)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query = "SELECT COUNT(1) FROM BaiKiemTra WHERE MaBaiHoc = @Id";
                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@Id", lessonId);
                    conn.Open();
                    return (int)cmd.ExecuteScalar() > 0;
                }
            }
        }

        public BaiHoc GetBaiHocById(int id)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query = "SELECT MaBaiHoc, MaChuDe, TieuDe, MoTa, ThuTu FROM BaiHoc WHERE MaBaiHoc = @Id";
                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@Id", id);
                    conn.Open();
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            return new BaiHoc
                            {
                                MaBaiHoc = Convert.ToInt32(reader["MaBaiHoc"]),
                                MaChuDe = Convert.ToInt32(reader["MaChuDe"]),
                                TieuDe = reader["TieuDe"].ToString(),
                                MoTa = reader["MoTa"] != DBNull.Value ? reader["MoTa"].ToString() : "",
                                ThuTu = Convert.ToInt32(reader["ThuTu"])
                            };
                        }
                    }
                }
            }
            return null;
        }

        public bool DeleteBaiHoc(int id)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query = "DELETE FROM BaiHoc WHERE MaBaiHoc = @Id";
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