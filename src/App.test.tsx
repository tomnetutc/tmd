import TravelPurpose  from "./Pages/TravelPurpose";
import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";



function App(): JSX.Element {

  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <>
      <Routes>
        <Route path="/travelpurpose" element={<TravelPurpose />} />
      </Routes>
    </>
  );
}

export default App;