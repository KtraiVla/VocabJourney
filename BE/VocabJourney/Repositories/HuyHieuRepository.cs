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
    }
}
