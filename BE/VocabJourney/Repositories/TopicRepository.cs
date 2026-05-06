using System;
using System.Collections.Generic;
using Microsoft.Data.SqlClient;
using VocabJourney.Models;

namespace VocabJourney.Repositories
{
    public class TopicRepository
    {
        private readonly string _connectionString;
        public TopicRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        public List<Topic> GetAllTopics(int? maNguoiDung = null)
        {
            List<Topic> danhSachChuDe = new List<Topic>();

            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                // SQL Logic: Tiến độ chủ đề = (Số bài học đã hoàn thành / Tổng số bài học) * 100
                string query = @"
                    SELECT c.MaChuDe, c.TenChuDe, c.MoTa, c.AnhMinhHoa, c.NgayTao,
                           (SELECT COUNT(*) FROM BaiHoc b WHERE b.MaChuDe = c.MaChuDe) AS SoBaiHoc,
                           (SELECT COUNT(*) FROM TuVung t 
                            JOIN BaiHoc b ON t.MaBaiHoc = b.MaBaiHoc 
                            WHERE b.MaChuDe = c.MaChuDe) AS SoTuVung";

                if (maNguoiDung.HasValue)
                {
                    query += @",
                           (CAST((SELECT COUNT(*) FROM TienDoBaiHoc tdbh 
                                  JOIN BaiHoc bh ON tdbh.MaBaiHoc = bh.MaBaiHoc 
                                  WHERE bh.MaChuDe = c.MaChuDe AND tdbh.MaNguoiDung = @MaNguoiDung AND tdbh.DaHoanThanh = 1) AS FLOAT) 
                            / NULLIF((SELECT COUNT(*) FROM BaiHoc WHERE MaChuDe = c.MaChuDe), 0) * 100) AS TienDo";
                }
                else
                {
                    query += ", 0 AS TienDo";
                }

                query += " FROM ChuDe c";

                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    if (maNguoiDung.HasValue)
                    {
                        cmd.Parameters.AddWithValue("@MaNguoiDung", maNguoiDung.Value);
                    }

                    conn.Open();
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            danhSachChuDe.Add(new Topic
                            {
                                MaChuDe = Convert.ToInt32(reader["MaChuDe"]),
                                TenChuDe = reader["TenChuDe"].ToString(),
                                MoTa = reader["MoTa"].ToString(),
                                AnhMinhHoa = reader["AnhMinhHoa"] != DBNull.Value ? reader["AnhMinhHoa"].ToString() : "",
                                NgayTao = reader["NgayTao"] != DBNull.Value ? Convert.ToDateTime(reader["NgayTao"]) : DateTime.Now,
                                SoBaiHoc = Convert.ToInt32(reader["SoBaiHoc"]),
                                SoTuVung = Convert.ToInt32(reader["SoTuVung"]),
                                TienDo = reader["TienDo"] != DBNull.Value ? Math.Round(Convert.ToDouble(reader["TienDo"]), 0) : 0
                            });
                        }
                    }
                }
            }
            return danhSachChuDe;
        }

        public Topic GetTopicById(int id, int? maNguoiDung = null)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query = @"
                    SELECT c.MaChuDe, c.TenChuDe, c.MoTa, c.AnhMinhHoa, c.NgayTao,
                           (SELECT COUNT(*) FROM BaiHoc b WHERE b.MaChuDe = c.MaChuDe) AS SoBaiHoc,
                           (SELECT COUNT(*) FROM TuVung t 
                            JOIN BaiHoc b ON t.MaBaiHoc = b.MaBaiHoc 
                            WHERE b.MaChuDe = c.MaChuDe) AS SoTuVung";
                
                if (maNguoiDung.HasValue)
                {
                    query += @",
                           (CAST((SELECT COUNT(*) FROM TienDoBaiHoc tdbh 
                                  JOIN BaiHoc bh ON tdbh.MaBaiHoc = bh.MaBaiHoc 
                                  WHERE bh.MaChuDe = c.MaChuDe AND tdbh.MaNguoiDung = @MaNguoiDung AND tdbh.DaHoanThanh = 1) AS FLOAT) 
                            / NULLIF((SELECT COUNT(*) FROM BaiHoc WHERE MaChuDe = c.MaChuDe), 0) * 100) AS TienDo";
                }
                else
                {
                    query += ", 0 AS TienDo";
                }

                query += " FROM ChuDe c WHERE c.MaChuDe = @Id";

                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@Id", id);
                    if (maNguoiDung.HasValue)
                    {
                        cmd.Parameters.AddWithValue("@MaNguoiDung", maNguoiDung.Value);
                    }

                    conn.Open();
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            return new Topic
                            {
                                MaChuDe = Convert.ToInt32(reader["MaChuDe"]),
                                TenChuDe = reader["TenChuDe"].ToString(),
                                MoTa = reader["MoTa"].ToString(),
                                AnhMinhHoa = reader["AnhMinhHoa"] != DBNull.Value ? reader["AnhMinhHoa"].ToString() : "",
                                NgayTao = reader["NgayTao"] != DBNull.Value ? Convert.ToDateTime(reader["NgayTao"]) : DateTime.Now,
                                SoBaiHoc = Convert.ToInt32(reader["SoBaiHoc"]),
                                SoTuVung = Convert.ToInt32(reader["SoTuVung"]),
                                TienDo = reader["TienDo"] != DBNull.Value ? Math.Round(Convert.ToDouble(reader["TienDo"]), 0) : 0
                            };
                        }
                    }
                }
            }
            return null;
        }

        public bool AddTopic(Topic topic)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query = "INSERT INTO ChuDe (TenChuDe, MoTa, AnhMinhHoa, NgayTao) VALUES (@Ten, @MoTa, @Anh, GETDATE())";
                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@Ten", topic.TenChuDe);
                    cmd.Parameters.AddWithValue("@MoTa", topic.MoTa);
                    cmd.Parameters.AddWithValue("@Anh", (object)topic.AnhMinhHoa ?? DBNull.Value);
                    conn.Open();
                    return cmd.ExecuteNonQuery() > 0;
                }
            }
        }

        public bool UpdateTopic(Topic topic)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query = "UPDATE ChuDe SET TenChuDe = @Ten, MoTa = @MoTa, AnhMinhHoa = @Anh WHERE MaChuDe = @Id";
                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@Id", topic.MaChuDe);
                    cmd.Parameters.AddWithValue("@Ten", topic.TenChuDe);
                    cmd.Parameters.AddWithValue("@MoTa", topic.MoTa);
                    cmd.Parameters.AddWithValue("@Anh", (object)topic.AnhMinhHoa ?? DBNull.Value);
                    conn.Open();
                    return cmd.ExecuteNonQuery() > 0;
                }
            }
        }

        public bool DeleteTopic(int id)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query = "DELETE FROM ChuDe WHERE MaChuDe = @Id";
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
