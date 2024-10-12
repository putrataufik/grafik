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

// Mendaftarkan semua elemen dan skala yang diperlukan
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const DDAAlgorithmResults = ({ x1, y1, x2, y2 }) => {
  const [points, setPoints] = useState([]);

  useEffect(() => {
    const newPoints = [];
    const dx = x2 - x1;
    const dy = y2 - y1;
    const steps = Math.max(Math.abs(dx), Math.abs(dy));
    const incrementX = dx / steps;
    const incrementY = dy / steps;

    let currentX = x1;
    let currentY = y1;

    for (let i = 0; i <= steps; i++) {
      newPoints.push({
        x: currentX.toFixed(1),
        y: currentY.toFixed(1),
        roundX: Math.round(currentX),
        roundY: Math.round(currentY),
      });
      currentX += incrementX;
      currentY += incrementY;
    }
    setPoints(newPoints);
  }, [x1, y1, x2, y2]);

  const chartData = {
    labels: points.map((point) => point.x),
    datasets: [
      {
        label: 'Garis Koordinat (DDA)',
        data: points.map((point) => point.y),
        borderColor: 'rgba(153, 102, 255, 1)',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        fill: true,
      },
    ],
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Tabel Koordinat */}
      <div className="bg-gray-100 p-4 rounded-lg">
        <h3>Tabel Koordinat Garis (DDA):</h3>
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">X</th>
              <th className="border border-gray-300 p-2">Y</th>
              <th className="border border-gray-300 p-2">Round(X)</th>
              <th className="border border-gray-300 p-2">Round(Y)</th>
            </tr>
          </thead>
          <tbody>
            {points.map((point, index) => (
              <tr key={index}>
                <td className="border border-gray-300 p-2">{point.x}</td>
                <td className="border border-gray-300 p-2">{point.y}</td>
                <td className="border border-gray-300 p-2">{point.roundX}</td>
                <td className="border border-gray-300 p-2">{point.roundY}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4">
          <h4>Rumus:</h4>
          <p>
            1. Hitung DX dan DY: DX = x2 - x1, DY = y2 - y1
            <br />
            2. Tentukan nilai Step: Jika |DY| lebih dari |DX|, gunakan |DY| sebagai nilai step; jika |DX| lebih dari |DY|, gunakan |DX| sebagai nilai step.
            <br />
            3. Hitung nilai IncrementX dan IncrementY: IncrementX = DX / Step, IncrementY = DY / Step.
            <br />
            4. Tambah nilai x dan y: x += IncrementX, y += IncrementY.
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

export default DDAAlgorithmResults;
