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
                // SQL mới: Tính % dựa trên số từ đã học (DaHoc = 1) trong bảng TienDoTuVung
                string query = @"
                    SELECT b.MaBaiHoc, b.MaChuDe, b.TieuDe, b.MoTa, b.ThuTu,
                           (SELECT COUNT(*) FROM TuVung t WHERE t.MaBaiHoc = b.MaBaiHoc) AS SoTuVung";

                if (maNguoiDung.HasValue)
                {
                    query += @",
                           ISNULL((SELECT DaHoanThanh FROM TienDoBaiHoc WHERE MaNguoiDung = @MaNguoiDung AND MaBaiHoc = b.MaBaiHoc), 0) AS DaHoanThanh,
                           (CAST((SELECT COUNT(*) FROM TienDoTuVung tdtv 
                                  JOIN TuVung tv ON tdtv.MaTuVung = tv.MaTuVung 
                                  WHERE tv.MaBaiHoc = b.MaBaiHoc AND tdtv.MaNguoiDung = @MaNguoiDung AND tdtv.DaHoc = 1) AS FLOAT) 
                            / NULLIF((SELECT COUNT(*) FROM TuVung WHERE MaBaiHoc = b.MaBaiHoc), 0) * 100) AS TienDo";
                }
                else
                {
                    query += ", 0 AS DaHoanThanh, 0 AS TienDo";
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
                            bh.TienDo = reader["TienDo"] != DBNull.Value ? Math.Round(Convert.ToDouble(reader["TienDo"]), 1) : 0;

                            danhSachBaiHoc.Add(bh);
                        }
                    }
                }
            }
            return danhSachBaiHoc;
        }
    }
}