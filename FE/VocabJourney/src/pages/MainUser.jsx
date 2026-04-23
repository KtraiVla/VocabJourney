import Navbar from "../components/common/Navbar.jsx";
import "./MainUser.css";
import HeroBanner from "../components/UserMain/HeroBanner.jsx";
import StatsSection from "../components/UserMain/StatsSection.jsx";
import ContinueCard from "../components/UserMain/ContinueCard.jsx";
import ReviewCard from "../components/UserMain/ReviewCard.jsx";
import ChallengesSection from "../components/UserMain/ChallengeSection.jsx";

function MainUser() {
  return (
    <div className="homeuser-page">
      <Navbar />
      <main className="homeuser-page-content">
        <div className="container">
          <HeroBanner />
          <StatsSection></StatsSection>

          <div className="homeuser-grid">
            {/* bên phải */}
            <div className="homeuser-right">
              <ContinueCard />
              <ReviewCard />
            </div>

            {/* cột bên trái */}
            <aside className="dashboard-sidebar">
              <ChallengesSection></ChallengesSection>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
export default MainUser;
