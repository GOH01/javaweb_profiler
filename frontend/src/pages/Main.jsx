import React from 'react';
import Layout from '../components/Layout';

const MainPage = () => {
  return (
    <Layout>
      <div
        className="d-flex flex-column align-items-center justify-content-center text-center"
        style={{
          minHeight: '85vh',
          background: 'linear-gradient(to right, #e0f7fa, #fce4ec)',
          padding: '40px',
          borderRadius: '20px',
          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h1 className="fw-bold display-4 mb-3 text-dark">📊 JavaWeb Profiler</h1>
        <p className="fs-5 text-muted mb-4" style={{ maxWidth: '720px' }}>
          이 웹 애플리케이션은 업로드된 데이터를 분석하여 <strong>Core</strong> 및 <strong>Task</strong> 기준으로 성능을 시각화하고,
          DB에서 저장된 이력을 조회할 수 있는 <span className="text-primary fw-semibold">전문적인 프로파일링 도구</span>입니다.
        </p>

        {/* 📦 기능 카드 섹션 */}
        <div className="row text-start my-5 w-100 justify-content-center">
          <div className="col-md-3 m-2 p-3 bg-white rounded shadow-sm">
            <h5>📤 파일 업로드</h5>
            <p className="text-muted">업로드만 하면 분석 준비 완료!</p>
          </div>
          <div className="col-md-3 m-2 p-3 bg-white rounded shadow-sm">
            <h5>📈 실시간 분석 차트</h5>
            <p className="text-muted">데이터 기반 성능을 시각화!</p>
          </div>
          <div className="col-md-3 m-2 p-3 bg-white rounded shadow-sm">
            <h5>🗂️ DB 이력 관리</h5>
            <p className="text-muted">저장된 분석 데이터를 한눈에!</p>
          </div>
        </div>

        {/* 📌 이동 버튼 */}
        <div className="d-flex gap-4 flex-wrap justify-content-center mb-4">
          <a href="/upload" className="btn btn-outline-primary btn-lg px-4 py-2 shadow-sm">
          📤 파일 업로드
          </a>
          <a href="/chart" className="btn btn-outline-success btn-lg px-4 py-2 shadow-sm">
            📈 차트 분석 보기
          </a>
          <a href="/db" className="btn btn-outline-dark btn-lg px-4 py-2 shadow-sm">
            🗂️ DB 목록 조회
          </a>
        </div>

    
      </div>
    </Layout>
  );
};

export default MainPage;
