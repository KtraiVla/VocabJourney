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
        public List<Topic> GetAllTopics()
        {
            List<Topic> danhSachChuDe = new List<Topic>();

            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                // Câu lệnh SELECT đã có đầy đủ AnhMinhHoa và NgayTao
                string query = "SELECT MaChuDe, TenChuDe, MoTa, AnhMinhHoa, NgayTao FROM ChuDe";

                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
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
                                // Đọc giá trị DateTime từ SQL
                                NgayTao = reader["NgayTao"] != DBNull.Value ? Convert.ToDateTime(reader["NgayTao"]) : DateTime.Now
                            });
                        }
                    }
                }
            }
            return danhSachChuDe;
        }
    }

}
