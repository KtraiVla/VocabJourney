import React, { useState, useEffect } from "react";
import "./TopicGrid.css";
import TopicCard from "./TopicCard";
import topicService from "../../services/topicService";


export default function TopicGird() {
  const [chude, setChuDe] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  useEffect(function () {
    async function fetchTopics() {
      try {
        const response = await topicService.getAllTopics();
        const dataFromDB = response.data;
        const colors = [
          "blue",
          "yellow",
          "green",
          "purple",
          "pink",
          "teal",
          "orange",
          "indigo",
          "red",
          "cyan",
        ];

        const formattedData = dataFromDB.map(function (item, index) {
          return {
            id: item.maChuDe,
            title: item.tenChuDe,
            description: item.moTa,
            image: item.anhMinhHoa,
            lessons: Math.floor(Math.random() * 5) + 5,
            words: Math.floor(Math.random() * 50) + 50,
            percent: Math.floor(Math.random() * 100),
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

  const viTriCuoiCung = currentPage * itemsPerPage;
  const viTriDauTien = viTriCuoiCung - itemsPerPage;
  const currentTopics = chude.slice(viTriDauTien, viTriCuoiCung);
  const tongSoTrang = Math.ceil(chude.length / itemsPerPage);

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
        {currentTopics.map((topic, index) => (
          <TopicCard key={topic.id} {...topic} />
        ))}
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
          {/* Nút Trước (Gọi thẳng hàm bamNutTruoc) */}
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

          {/* Lặp qua danh sách [1, 2...] để vẽ nút bấm số */}
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

          {/* Nút Sau (Gọi thẳng hàm bamNutSau) */}
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
