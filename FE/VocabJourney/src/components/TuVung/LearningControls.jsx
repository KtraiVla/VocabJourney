import React from "react";
import { X, Check } from "lucide-react";
import "./LearningControls.css";

export default function LearningControls({ onNext }) {
  return (
    <div className="learning-controls">
      {/* Nút Chưa nhớ */}
      <button 
        className="control-btn btn-forgot"
        onClick={() => onNext("forgot")}
      >
        <X size={20} strokeWidth={3} />
        <span>Chưa nhớ</span>
      </button>

      {/* Nút Đã nhớ! */}
      <button 
        className="control-btn btn-remembered"
        onClick={() => onNext("remembered")}
      >
        <Check size={20} strokeWidth={3} />
        <span>Đã nhớ!</span>
      </button>
    </div>
  );
}
