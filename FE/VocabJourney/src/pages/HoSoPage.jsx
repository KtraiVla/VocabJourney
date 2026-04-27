import Navbar from "../components/common/Navbar.jsx";
import ProfileHeader from "../components/HoSo/ProfileHeader.jsx";
import ProfileStats from "../components/HoSo/ProfileStats.jsx";

export default function HoSoPage() {
  return (
    <div className="profile-page">
      <Navbar></Navbar>
      <div className="profile-page-content container">
        <ProfileHeader></ProfileHeader>
        <ProfileStats></ProfileStats>
      </div>
    </div>
  );
}
