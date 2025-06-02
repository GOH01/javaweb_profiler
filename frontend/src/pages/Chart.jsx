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
  LineElement,
  Tooltip,
  Legend
);

export default function ChartPage() {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:3001/analyze')
      .then(res => {
        const data = res.data; // 예: { task1: {min: 1, max: 10, avg: 5}, ... }

        const labels = Object.keys(data);
        const minData = labels.map(label => data[label].min);
        const maxData = labels.map(label => data[label].max);
        const avgData = labels.map(label => data[label].avg);

        setChartData({
          labels,
          datasets: [
            {
              label: 'Min',
              data: minData,
              backgroundColor: 'rgba(75, 192, 192, 0.5)',
            },
            {
              label: 'Max',
              data: maxData,
              backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
            {
              label: 'Avg',
              data: avgData,
              backgroundColor: 'rgba(255, 206, 86, 0.5)',
            }
          ]
        });
      })
      .catch(err => {
        console.error('분석 데이터를 불러오지 못했습니다:', err);
      });
  }, []);

  return (
    <Layout>
      <div className="container py-5">
        <h2 className="mb-4 fw-bold text-center">📈 분석 차트</h2>
        {chartData ? (
          <>
            <div className="mb-5">
              <h4 className="text-center">📊 Bar Chart</h4>
              <Bar data={chartData} />
            </div>

            <div className="mb-5">
              <h4 className="text-center">📉 Line Chart</h4>
              <Line data={chartData} />
            </div>

            <div className="mb-5">
              <h4 className="text-center">🎯 Radar Chart</h4>
              <Radar data={chartData} />
            </div>

            <div>
              <h4 className="text-center">🌀 Polar Area Chart</h4>
              <PolarArea data={chartData} />
            </div>
          </>
        ) : (
          <p className="text-center">📡 분석 결과를 불러오는 중...</p>
        )}
      </div>
    </Layout>
  );
}
