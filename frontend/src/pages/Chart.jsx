// src/pages/Chart.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
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
  const [chartData, setChartData] = useState(null);
  const [viewType, setViewType] = useState('task'); // 'task' or 'core'

  useEffect(() => {
    axios.get('http://localhost:5000/analyze')
      .then(res => {
        const rawData = res.data; // 예: { task1: [10,15,...], ... }

        // key: task1~5 또는 core1~5
        const labels = Object.keys(rawData);
        const minData = labels.map(key => Math.min(...rawData[key]));
        const maxData = labels.map(key => Math.max(...rawData[key]));
        const avgData = labels.map(key => {
          const arr = rawData[key];
          return (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(2);
        });

        setChartData({
          labels,
          datasets: [
            { label: 'Min', data: minData, backgroundColor: 'rgba(75, 192, 192, 0.5)' },
            { label: 'Max', data: maxData, backgroundColor: 'rgba(255, 99, 132, 0.5)' },
            { label: 'Avg', data: avgData, backgroundColor: 'rgba(255, 206, 86, 0.5)' },
          ]
        });
      })
      .catch(err => console.error('분석 데이터를 불러오지 못했습니다:', err));
  }, [viewType]);

  return (
    <Layout>
      <div className="container py-5">
        <h2 className="mb-4 fw-bold text-center">📈 분석 차트</h2>

        <div className="d-flex justify-content-center gap-3 mb-5">
          <button className={`btn ${viewType === 'task' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setViewType('task')}>Task 기준 보기</button>
          <button className={`btn ${viewType === 'core' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setViewType('core')}>Core 기준 보기</button>
        </div>

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
          <p className="text-center">📡 분석 결과를 불러오는 중...</p>
        )}
      </div>
    </Layout>
  );
}
