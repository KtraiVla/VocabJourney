using System;
using System.Collections.Generic;

namespace VocabJourney.Models
{
    public class CauHoi
    {
        public int MaCauHoi { get; set; }
        public int MaBaiKiemTra { get; set; }
        public string NoiDung { get; set; } = string.Empty;
        public List<string> Options { get; set; } = new List<string>();
        public int CorrectAnswerIndex { get; set; }
    }
}
