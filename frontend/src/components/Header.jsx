// src/components/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4 py-2">
      <Link className="navbar-brand fw-bold fs-4" to="/">📂 JavaWeb Profiler</Link>
      <ul className="navbar-nav d-flex flex-row gap-4 ms-auto">
        <li className="nav-item">
          <Link className="nav-link text-white" to="/">🏠 홈</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link text-white" to="/upload">📁 파일 업로드</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link text-white" to="/chart">📊 차트 보기</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link text-white" to="/db">📋 DB 목록</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Header;
