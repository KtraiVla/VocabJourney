import Navbar from "../components/common/Navbar.jsx";
import "./MainUser.css";
import HeroBanner from "../components/UserMain/HeroBanner.jsx";
import StatsSection from "../components/UserMain/StatsSection.jsx";
import ContinueCard from "../components/UserMain/ContinueCard.jsx";
import ReviewCard from "../components/UserMain/ReviewCard.jsx";
import ChallengesSection from "../components/UserMain/ChallengeSection.jsx";
import TopicsSection from "../components/UserMain/TopicSection.jsx";
import WhyChooseUs from "../components/UserMain/WhyChooseUs.jsx";
import ThanhTich from "../components/UserMain/ThanhTich.jsx";
import Quote from "../components/UserMain/Quote.jsx";
import CongDong from "../components/UserMain/CongDong.jsx";

function MainUser() {
  return (
    <div className="homeuser-page">
      <Navbar />
      <main className="homeuser-page-content">
        <HeroBanner />
        <StatsSection></StatsSection>

        <div className="container">
          <div className="homeuser-grid">
            {/* bên phải */}
            <div className="homeuser-right">
              <ContinueCard />
              <ReviewCard />
              <TopicsSection></TopicsSection>
              <WhyChooseUs />
            </div>

            {/* cột bên trái */}
            <aside className="dashboard-sidebar">
              <ChallengesSection></ChallengesSection>
              <ThanhTich></ThanhTich>
              <Quote></Quote>
              <CongDong></CongDong>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
export default MainUser;
