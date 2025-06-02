import React from 'react';
import Header from './Header';

const Layout = ({ children }) => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <main
        className="flex-grow-1"
        style={{
          background: 'linear-gradient(to right, #f2f2f2, #d6e4ff)',
          padding: 0,
          margin: 0,
        }}
      >
        {children}
      </main>
      <footer className="text-center text-muted py-3 border-top">
        Made by Team LeGend |  ❤️ We Love Kang ❤️   | GitHub: <a href="https://github.com/GOH01/javaweb_profiler.git" target="_blank" rel="noopener noreferrer">프로젝트 링크</a>
      </footer>
    </div>
  );
};

export default Layout;
