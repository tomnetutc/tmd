import React, { useEffect } from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom"; // Import BrowserRouter
import "./App.css";
import TravelPurpose from "./Pages/TravelPurpose";
import TravelMode from "./Pages/TravelMode";
import ZeropTripMaking from "./Pages/ZeroTripMaking";
import { Home } from "./Pages/Home";
import { About } from "./Pages/About";
import DayPattern from "./Pages/DayPattern";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/trippurpose" element={<TravelPurpose />} />
        <Route path="/travelmode" element={<TravelMode />} />
        <Route path="/zerotripmaking" element={<ZeropTripMaking />} />
        <Route path="/daypattern" element={<DayPattern />} />
        <Route path="*" element={<Navigate to="/tmd" />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
