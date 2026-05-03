using System;
using System.Collections.Generic;
using Microsoft.Data.SqlClient;
using VocabJourney.Models;

namespace VocabJourney.Repositories
{
    public class BaiHocRepository
    {
        private readonly string _connectionString;

        // Viết chính xác theo cách cậu yêu cầu
        public BaiHocRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        public List<BaiHoc> GetDanhSachBaiHoc(int maChuDe)
        {
            List<BaiHoc> danhSachBaiHoc = new List<BaiHoc>();

            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query = @"
                    SELECT MaBaiHoc, MaChuDe, TieuDe, MoTa, ThuTu 
                    FROM BaiHoc 
                    WHERE MaChuDe = @MaChuDe 
                    ORDER BY ThuTu ASC";

                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@MaChuDe", maChuDe);

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

                            danhSachBaiHoc.Add(bh);
                        }
                    }
                }
            }
            return danhSachBaiHoc;
        }
    }
}