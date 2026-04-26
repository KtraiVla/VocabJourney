import React from "react";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import { Routes, Route } from "react-router-dom";
import DangKy from "./components/DangKy/DangKy.jsx";
import DangNhap from "./components/DangNhap/DangNhap.jsx";
import MainUser from "./pages/MainUser.jsx";
import ChuDePage from "./pages/ChuDePage.jsx";
import PhanThuongPage from "./pages/PhanThuongPage.jsx";
import TienDoPage from "./pages/TienDoPage.jsx";

import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/dangky" element={<DangKy />}></Route>
      <Route path="/dangnhap" element={<DangNhap />} />
      <Route path="/homeuser" element={<MainUser />} />
      <Route path="/chude" element={<ChuDePage />} />
      <Route path="/phanthuong" element={<PhanThuongPage />} />
      <Route path="/tiendo" element={<TienDoPage />} />
      
    </Routes>
  );
}

export default App;
