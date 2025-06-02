import React from 'react';
import Header from './Header';

const Layout = ({ children }) => {
  return (
    <>
      <Header />
      <div style={{       minHeight: '100vh',
      background: 'linear-gradient(to right, #f2f2f2, #d6e4ff)',
      margin: 0,
      padding: 0,
}}>
        {children}
      </div>
    </>
  );
};

export default Layout;
