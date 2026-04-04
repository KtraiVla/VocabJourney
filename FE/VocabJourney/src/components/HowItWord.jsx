import React from "react";
import { Brain } from "lucide-react";
import "./HowItWord.css";

function HowItWord() {
  return (
    <section className="how-it-word">
      <div className="container">
        <div className="how-it-word-header">
          <h2 className="how-it-word-title">How It Word</h2>
          <p className="how-it-word-desc">
            Start your vocabulary journey in three simple steps
          </p>
        </div>
        <div className="how-it-word-list">
          {/* item 1 */}
          <div className="how-it-word-item">
            <div className="how-it-word-">1</div>
            <h3 className="how-it-word-item-title">Spaced Repetition</h3>
            <p className="how-it-word-item-desc">
              Our smart algorithm schedules reviews at the optimal time to
              ensure long-term retention.
            </p>
            <img src="../assets/images/step_1.png" alt="" />
          </div>
          {/* item 2 */}
          <div className="how-it-word-item">
            <div className="how-it-word-">2</div>
            <h3 className="how-it-word-item-title">Learn & Practice</h3>
            <p className="how-it-word-item-desc">
              Study with flashcards, see images, hear pronunciations, and
              practice with interactive quizzes.
            </p>
            <img src="../assets/images/step_2.png" alt="" />
          </div>
          {/* item 3 */}
          <div className="how-it-word-item">
            <div className="how-it-word-">3</div>
            <h3 className="how-it-word-item-title">Track Progress</h3>
            <p className="how-it-word-item-desc">
              Monitor your learning journey with detailed analytics, earn
              achievements, and maintain your daily streak.
            </p>
            <img src="../assets/images/step_3.png" alt="" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default HowItWord;
