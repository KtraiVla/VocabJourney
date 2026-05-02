import React from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import "./QuizCard.css";

export default function QuizCard({ question, selectedOption, onSelect, isAnswered }) {
  return (
    <div className="quiz-card">
      <div className="quiz-card-badge">
        <span>{question.type}</span>
      </div>
      
      <h3 className="quiz-question-text">{question.question}</h3>
      
      <div className="quiz-options-list">
        {question.options.map((option, index) => {
          let optionClass = "quiz-option-item";
          const isSelected = selectedOption === index;
          const isCorrect = index === question.correctAnswer;
          
          if (isAnswered) {
            if (isCorrect) {
              optionClass += " correct";
            } else if (isSelected) {
              optionClass += " incorrect";
            } else {
              optionClass += " disabled";
            }
          } else if (isSelected) {
            optionClass += " selected";
          }
          
          return (
            <button 
              key={index}
              className={optionClass}
              onClick={() => onSelect(index)}
              disabled={isAnswered}
            >
              <div className="option-content">
                <span className="option-label">
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="option-text">{option}</span>
              </div>
              
              {isAnswered && isCorrect && (
                <CheckCircle2 className="result-icon correct" size={24} />
              )}
              {isAnswered && isSelected && !isCorrect && (
                <XCircle className="result-icon incorrect" size={24} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
