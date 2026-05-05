import React, { useState, useEffect } from "react";
import "./TopicGrid.css";
import TopicCard from "./TopicCard";
import topicService from "../../services/topicService";


export default function TopicGird({ searchTerm = "" }) {
  const [chude, setChuDe] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(function () {
    async function fetchTopics() {
      try {
        const maNguoiDung = localStorage.getItem("maNguoiDung");
        const response = await topicService.getAllTopics(maNguoiDung);
        const dataFromDB = response.data;
        const colors = [
          "blue", "yellow", "green", "purple", "pink", 
          "teal", "orange", "indigo", "red", "cyan",
        ];

        const formattedData = dataFromDB.map(function (item, index) {
          return {
            id: item.maChuDe,
            title: item.tenChuDe,
            description: item.moTa,
            image: item.anhMinhHoa,
            lessons: item.soBaiHoc,
            words: item.soTuVung,
            percent: item.tienDo || 0,
            overlay: colors[index % colors.length],
          };
        });
        setChuDe(formattedData);
      } catch (error) {
        console.error("Lỗi khi tải danh sách chủ đề: ", error);
      }
    }
    fetchTopics();
  }, []);

  // reset về trang 1 khi tìm kiếm
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Lọc dữ liệu dựa trên từ khóa tìm kiếm
  const filteredTopics = chude.filter(topic => 
    topic.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const viTriCuoiCung = currentPage * itemsPerPage;
  const viTriDauTien = viTriCuoiCung - itemsPerPage;
  const currentTopics = filteredTopics.slice(viTriDauTien, viTriCuoiCung);
  const tongSoTrang = Math.ceil(filteredTopics.length / itemsPerPage);

  function thayDoiTrang(pageNumber) {
    setCurrentPage(pageNumber);
  }

  function bamNutTruoc() {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  }
  function bamNutSau() {
    if (currentPage < tongSoTrang) {
      setCurrentPage(currentPage + 1);
    }
  }

  const danhSachCacTrang = [];
  for (let i = 1; i <= tongSoTrang; i++) {
    danhSachCacTrang.push(i);
  }

  return (
    <div className="topics-grid-container">
      <div className="topics-grid">
        {currentTopics.length > 0 ? (
          currentTopics.map((topic) => (
            <TopicCard key={topic.id} {...topic} />
          ))
        ) : (
          <div className="no-results" style={{ gridColumn: "1 / -1", textAlign: "center", padding: "40px", color: "#64748b" }}>
            Không tìm thấy chủ đề nào phù hợp với "{searchTerm}"
          </div>
        )}
      </div>

      {tongSoTrang > 1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            marginTop: "30px",
            marginBottom: "20px",
          }}
        >
          <button
            onClick={bamNutTruoc}
            disabled={currentPage === 1}
            style={{
              padding: "8px 16px",
              cursor: currentPage === 1 ? "not-allowed" : "pointer",
            }}
          >
            Trước
          </button>

          {danhSachCacTrang.map(function (page) {
            return (
              <button
                key={page}
                onClick={function () {
                  thayDoiTrang(page);
                }}
                style={{
                  padding: "8px 16px",
                  cursor: "pointer",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  backgroundColor: currentPage === page ? "#007bff" : "white",
                  color: currentPage === page ? "white" : "black",
                }}
              >
                {page}
              </button>
            );
          })}

          <button
            onClick={bamNutSau}
            disabled={currentPage === tongSoTrang}
            style={{
              padding: "8px 16px",
              cursor: currentPage === tongSoTrang ? "not-allowed" : "pointer",
            }}
          >
            Sau
          </button>
        </div>
      )}
    </div>
  );
}
