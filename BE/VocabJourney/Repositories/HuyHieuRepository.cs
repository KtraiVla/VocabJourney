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
