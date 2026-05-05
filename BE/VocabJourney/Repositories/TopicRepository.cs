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
                                TienDo = Math.Round(Convert.ToDouble(reader["TienDo"]), 1)
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
                                TienDo = Math.Round(Convert.ToDouble(reader["TienDo"]), 1)
                            };
                        }
                    }
                }
            }
            return null;
        }
    }
}
