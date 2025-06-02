import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [viewType, setViewType] = useState('task');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert('📂 파일을 선택해주세요!');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const uploadRes = await axios.post('http://localhost:5000/upload', formData);
      setStatus('✅ 업로드 성공!');
      console.log(uploadRes.data);

      const analyzeRes = await axios.get('http://localhost:5000/analyze');
      setAnalysis(analyzeRes.data); // { task: {...}, core: {...} }
      console.log('분석 결과:', analyzeRes.data);
    } catch (err) {
      setStatus('❌ 업로드 실패...');
      console.error(err);
    }
  };

  const renderTable = (data) => {
    if (!data) return null;

    return (
      <table className="table table-bordered mt-3">
        <thead className="table-light">
          <tr>
            <th>이름</th>
            <th>Min</th>
            <th>Max</th>
            <th>Avg</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(data).map(([key, value]) => (
            <tr key={key}>
              <td>{key}</td>
              <td>{value.min}</td>
              <td>{value.max}</td>
              <td>{value.avg}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(to right, #f2f2f2, #d6e4ff)',
        padding: '20px',
      }}
    >
      <div
        className="shadow-lg p-5 bg-white rounded"
        style={{ width: '100%', maxWidth: '700px' }}
      >
        <h2 className="text-center mb-4 text-primary fw-bold">📊 JavaWeb Profiler</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="fileInput" className="form-label fw-semibold">데이터 파일 업로드</label>
            <input
              type="file"
              name="file"
              id="fileInput"
              onChange={handleFileChange}
              className="form-control"
            />
          </div>

          <button
            type="submit"
            className="btn btn-success w-100 py-2 fw-bold"
          >
            🚀 업로드
          </button>
        </form>

        {status && (
          <div className="mt-4 alert alert-info text-center" style={{ fontSize: '16px' }}>
            {status}
          </div>
        )}

        {analysis && (
          <div className="mt-5">
            <div className="d-flex justify-content-center gap-3 mb-3">
              <button
                className={`btn ${viewType === 'task' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setViewType('task')}
              >
                📌 Task 기준 보기
              </button>
              <button
                className={`btn ${viewType === 'core' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setViewType('core')}
              >
                ⚙️ Core 기준 보기
              </button>
            </div>

            <h5 className="text-center fw-semibold">
              {viewType === 'task' ? '📋 Task별 분석 결과' : '🧠 Core별 분석 결과'}
            </h5>
            {renderTable(analysis[viewType])}
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
