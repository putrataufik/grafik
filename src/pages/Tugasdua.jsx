import React, { useState, useRef, useEffect } from "react";
import Navbar from "../components/Navbar";

// Algoritma Cohen-Sutherland
const cohenSutherlandClip = (x1, y1, x2, y2, xMin, yMin, xMax, yMax) => {
  const INSIDE = 0; // 0000
  const LEFT = 1; // 0001
  const RIGHT = 2; // 0010
  const BOTTOM = 4; // 0100
  const TOP = 8; // 1000

  // Function to compute the region code for a point
  const computeCode = (x, y, xMin, yMin, xMax, yMax) => {
    let code = INSIDE;

    if (x < xMin) code |= LEFT;
    else if (x > xMax) code |= RIGHT;
    if (y < yMin) code |= BOTTOM;
    else if (y > yMax) code |= TOP;

    return code;
  };

  let code1 = computeCode(x1, y1, xMin, yMin, xMax, yMax);
  let code2 = computeCode(x2, y2, xMin, yMin, xMax, yMax);

  let accept = false;

  while (true) {
    if (!(code1 | code2)) {
      accept = true;
      break;
    } else if (code1 & code2) {
      break;
    } else {
      let codeOut;
      let x = 0;
      let y = 0;

      if (code1 !== 0) codeOut = code1;
      else codeOut = code2;

      if (codeOut & TOP) {
        x = x1 + (x2 - x1) * (yMax - y1) / (y2 - y1);
        y = yMax;
      } else if (codeOut & BOTTOM) {
        x = x1 + (x2 - x1) * (yMin - y1) / (y2 - y1);
        y = yMin;
      } else if (codeOut & RIGHT) {
        y = y1 + (y2 - y1) * (xMax - x1) / (x2 - x1);
        x = xMax;
      } else if (codeOut & LEFT) {
        y = y1 + (y2 - y1) * (xMin - x1) / (x2 - x1);
        x = xMin;
      }

      if (codeOut === code1) {
        x1 = x;
        y1 = y;
        code1 = computeCode(x1, y1, xMin, yMin, xMax, yMax);
      } else {
        x2 = x;
        y2 = y;
        code2 = computeCode(x2, y2, xMin, yMin, xMax, yMax);
      }
    }
  }

  if (accept) {
    return { x1, y1, x2, y2 };
  }
  return null; // Tidak ada bagian garis yang dapat digambar dalam window
};

const liangBarskyClip = (x1, y1, x2, y2, xMin, yMin, xMax, yMax) => {
  const p = [-1 * (x2 - x1), x2 - x1, -1 * (y2 - y1), y2 - y1];
  const q = [x1 - xMin, xMax - x1, y1 - yMin, yMax - y1];

  let t0 = 0;
  let t1 = 1;
  let temp;

  for (let i = 0; i < 4; i++) {
    const pVal = p[i];
    const qVal = q[i];

    if (pVal === 0) {
      if (qVal < 0) return null; // Tidak ada bagian yang terlihat
    } else {
      let t = qVal / pVal;
      if (pVal < 0) {
        if (t > t1) return null; // Di luar window
        if (t > t0) t0 = t;
      } else {
        if (t < t0) return null; // Di luar window
        if (t < t1) t1 = t;
      }
    }
  }

  const newX1 = x1 + t0 * (x2 - x1);
  const newY1 = y1 + t0 * (y2 - y1);
  const newX2 = x1 + t1 * (x2 - x1);
  const newY2 = y1 + t1 * (y2 - y1);

  return { x1: newX1, y1: newY1, x2: newX2, y2: newY2 };
};

function Tugasdua() {
  // State untuk memilih opsi menggambar dan algoritma
  const [drawOption, setDrawOption] = useState(null);
  const [algorithm, setAlgorithm] = useState(null);
  const [color, setColor] = useState("#000000");
  const [thickness, setThickness] = useState(1);

  // State untuk menggambar garis
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState(null);
  const [endPos, setEndPos] = useState(null);

  // State untuk koordinat sebelum dan setelah clipping
  const [coordinatesBeforeClipping, setCoordinatesBeforeClipping] = useState({
    x1: null,
    y1: null,
    x2: null,
    y2: null
  });
  const [coordinatesAfterClipping, setCoordinatesAfterClipping] = useState({
    x1: null,
    y1: null,
    x2: null,
    y2: null
  });

  const canvasRef = useRef(null);

  const handleMouseDown = (e) => {
    if (drawOption === "garis") {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      // Mulai menggambar
      setIsDrawing(true);
      const rect = canvas.getBoundingClientRect();
      const startX = e.clientX - rect.left;
      const startY = e.clientY - rect.top;

      setStartPos({ x: startX, y: startY });
    }
  };

  const handleMouseMove = (e) => {
    if (isDrawing && startPos) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const rect = canvas.getBoundingClientRect();
      const endX = e.clientX - rect.left;
      const endY = e.clientY - rect.top;

      setEndPos({ x: endX, y: endY });

      // Menggambar garis sementara
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Membersihkan kanvas
      drawCanvas(ctx); // Redraw background
      ctx.beginPath();
      ctx.moveTo(startPos.x, startPos.y);
      ctx.lineTo(endX, endY);
      ctx.strokeStyle = color;
      ctx.lineWidth = thickness;
      ctx.stroke();
    }
  };

  const handleMouseUp = () => {
    if (isDrawing && startPos && endPos) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      // Menyelesaikan menggambar garis
      ctx.beginPath();
      ctx.moveTo(startPos.x, startPos.y);
      ctx.lineTo(endPos.x, endPos.y);
      ctx.strokeStyle = color;
      ctx.lineWidth = thickness;
      ctx.stroke();

      // Simpan koordinat garis yang digambar
      setCoordinatesBeforeClipping({
        x1: startPos.x,
        y1: startPos.y,
        x2: endPos.x,
        y2: endPos.y
      });

      // Lakukan clipping jika algoritma dipilih
      const clippingWindow = { xMin: 50, yMin: 50, xMax: 500, yMax: 300 };

      if (algorithm === "cohenSutherland") {
        const clippedLine = cohenSutherlandClip(
          startPos.x,
          startPos.y,
          endPos.x,
          endPos.y,
          clippingWindow.xMin,
          clippingWindow.yMin,
          clippingWindow.xMax,
          clippingWindow.yMax
        );
        setCoordinatesAfterClipping(clippedLine || {});
      } else if (algorithm === "liangBarsky") {
        const clippedLine = liangBarskyClip(
          startPos.x,
          startPos.y,
          endPos.x,
          endPos.y,
          clippingWindow.xMin,
          clippingWindow.yMin,
          clippingWindow.xMax,
          clippingWindow.yMax
        );
        setCoordinatesAfterClipping(clippedLine || {});
      }

      // Reset menggambar
      setIsDrawing(false);
      setStartPos(null);
      setEndPos(null);
    }
  };

  // Fungsi untuk menggambar background dan area klipping
  const drawCanvas = (ctx) => {
    const canvas = canvasRef.current;
    const width = canvas.width;
    const height = canvas.height;

    // Latar belakang gelap
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(0, 0, width, height);

    // Area klipping terang
    const clippingArea = { xMin: 50, yMin: 50, xMax: 500, yMax: 300 };
    ctx.clearRect(clippingArea.xMin, clippingArea.yMin, clippingArea.xMax - clippingArea.xMin, clippingArea.yMax - clippingArea.yMin); // Menghapus area klipping

    ctx.fillStyle = "rgba(255, 255, 255, 0.9)"; // Area klipping lebih terang
    ctx.fillRect(clippingArea.xMin, clippingArea.yMin, clippingArea.xMax - clippingArea.xMin, clippingArea.yMax - clippingArea.yMin);
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
      <Navbar />
      <div className="flex justify-between w-full max-w-4xl mt-6 gap-4">
        {/* Kotak Buat */}
        <div className="flex flex-col bg-white p-4 rounded-lg shadow-md w-1/3">
          <h2 className="text-lg font-semibold mb-4">Buat</h2>
          <div className="flex flex-col gap-2">
            <label>
              <input
                type="radio"
                name="drawOption"
                value="garis"
                onChange={() => setDrawOption("garis")}
              />
              Garis
            </label>
            <label>
              <input
                type="radio"
                name="drawOption"
                value="areaClipping"
                onChange={() => setDrawOption("areaClipping")}
              />
              Area Clipping
            </label>
            <label>
              <input
                type="radio"
                name="drawOption"
                value="kotak"
                onChange={() => setDrawOption("kotak")}
              />
              Kotak
            </label>
            <label>
              <input
                type="radio"
                name="drawOption"
                value="lingkaran"
                onChange={() => setDrawOption("lingkaran")}
              />
              Lingkaran
            </label>
          </div>
        </div>

        {/* Kotak Algoritma */}
        <div className="flex flex-col bg-white p-4 rounded-lg shadow-md w-1/3">
          <h2 className="text-lg font-semibold mb-4">Algoritma</h2>
          <div className="flex flex-col gap-2">
            <label>
              <input
                type="radio"
                name="algorithm"
                value="cohenSutherland"
                onChange={() => setAlgorithm("cohenSutherland")}
              />
              Cohen-Sutherland
            </label>
            <label>
              <input
                type="radio"
                name="algorithm"
                value="liangBarsky"
                onChange={() => setAlgorithm("liangBarsky")}
              />
              Liang-Barsky
            </label>
          </div>
        </div>

        {/* Kotak Atribut */}
        <div className="flex flex-col bg-white p-4 rounded-lg shadow-md w-1/3">
          <h2 className="text-lg font-semibold mb-4">Atribut</h2>
          <label className="mb-2">
            Warna:
            <input
              type="color"
              className="ml-2 p-1 border rounded"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
          </label>
          <label>
            Ketebalan:
            <input
              type="number"
              className="ml-2 p-1 border rounded"
              min="1"
              placeholder="1-10"
              value={thickness}
              onChange={(e) => setThickness(e.target.value)}
            />
          </label>
        </div>
      </div>

      {/* Area Menggambar dan Informasi Koordinat */}
      <div className="flex justify-between w-full max-w-4xl mt-6 gap-4">
        {/* Label Area Menggambar */}
        <div className="w-2/3">
          <h2 className="text-lg font-semibold mb-2">Area Menggambar</h2>
          <div
            className="bg-white p-4 rounded-lg shadow-md h-96"
            style={{ position: "relative" }}
          >
            <canvas
              ref={canvasRef}
              width="550"
              height="350"
              style={{ border: "1px solid #ccc" }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={() => setIsDrawing(false)} // Stop drawing if mouse leaves canvas
            />
          </div>
        </div>

        <div className="flex flex-col gap-4 w-1/3">
          {/* Koordinat Sebelum Clipping */}
          <div className="bg-white p-4 rounded-lg shadow-md h-1/2">
            <h2 className="text-lg font-semibold mb-2">Koordinat Sebelum Clipping</h2>
            {coordinatesBeforeClipping.x1 !== null && coordinatesBeforeClipping.x2 !== null ? (
              <p>
                X1: {coordinatesBeforeClipping.x1}, Y1: {coordinatesBeforeClipping.y1} <br />
                X2: {coordinatesBeforeClipping.x2}, Y2: {coordinatesBeforeClipping.y2}
              </p>
            ) : (
              <p>Tidak ada garis yang digambar.</p>
            )}
          </div>

          {/* Koordinat Setelah Clipping */}
          <div className="bg-white p-4 rounded-lg shadow-md h-1/2">
            <h2 className="text-lg font-semibold mb-2">Koordinat Setelah Clipping</h2>
            {coordinatesAfterClipping.x1 !== null && coordinatesAfterClipping.x2 !== null ? (
              <p>
                X1: {coordinatesAfterClipping.x1}, Y1: {coordinatesAfterClipping.y1} <br />
                X2: {coordinatesAfterClipping.x2}, Y2: {coordinatesAfterClipping.y2}
              </p>
            ) : (
              <p>Tidak ada garis yang terkliping.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Tugasdua;
