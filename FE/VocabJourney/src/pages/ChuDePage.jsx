import Navbar from "../components/common/Navbar.jsx";
import TopicHero from "../components/ChuDe/TopicHero.jsx";
import SearchBar from "../components/ChuDe/SearchBar.jsx";
import TopicGird from "../components/ChuDe/TopicGrid.jsx";
import "./ChuDePage.css";

export default function ChuDePage() {
  return (
    <div className="topic-page">
      <Navbar></Navbar>
      <div className="topic-page-body">
        <TopicHero></TopicHero>
        <SearchBar></SearchBar>
        <TopicGird></TopicGird>
      </div>
    </div>
  );
}
