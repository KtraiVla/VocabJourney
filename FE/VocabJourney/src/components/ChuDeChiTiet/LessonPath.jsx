import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import LessonItem from "./LessonItem.jsx";
import "./LessonPath.css";
import baihocService from "../../services/baihocService.js";

export default function LessonPath() {
  const { id } = useParams();
  const [baiHoc, setBaiHoc] = useState([]);
  const [dangTai, setDangTai] = useState(true);

  useEffect(() => {
    const fetchBaiHoc = async () => {
      try {
        const maNguoiDung = localStorage.getItem("maNguoiDung");
        const response = await baihocService.getLessonsByTopic(id, maNguoiDung);
        const ketQua = response.data;

        if (ketQua.success) {
          let foundCurrent = false;
          const duLieuDaBienDoi = ketQua.data.map((bh) => {
            let status = "locked";
            if (bh.daHoanThanh) {
              status = "completed";
            } else if (!foundCurrent) {
              status = "current";
              foundCurrent = true;
            }

            return {
              id: bh.maBaiHoc,
              title: bh.tieuDe,
              description: bh.moTa,
              vocabCount: bh.soTuVung,
              status: status,
              progress: bh.tienDo,
            };
          });
          setBaiHoc(duLieuDaBienDoi);
        }
      } catch (error) {
        console.log("Lỗi khi tải bài học: ", error);
      } finally {
        setDangTai(false);
      }
    };
    if (id) fetchBaiHoc();
  }, [id]);

  if (dangTai) return <div className="loading">Đang tải bài học...</div>;

  const lastCompletedIndex = baiHoc.findLastIndex(l => l.status === "completed");
  const activeLineHeight = baiHoc.length > 1 && lastCompletedIndex >= 0
    ? `${(lastCompletedIndex / (baiHoc.length - 1)) * 100}%`
    : "0%";

  return (
    <div className="lesson-path-container">
      <div className="lesson-path-line">
        <div className="lesson-path-line-active" style={{ height: activeLineHeight }}></div>
      </div>

      <div className="lesson-items-wrapper">
        {baiHoc.map((bh, index) => (
          <LessonItem
            key={bh.id}
            lessonId={bh.id}
            number={index + 1}
            title={bh.title}
            description={bh.description}
            vocabCount={bh.vocabCount}
            status={bh.status}
            progress={bh.progress}
            alignment={index % 2 === 0 ? "left" : "right"}
          />
        ))}
      </div>
    </div>
  );
}
