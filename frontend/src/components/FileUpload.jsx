import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');
  const [analysis, setAnalysis] = useState(null);  // 📊 분석 결과 상태 추가

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

      // 📡 업로드 성공 후 분석 요청
      const analyzeRes = await axios.get('http://localhost:5000/analyze');
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
        minHeight: "100vh",
        background: "linear-gradient(to right, #f2f2f2, #d6e4ff)",
        padding: "20px",
      }}
    >
      <div
        className="shadow-lg p-5 bg-white rounded"
        style={{ width: "100%", maxWidth: "1200px" }}
      >
        <h2 className="text-center mb-4 text-primary fw-bold">
          📊 JavaWeb Profiler
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="fileInput"
              className="form-label fw-semibold text-center w-100"
              style={{ fontSize: "24px" }}
            >
              데이터 파일 업로드
            </label>
            <input
              type="file"
              name="file"
              id="fileInput"
              onChange={handleFileChange}
              className="form-control"
              style={{
                height: "60px",
                fontSize: "18px",
                padding: "400px",
                borderRadius: "15px",
                border: "4px dotted #6c757d",
                backgroundColor: "#f8f9fa",
              }}
            />
            
          </div>

          <button
            type="submit"
            className="btn btn-success w-100 py-2 fw-bold"
            style={{
              fontSize: "18px",
              borderRadius: "10px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
              transition: "0.2s",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = "#218838")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = "#28a745")
            }
          >
            🚀 업로드
          </button>
        </form>

        {status && (
          <div
            className="mt-4 alert alert-info text-center"
            style={{ fontSize: "16px" }}
          >
            {status}
          </div>
        )}

        {analysis && (
          <div className="mt-5">
            <h4 className="text-center mb-3 fw-semibold">📈 분석 결과</h4>
            <table className="table table-bordered">
              <thead className="table-secondary">
                <tr>
                  {Object.keys(analysis[0]).map((key, idx) => (
                    <th key={idx}>{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {analysis.map((row, rowIndex) => (
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
