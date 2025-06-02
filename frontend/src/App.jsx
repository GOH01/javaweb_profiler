// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FileUpload from './pages/FileUpload';
import Main from './pages/Main';  
import ChartPage from './pages/Chart';


const App = () => {
  return (
    <Router>

      <Routes>
        <Route path="/" element={<Main />} />         {/* ✅ 메인 페이지로 대체 */}
        <Route path="/upload" element={<FileUpload />} />
        <Route path="/chart" element={<ChartPage />} /> 
      </Routes>
    </Router>
  );
};

export default App;
