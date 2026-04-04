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
            <div className="how-it-word-step">1</div>
            <h3 className="how-it-word-item-title">Choose Your Goal</h3>
            <p className="how-it-word-item-desc">
              Select your target vocabulary level and topics to create a personalized learning plan.
            </p>
            <img src="../assets/images/step_1.png" alt="" className="how-it-word-image" />
          </div>
          {/* item 2 */}
          <div className="how-it-word-item">
            <div className="how-it-word-step">2</div>
            <h3 className="how-it-word-item-title">Learn & Practice</h3>
            <p className="how-it-word-item-desc">
              Study with flashcards, see images, hear pronunciations, and
              practice with interactive quizzes.
            </p>
            <img src="../assets/images/step_2.png" alt="" className="how-it-word-image" />
          </div>
          {/* item 3 */}
          <div className="how-it-word-item">
            <div className="how-it-word-step">3</div>
            <h3 className="how-it-word-item-title">Track Progress</h3>
            <p className="how-it-word-item-desc">
              Monitor your learning journey with detailed analytics, earn
              achievements, and maintain your daily streak.
            </p>
            <img src="../assets/images/step_3.png" alt="" className="how-it-word-image" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default HowItWord;
