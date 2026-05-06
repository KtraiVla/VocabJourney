using System;
using System.Collections.Generic;
using Microsoft.Data.SqlClient;
using VocabJourney.Models;

namespace VocabJourney.Repositories
{
    public class TuVungRepository
    {
        // 1. Khai báo biến chứa chuỗi kết nối
        private readonly string _connectionString;

        // 2. Constructor nhận chuỗi kết nối từ Controller truyền vào (y hệt cách cậu làm)
        public TuVungRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        // 3. Hàm lấy từ vựng
        public List<TuVung> GetTuVungByBaiHoc(int maBaiHoc)
        {
            List<TuVung> list = new List<TuVung>();
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query = @"
                    SELECT MaTuVung, TuTiengAnh, NghiaTiengViet, PhienAm, 
                           AnhMinhHoa, DinhNghia, DoKho, ViDu
                    FROM TuVung 
                    WHERE MaBaiHoc = @MaBaiHoc";

                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@MaBaiHoc", maBaiHoc);
                    conn.Open();
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            TuVung tu = new TuVung();
                            tu.MaTuVung = Convert.ToInt32(reader["MaTuVung"]);
                            tu.TuTiengAnh = reader["TuTiengAnh"].ToString();
                            tu.NghiaTiengViet = reader["NghiaTiengViet"].ToString();

                            // Xử lý các cột có thể NULL
                            tu.PhienAm = reader["PhienAm"] != DBNull.Value ? reader["PhienAm"].ToString() : "";
                            tu.AnhMinhHoa = reader["AnhMinhHoa"] != DBNull.Value ? reader["AnhMinhHoa"].ToString() : ""; // Đã bổ sung dòng này
                            tu.DinhNghia = reader["DinhNghia"] != DBNull.Value ? reader["DinhNghia"].ToString() : "";
                            tu.ViDu = reader["ViDu"] != DBNull.Value ? reader["ViDu"].ToString() : "";
                            tu.DoKho = reader["DoKho"] != DBNull.Value ? Convert.ToInt32(reader["DoKho"]) : 1;

                            list.Add(tu);
                        }
                    }
                }
            }
            return list;
        }
        public List<object> GetAllTuVungAdmin()
        {
            List<object> ds = new List<object>();
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query = @"
                    SELECT v.MaTuVung, v.MaBaiHoc, v.TuTiengAnh, v.NghiaTiengViet,
                           v.PhienAm, v.AnhMinhHoa, v.DinhNghia, v.DoKho, v.ViDu,
                           b.TieuDe AS TenBaiHoc 
                    FROM TuVung v
                    JOIN BaiHoc b ON v.MaBaiHoc = b.MaBaiHoc
                    ORDER BY v.MaTuVung DESC";
                
                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    conn.Open();
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            ds.Add(new {
                                maTuVung = Convert.ToInt32(reader["MaTuVung"]),
                                maBaiHoc = Convert.ToInt32(reader["MaBaiHoc"]),
                                tenBaiHoc = reader["TenBaiHoc"].ToString(),
                                tuTiengAnh = reader["TuTiengAnh"].ToString(),
                                nghiaTiengViet = reader["NghiaTiengViet"].ToString(),
                                phienAm = reader["PhienAm"] != DBNull.Value ? reader["PhienAm"].ToString() : "",
                                anhMinhHoa = reader["AnhMinhHoa"] != DBNull.Value ? reader["AnhMinhHoa"].ToString() : "",
                                dinhNghia = reader["DinhNghia"] != DBNull.Value ? reader["DinhNghia"].ToString() : "",
                                doKho = reader["DoKho"] != DBNull.Value ? Convert.ToInt32(reader["DoKho"]) : 1,
                                viDu = reader["ViDu"] != DBNull.Value ? reader["ViDu"].ToString() : ""
                            });
                        }
                    }
                }
            }
            return ds;
        }

        public bool AddTuVung(TuVung tu)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query = @"INSERT INTO TuVung (MaBaiHoc, TuTiengAnh, NghiaTiengViet, PhienAm, AnhMinhHoa, DinhNghia, DoKho, ViDu) 
                                 VALUES (@MaBaiHoc, @Tu, @Nghia, @PhienAm, @Anh, @DinhNghia, @DoKho, @ViDu)";
                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@MaBaiHoc", tu.MaBaiHoc);
                    cmd.Parameters.AddWithValue("@Tu", tu.TuTiengAnh);
                    cmd.Parameters.AddWithValue("@Nghia", tu.NghiaTiengViet);
                    cmd.Parameters.AddWithValue("@PhienAm", (object)tu.PhienAm ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@Anh", (object)tu.AnhMinhHoa ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@DinhNghia", (object)tu.DinhNghia ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@DoKho", tu.DoKho);
                    cmd.Parameters.AddWithValue("@ViDu", (object)tu.ViDu ?? DBNull.Value);
                    conn.Open();
                    return cmd.ExecuteNonQuery() > 0;
                }
            }
        }

        public bool UpdateTuVung(TuVung tu)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query = @"UPDATE TuVung SET MaBaiHoc = @MaBaiHoc, TuTiengAnh = @Tu, NghiaTiengViet = @Nghia, 
                                 PhienAm = @PhienAm, AnhMinhHoa = @Anh, DinhNghia = @DinhNghia, DoKho = @DoKho, ViDu = @ViDu 
                                 WHERE MaTuVung = @Id";
                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@Id", tu.MaTuVung);
                    cmd.Parameters.AddWithValue("@MaBaiHoc", tu.MaBaiHoc);
                    cmd.Parameters.AddWithValue("@Tu", tu.TuTiengAnh);
                    cmd.Parameters.AddWithValue("@Nghia", tu.NghiaTiengViet);
                    cmd.Parameters.AddWithValue("@PhienAm", (object)tu.PhienAm ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@Anh", (object)tu.AnhMinhHoa ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@DinhNghia", (object)tu.DinhNghia ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@DoKho", tu.DoKho);
                    cmd.Parameters.AddWithValue("@ViDu", (object)tu.ViDu ?? DBNull.Value);
                    conn.Open();
                    return cmd.ExecuteNonQuery() > 0;
                }
            }
        }

        public bool DeleteTuVung(int id)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query = "DELETE FROM TuVung WHERE MaTuVung = @Id";
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