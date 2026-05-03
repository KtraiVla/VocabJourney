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
    }
}