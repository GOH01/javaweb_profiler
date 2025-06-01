
import React, { useState } from 'react';
import axios from 'axios';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert('파일을 선택하세요!');

    const formData = new FormData();
    formData.append('input_profile', file);

    try {
      const res = await axios.post('http://localhost:5000/upload', formData);
      setStatus('✅ 업로드 성공!');
      console.log(res.data);
    } catch (err) {
      setStatus('❌ 업로드 실패...');
      console.error(err);
    }
  };

  return (
    <div className="container mt-4">
      <h3>📁 데이터 파일 업로드</h3>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} className="form-control" />
        <button type="submit" className="btn btn-primary mt-2">업로드</button>
      </form>
      <p className="mt-2">{status}</p>
    </div>
  );
};

export default FileUpload;
