import React, { useState } from "react";
import BasicAlgorithmResults from "./components/BasicAlgorithmResults";
import DDAAlgorithmResults from "./components/DDAAlgorithmResults";

function App() {
  const [x1, setX1] = useState(0);
  const [y1, setY1] = useState(0);
  const [x2, setX2] = useState(0);
  const [y2, setY2] = useState(0);
  const [pointsBasic, setPointsBasic] = useState([]); 
  const [pointsDDA, setPointsDDA] = useState([]); 
  const [algorithm, setAlgorithm] = useState("basic"); 

  const handleRun = () => {
    let newPointsBasic = [];
    let newPointsDDA = [];

    if (algorithm === "basic") {
      const m = (y2 - y1) / (x2 - x1); 
      let currentYB = y1; 
      const deltaX = 1; 

      for (let x = x1; x <= x2; x = (parseFloat(x) + deltaX).toFixed(1)) {
        const y = currentYB * deltaX + m; 

        newPointsBasic.push({
          x: parseFloat(x).toFixed(1),
          dx: deltaX,
          currentYB: currentYB.toFixed(2), 
          m: m.toFixed(2),
          y: y.toFixed(2), 
        });

        currentYB += m * deltaX; 
      }
      setPointsBasic(newPointsBasic);
    } else if (algorithm === "dda") {
      // Algoritma DDA
      const dx = x2 - x1;
      const dy = y2 - y1;
      const steps = Math.max(Math.abs(dx), Math.abs(dy)); 
      const incrementX = dx / steps;
      const incrementY = dy / steps;

      let currentX = x1;
      let currentY = y1;

      for (let i = 0; i <= steps; i++) {
        newPointsDDA.push({
          x: currentX.toFixed(1),
          y: currentY.toFixed(1),
          roundX: Math.round(currentX),
          roundY: Math.round(currentY), 
        });

        currentX += incrementX; // 
        currentY += incrementY; //
      }
      setPointsDDA(newPointsDDA);
    }
  };

  const handleClear = () => {
    setX1(0);
    setY1(0);
    setX2(0);
    setY2(0);
    setPointsBasic([]);
    setPointsDDA([]); 
    setAlgorithm("basic"); 
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex justify-center gap-6">
        <div className="bg-slate-600 p-4 rounded-lg">
          <h3 className="text-white mb-4">Input Koordinat</h3>
          <div className="flex flex-col gap-4">
            <input
              type="number"
              value={x1}
              onChange={(e) => setX1(parseFloat(e.target.value))}
              placeholder="X1"
              className="p-2 rounded"
              step="any"
            />
            <input
              type="number"
              value={y1}
              onChange={(e) => setY1(parseFloat(e.target.value))}
              placeholder="Y1"
              className="p-2 rounded"
              step="any"
            />
            <input
              type="number"
              value={x2}
              onChange={(e) => setX2(parseFloat(e.target.value))}
              placeholder="X2"
              className="p-2 rounded"
              step="any"
            />
            <input
              type="number"
              value={y2}
              onChange={(e) => setY2(parseFloat(e.target.value))}
              placeholder="Y2"
              className="p-2 rounded"
              step="any"
            />

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setAlgorithm("basic");
                  handleRun();
                }}
                className="bg-blue-500 text-white p-2 rounded"
              >
                Jalankan Algoritma Dasar
              </button>
              <button
                onClick={() => {
                  setAlgorithm("dda");
                  handleRun();
                }}
                className="bg-green-500 text-white p-2 rounded"
              >
                Jalankan Algoritma DDA
              </button>
              <button
                onClick={handleClear}
                className="bg-red-500 text-white p-2 rounded"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      </div>

      {algorithm === "basic" && <BasicAlgorithmResults points={pointsBasic} />}
      {algorithm === "dda" && <DDAAlgorithmResults points={pointsDDA} />}
    </div>
  );
}

export default App;
