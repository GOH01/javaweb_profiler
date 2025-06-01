import React from 'react';
import Layout from '../components/Layout';

const MainPage = () => {
  return (
    <Layout>
      <div className="text-center p-5">
        <h1 className="fw-bold text-primary">🎉 Welcome to JavaWeb Profiler!</h1>
        <p className="fs-5 mt-3">왼쪽 상단 네비게이션 바를 이용해 기능을 확인해보세요.</p>
      </div>
    </Layout>
  );
};

export default MainPage;
