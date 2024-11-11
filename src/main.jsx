import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Tugassatu from "./pages/Tugassatu.jsx";
import Tugasdua from "./pages/Tugasdua.jsx";
import './index.css'
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Tugassatu />} />
        <Route path="/second" element={<Tugasdua />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
