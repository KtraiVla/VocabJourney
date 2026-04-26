import Navbar from "../components/common/Navbar.jsx";
import ProgressHeader from "../components/TienDo/ProgressHeader.jsx";
import SummaryStats from "../components/TienDo/SummaryStats.jsx";

export default function TienDoPage() {
  return (
    <div className="progress-page">
      <Navbar></Navbar>
      <div className="progress-page-content container">
        <ProgressHeader></ProgressHeader>
        <SummaryStats></SummaryStats>
      </div>
    </div>
  );
}
