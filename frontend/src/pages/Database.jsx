import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Database() {
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && !files.includes(file.name)) {
      setFiles((prev) => [...prev, file.name]);
    }
    // 선택 후 파일 input 초기화(같은 파일 재업로드 가능하게)
    e.target.value = null;
  };

  const handleFileClick = (fileName) => {
    navigate(`/chart?file=${encodeURIComponent(fileName)}`);
  };

  return (
    <div className="container py-5">
      <h2 className="mb-4">📂 데이터 파일 업로드 및 목록</h2>

      <input
        type="file"
        onChange={handleFileChange}
        className="form-control mb-4"
      />

      {files.length === 0 ? (
        <p>업로드된 파일이 없습니다.</p>
      ) : (
        <ul className="list-group">
          {files.map((fileName, idx) => (
            <li
              key={idx}
              className="list-group-item list-group-item-action"
              style={{ cursor: "pointer" }}
              onClick={() => handleFileClick(fileName)}
            >
              {fileName}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
// import React from 'react';

// const Database = () => {
//     return (
//         <div>

//         </div>
//     );
// };

// export default function ChartPage() {
//     return <div className="p-5">📈 차트 페이지</div>;
//   }
