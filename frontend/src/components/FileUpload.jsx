import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const FileUpload = () => {
  const [file, setFile] = useState(null); // 초기값 null로
  const [status, setStatus] = useState('');
  const [message, setMessage] = useState('');
  const [analysis, setAnalysis] = useState([]); // 초기값 빈 배열
  

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert('📂 파일을 선택해주세요!');

    const formData = new FormData();
    formData.append('file', file);

    try {
      // 업로드 요청
      const uploadRes = await axios.post(
        'http://localhost:3001/api/profile/uploadExcel',
        formData
      );
      const { table, status, message } = uploadRes.data;
      console.log(uploadRes.data);
      setMessage(message);
      setStatus(status);

      if(status !== 'success'){
        return;
      }

      const tableName = uploadRes.data.table;

      // 분석 요청
      const analyzeRes = await axios.get(
        `http://localhost:3001/api/profile/analyze/${tableName}`
      );
      
      // LocalStorage에 저장
      localStorage.setItem('uploadedTableName', tableName);
      console.log('로컬스토리지에 저장됨:', tableName);
      setAnalysis(analyzeRes.data);
      console.log('분석 결과:', analyzeRes.data);
    } catch (err) {
      setStatus('❌ 업로드 실패...');
      console.error(err);
    }
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
        style={{ width: '100%', maxWidth: '600px' }}
      >
        <h2 className="text-center mb-4 text-primary fw-bold">📊 JavaWeb Profiler</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4" style={{textAlign: 'center'}}>
            <label htmlFor="fileInput" className="form-label fw-semibold">
              데이터 파일 업로드
            </label>
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
            style={{
              fontSize: '18px',
              borderRadius: '10px',
              boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
              transition: '0.2s',
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = '#218838')
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = '#28a745')
            }
          >
            🚀 업로드
          </button>
        </form>

        {status && (
          <div className="mt-4 alert alert-info text-center" style={{ fontSize: '16px' }}>
            {message}
          </div>
        )}

        {/* 분석 결과 출력: 배열이 비어있지 않을 때만 */}
        {analysis.coreStats && analysis.coreStats.length > 0 && (
  <div className="mt-5">
    <h4 className="text-center mb-3 fw-semibold">🧠 Core 분석 결과</h4>
    <table className="table table-bordered">
      <thead className="table-secondary">
        <tr>
          {Object.keys(analysis.coreStats[0]).map((key, idx) => (
            <th key={idx}>{key}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {analysis.coreStats.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {Object.values(row).map((val, colIndex) => (
              <td key={colIndex}>{val}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}

{analysis.taskStats && analysis.taskStats.length > 0 && (
  <div className="mt-5">
    <h4 className="text-center mb-3 fw-semibold">🧩 Task 분석 결과</h4>
    <table className="table table-bordered">
      <thead className="table-secondary">
        <tr>
          {Object.keys(analysis.taskStats[0]).map((key, idx) => (
            <th key={idx}>{key}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {analysis.taskStats.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {Object.values(row).map((val, colIndex) => (
              <td key={colIndex}>{val}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}
      </div>
    </div>
  );
};

export default FileUpload;