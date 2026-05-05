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
          const duLieuDaBienDoi = ketQua.data.map((baihoc, index) => {
            let status = "locked";
            let progress = null;

            if (baihoc.daHoanThanh) {
              status = "completed";
              progress = 100;
            } else if (!foundCurrent) {
              status = "current";
              progress = 0;
              foundCurrent = true;
            }

            return {
              id: baihoc.maBaiHoc,
              title: baihoc.tieuDe,
              description: baihoc.moTa,
              vocabCount: baihoc.soTuVung,
              status: status,
              progress: progress,
            };
          });
          setBaiHoc(duLieuDaBienDoi);
        }
      } catch (error) {
        console.log("Lỗi khi gọi Service: ", error);
      } finally {
        setDangTai(false);
      }
    };
    if (id) {
      fetchBaiHoc();
    }
  }, [id]);

  if (dangTai) return <div className="loading">Đang tải...</div>;

  const lastCompletedIndex = baiHoc.findLastIndex(
    (l) => l.status === "completed",
  );
  const totalNodes = baiHoc.length;
  const activeLineHeight =
    totalNodes > 1 && lastCompletedIndex >= 0
      ? `${(lastCompletedIndex / (totalNodes - 1)) * 100}%`
      : "0%";

  return (
    <div className="lesson-path-container">
      <div className="lesson-path-line">
        <div
          className="lesson-path-line-active"
          style={{ height: activeLineHeight }}
        ></div>
      </div>

      <div className="lesson-items-wrapper">
        {baiHoc.map((baihoc, index) => {
          // Alternate alignment: left, right, left, right
          const alignment = index % 2 === 0 ? "left" : "right";

          return (
            <LessonItem
              key={baihoc.id}
              lessonId={baihoc.id}
              number={index + 1}
              title={baihoc.title}
              description={baihoc.description}
              vocabCount={baihoc.vocabCount}
              status={baihoc.status}
              progress={baihoc.progress}
              alignment={alignment}
            />
          );
        })}
      </div>
    </div>
  );
}
