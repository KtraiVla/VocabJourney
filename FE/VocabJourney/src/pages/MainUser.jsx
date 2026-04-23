import Navbar from "../components/common/Navbar.jsx";
import HeroBanner from "../components/UserMain/HeroBanner.jsx";
import StatsSection from "../components/UserMain/StatsSection.jsx";
import ContinueCard from "../components/UserMain/ContinueCard.jsx";

function MainUser() {
  return (
    <>
      <Navbar></Navbar>
      <HeroBanner></HeroBanner>
      <div className="main-user-body">
        <StatsSection></StatsSection>
        <div className="main-user-ontap">
            {/* bên trái  */}
            <div className="main-user-ontap-right">
                <ContinueCard></ContinueCard>
            
            </div>
            
            
            
            </div>
      </div>
    </>
  );
}
export default MainUser;
