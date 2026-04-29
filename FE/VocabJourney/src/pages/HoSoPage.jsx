import Navbar from "../components/common/Navbar.jsx";
import ProfileHeader from "../components/HoSo/ProfileHeader.jsx";
import ProfileStats from "../components/HoSo/ProfileStats.jsx";
import RecentActivities from "../components/HoSo/RecentActivities.jsx";
import RecentBadges from "../components/HoSo/RecentBadges.jsx";
import LearningSetting from "../components/HoSo/LearningSetting.jsx";
import "./HoSoPage.css";
export default function HoSoPage() {
  return (
    <div className="profile-page">
      <Navbar></Navbar>
      <div className="profile-page-content container">
        <ProfileHeader></ProfileHeader>
        <ProfileStats></ProfileStats>

        <div className="profile-bottom-grid">
          <div className="profile-bottom-left">
            <RecentActivities></RecentActivities>
          </div>
          <div className="profile-bottom-right">
            <RecentBadges></RecentBadges>
          </div>
        </div>
        <LearningSetting></LearningSetting>
      </div>
    </div>
  );
}
