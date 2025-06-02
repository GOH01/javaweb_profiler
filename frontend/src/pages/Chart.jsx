// src/pages/Chart.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { Bar, Line, Radar, PolarArea } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import Layout from '../components/Layout';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend
);

export default function ChartPage() {
  const location = useLocation();
  const [chartData, setChartData] = useState(null);
  const [viewType, setViewType] = useState('task'); // 'task' or 'core'

  const tableName = location.state?.tableName || localStorage.getItem('uploadedTableName');

  useEffect(() => {
  
    if (!tableName) return;
  
    axios.get(`http://localhost:3001/api/profile/analyze/${tableName}`)
      .then((res) => {
        const rawData = res.data;
        const keySet = viewType === 'task' ? rawData.taskStats : rawData.coreStats;

      if (!keySet || !Array.isArray(keySet)) return;

      const labels = keySet.map(row => row.task || row.name || row.core);
      const minData = keySet.map(row => Number(row.min_usaged));
      const maxData = keySet.map(row => Number(row.max_usaged));
      const avgData = keySet.map(row => Number(row.avg_usaged));



  
        setChartData({
          labels,
          datasets: [
            { label: 'Min', data: minData, backgroundColor: 'rgba(75, 192, 192, 0.5)' },
            { label: 'Max', data: maxData, backgroundColor: 'rgba(255, 99, 132, 0.5)' },
            { label: 'Avg', data: avgData, backgroundColor: 'rgba(255, 206, 86, 0.5)' },
          ]
        });
      })
      .catch((err) => {
        console.error('❌ 분석 데이터 불러오기 실패:', err);
      });
  }, [viewType]);
  

  return (
    <Layout>
      <div className="container py-5">
        <h2 className="mb-4 fw-bold text-center">📈 분석 차트</h2>

        <div className="d-flex justify-content-center gap-3 mb-4">
          <button
            className={`btn ${viewType === 'task' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setViewType('task')}
          >
            Task 기준 보기
          </button>
          <button
            className={`btn ${viewType === 'core' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setViewType('core')}
          >
            Core 기준 보기
          </button>
        </div>

        {!localStorage.getItem('uploadedTableName') && (
          <p className="text-center text-danger">❗ 먼저 FileUpload에서 데이터를 업로드하세요</p>
        )}

        {chartData ? (
          <>
            <div className="mb-5">
              <h4 className="text-center">📊 Bar Chart</h4>
              <Bar data={chartData} height={300} />
            </div>
            <div className="mb-5">
              <h4 className="text-center">📉 Line Chart</h4>
              <Line data={chartData} height={300} />
            </div>
            <div className="mb-5">
              <h4 className="text-center">🎯 Radar Chart</h4>
              <Radar data={chartData} height={300} />
            </div>
            <div>
              <h4 className="text-center">🌀 Polar Area Chart</h4>
              <PolarArea data={chartData} height={300} />
            </div>
          </>
        ) : (
          <p className="text-center text-muted">🕊 분석 데이터를 불러오는 중...</p>
        )}
      </div>
    </Layout>
  );
}
