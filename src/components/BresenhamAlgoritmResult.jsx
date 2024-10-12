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

const BresenhamAlgorithmResults = ({ x1, y1, x2, y2 }) => {
    const [points, setPoints] = useState([]);

    useEffect(() => {
      const newPoints = [];
      let x = x1;
      let y = y1;
      const dx = x2 - x1;
      const dy = y2 - y1;
      console.log(dy-dx);
      let p = 2 * dy - dx;
      newPoints.push({ x, y });

      while (x < x2) {
        x++;
        if (p < 0) {
          p = p + 2 * dy;
        } else {
          y++;
          p = p + 2 * (dy - dx);
        }
        newPoints.push({ x, y });
      }

      setPoints(newPoints);
    }, [x1, y1, x2, y2]);

    // Data untuk ChartJS
    const data = {
      labels: points.map((point) => point.x), // Label untuk setiap titik x
      datasets: [
        {
          label: 'Bresenham Line',
          data: points.map((point) => point.y), // Data y untuk grafik
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        },
      ],
    };

    return (
        <div>
            <h3>Points Table</h3>
            <table border="1" cellPadding="5" cellSpacing="0">
                <thead>
                    <tr>
                        <th>X</th>
                        <th>Y</th>
                    </tr>
                </thead>
                <tbody>
                    {points.map((point, index) => (
                        <tr key={index}>
                            <td>{point.x}</td>
                            <td>{point.y}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h3>Graphical Representation</h3>
            <Line data={data} />
        </div>
    );
};

export default BresenhamAlgorithmResults;