import React, { useState } from "react";
import BasicAlgorithmResults from "./components/BasicAlgorithmResults";
import DDAAlgorithmResults from "./components/DDAAlgorithmResults";
import BresenhamAlgorithmResults from "./components/BresenhamAlgoritmResult";

function App() {
  const [x1, setX1] = useState(0);
  const [y1, setY1] = useState(0);
  const [x2, setX2] = useState(0);
  const [y2, setY2] = useState(0);
  const [algorithm, setAlgorithm] = useState("");

  const handleClear = () => {
    setX1(0);
    setY1(0);
    setX2(0);
    setY2(0);
    setAlgorithm("");
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
                onClick={() => setAlgorithm("basic")}
                className="bg-blue-500 text-white p-2 rounded"
              >
                Jalankan Algoritma Dasar
              </button>
              <button
                onClick={() => setAlgorithm("dda")}
                className="bg-green-500 text-white p-2 rounded"
              >
                Jalankan Algoritma DDA
              </button>
              <button
                onClick={() => setAlgorithm("bresenham")}
                className="bg-orange-500 text-white p-2 rounded"
              >
                Jalankan Algoritma Bresenham
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

      {algorithm === "basic" && <BasicAlgorithmResults x1={x1} y1={y1} x2={x2} y2={y2} />}
      {algorithm === "dda" && <DDAAlgorithmResults x1={x1} y1={y1} x2={x2} y2={y2} />}
      {algorithm === "bresenham" && <BresenhamAlgorithmResults x1={x1} y1={y1} x2={x2} y2={y2} />}
    </div>
  );
}

export default App;
