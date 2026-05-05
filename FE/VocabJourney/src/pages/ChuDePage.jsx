import React, { useState } from "react";
import Navbar from "../components/common/Navbar.jsx";
import TopicHero from "../components/ChuDe/TopicHero.jsx";
import SearchBar from "../components/ChuDe/SearchBar.jsx";
import TopicGird from "../components/ChuDe/TopicGrid.jsx";
import "./ChuDePage.css";

export default function ChuDePage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="topic-page">
      <Navbar></Navbar>
      <div className="topic-page-body">
        <TopicHero></TopicHero>
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm}></SearchBar>
        <TopicGird searchTerm={searchTerm}></TopicGird>
      </div>
    </div>
  );
}
