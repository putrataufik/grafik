import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const BasicAlgorithmResults = ({ x1, y1, x2, y2 }) => {
  const [points, setPoints] = useState([]);

  useEffect(() => {
    const newPoints = [];
    const deltaX = 1;
    const m = (x2 !== x1) ? (y2 - y1) / (x2 - x1) : 0; 
    let currentYB = y1;

    for (let x = x1; x <= x2; x = (parseFloat(x) + deltaX).toFixed(1)) {
      const y = currentYB; 
      newPoints.push({
        x: parseFloat(x).toFixed(1),
        dx: deltaX,
        currentYB: currentYB.toFixed(2),
        m: m.toFixed(2),
        y: y.toFixed(2), 
      });
      currentYB += m * deltaX;
    }
    setPoints(newPoints);
  }, [x1, y1, x2, y2]);

  const chartData = {
    labels: points.map((point) => point.x),
    datasets: [
      {
        label: 'Garis Koordinat (Algoritma Dasar)',
        data: points.map((point) => point.y),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      },
    ],
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Tabel Koordinat */}
      <div className="bg-gray-100 p-4 rounded-lg">
        <h3>Tabel Koordinat Garis (Algoritma Dasar):</h3>
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">X</th>
              <th className="border border-gray-300 p-2">ΔX</th>
              <th className="border border-gray-300 p-2">Y(b)</th>
              <th className="border border-gray-300 p-2">M</th>
              <th className="border border-gray-300 p-2">Y</th>
            </tr>
          </thead>
          <tbody>
            {points.map((point, index) => (
              <tr key={index}>
                <td className="border border-gray-300 p-2">{point.x}</td>
                <td className="border border-gray-300 p-2">{point.dx}</td>
                <td className="border border-gray-300 p-2">{point.currentYB}</td>
                <td className="border border-gray-300 p-2">{point.m}</td>
                <td className="border border-gray-300 p-2">{point.y}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4">
          <h4>Rumus:</h4>
          <p>
            y = mx + b, di mana:
            <br />
            m = (y2 - y1) / (x2 - x1)
            <br />
            y(b) = y1
          </p>
        </div>
      </div>

      {/* Grafik */}
      <div className="bg-white p-4 rounded-lg">
        <h3>Grafik Koordinat:</h3>
        <Line data={chartData} />
      </div>
    </div>
  );
};

export default BasicAlgorithmResults;
