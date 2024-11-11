import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; // Import BrowserRouter
import './App.css';
import TravelPurpose from './Pages/TravelPurpose';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TravelPurpose />} />
        {/* Add more routes here if you have other pages */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
