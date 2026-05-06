using System;
using System.Collections.Generic;
using Microsoft.Data.SqlClient;
using VocabJourney.Models;
using System.Linq;

namespace VocabJourney.Repositories
{
    public class QuizRepository
    {
        private readonly string _connectionString;

        public QuizRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        public BaiKiemTra GetQuizByBaiHoc(int maBaiHoc)
        {
            BaiKiemTra quiz = null;
            try 
            {
                using (SqlConnection conn = new SqlConnection(_connectionString))
                {
                    conn.Open();
                    // 1. Lấy thông tin bài kiểm tra theo bài học
                    string quizQuery = "SELECT MaBaiKiemTra, MaBaiHoc, TieuDe FROM BaiKiemTra WHERE MaBaiHoc = @MaBaiHoc";
                    using (SqlCommand cmd = new SqlCommand(quizQuery, conn))
                    {
                        cmd.Parameters.AddWithValue("@MaBaiHoc", maBaiHoc);
                        using (SqlDataReader reader = cmd.ExecuteReader())
                        {
                            if (reader.Read())
                            {
                                quiz = new BaiKiemTra
                                {
                                    MaBaiKiemTra = Convert.ToInt32(reader["MaBaiKiemTra"]),
                                    MaBaiHoc = Convert.ToInt32(reader["MaBaiHoc"]),
                                    TieuDe = reader["TieuDe"].ToString()
                                };
                            }
                        }
                    }

                    if (quiz != null)
                    {
                        // 2. Lấy câu hỏi và các đáp án liên quan
                        string qQuery = @"
                            SELECT c.MaCauHoi, c.NoiDungCauHoi, d.NoiDungDapAn, d.LaDapAnDung 
                            FROM CauHoi c
                            JOIN DapAn d ON c.MaCauHoi = d.MaCauHoi
                            WHERE c.MaBaiKiemTra = @MaBaiKiemTra";
                        
                        using (SqlCommand cmd = new SqlCommand(qQuery, conn))
                        {
                            cmd.Parameters.AddWithValue("@MaBaiKiemTra", quiz.MaBaiKiemTra);
                            using (SqlDataReader reader = cmd.ExecuteReader())
                            {
                                while (reader.Read())
                                {
                                    int maCauHoi = Convert.ToInt32(reader["MaCauHoi"]);
                                    var cauHoi = quiz.DanhSachCauHoi.FirstOrDefault(x => x.MaCauHoi == maCauHoi);
                                    
                                    if (cauHoi == null)
                                    {
                                        cauHoi = new CauHoi
                                        {
                                            MaCauHoi = maCauHoi,
                                            MaBaiKiemTra = quiz.MaBaiKiemTra,
                                            NoiDung = reader["NoiDungCauHoi"].ToString()
                                        };
                                        quiz.DanhSachCauHoi.Add(cauHoi);
                                    }
                                    
                                    string noiDungDapAn = reader["NoiDungDapAn"].ToString();
                                    bool laDapAnDung = Convert.ToBoolean(reader["LaDapAnDung"]);
                                    
                                    cauHoi.Options.Add(noiDungDapAn);
                                    if (laDapAnDung)
                                    {
                                        cauHoi.CorrectAnswerIndex = cauHoi.Options.Count - 1;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error in QuizRepository: " + ex.Message);
                throw;
            }
            return quiz;
        }
        public List<object> GetAllQuizzesAdmin()
        {
            List<object> ds = new List<object>();
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query = @"
                    SELECT q.MaBaiKiemTra, q.TieuDe, q.MaBaiHoc, b.TieuDe AS TenBaiHoc,
                           (SELECT COUNT(*) FROM CauHoi WHERE MaBaiKiemTra = q.MaBaiKiemTra) AS SoCauHoi
                    FROM BaiKiemTra q
                    JOIN BaiHoc b ON q.MaBaiHoc = b.MaBaiHoc";
                
                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    conn.Open();
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            ds.Add(new {
                                maBaiKiemTra = Convert.ToInt32(reader["MaBaiKiemTra"]),
                                maBaiHoc = Convert.ToInt32(reader["MaBaiHoc"]),
                                tenBaiHoc = reader["TenBaiHoc"].ToString(),
                                tieuDe = reader["TieuDe"].ToString(),
                                soCauHoi = Convert.ToInt32(reader["SoCauHoi"])
                            });
                        }
                    }
                }
            }
            return ds;
        }

        public bool HasCompletedResults(int quizId)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query = "SELECT COUNT(1) FROM KetQuaKiemTra WHERE MaBaiKiemTra = @Id";
                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@Id", quizId);
                    conn.Open();
                    return (int)cmd.ExecuteScalar() > 0;
                }
            }
        }

        public bool DeleteQuiz(int id)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                conn.Open();
                // Phải xóa đáp án và câu hỏi trước khi xóa bài kiểm tra do ràng buộc khóa ngoại
                string deleteOptions = "DELETE FROM DapAn WHERE MaCauHoi IN (SELECT MaCauHoi FROM CauHoi WHERE MaBaiKiemTra = @Id)";
                string deleteQuestions = "DELETE FROM CauHoi WHERE MaBaiKiemTra = @Id";
                string deleteQuiz = "DELETE FROM BaiKiemTra WHERE MaBaiKiemTra = @Id";
                
                using (var trans = conn.BeginTransaction())
                {
                    try {
                        using (SqlCommand cmd = new SqlCommand(deleteOptions, conn, trans)) {
                            cmd.Parameters.AddWithValue("@Id", id);
                            cmd.ExecuteNonQuery();
                        }
                        using (SqlCommand cmd = new SqlCommand(deleteQuestions, conn, trans)) {
                            cmd.Parameters.AddWithValue("@Id", id);
                            cmd.ExecuteNonQuery();
                        }
                        using (SqlCommand cmd = new SqlCommand(deleteQuiz, conn, trans)) {
                            cmd.Parameters.AddWithValue("@Id", id);
                            cmd.ExecuteNonQuery();
                        }
                        trans.Commit();
                        return true;
                    } catch {
                        trans.Rollback();
                        return false;
                    }
                }
            }
        }
    }
}
