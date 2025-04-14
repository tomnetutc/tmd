import React from "react";
import "./css/navbar.css";
import { Navbar as NavbarBs } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import timeTravelIcon from "../src/images/SVGLogo.svg";

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine active option for Dashboard categories
  const getActiveOption = (): string => {
    switch (location.pathname) {
      case "/trippurpose":
        return "Trip Purpose";
      case "/travelmode":
        return "Travel Mode";
      case "/zerotripmaking":
        return "Zero-Trip Making";
      case "/daypattern":
        return "Day Pattern";
      default:
        return "";
    }
  };

  const activeOption = getActiveOption();

  const isDashboardActive = !["/", "/about"].includes(location.pathname);

  const handleOptionClick = (option: string) => {
    switch (option) {
      case "Trip Purpose":
        navigate("/trippurpose");
        break;
      case "Travel Mode":
        navigate("/travelmode");
        break;
      case "Zero-Trip Making":
        navigate("/zerotripmaking");
        break;
      case "Day Pattern":
        navigate("/daypattern");
        break;
      default:
        navigate("/");
        break;
    }
  };

  return (
    <NavbarBs sticky="top" expand="lg" className="my-navbar shadow-sm">
      <div
        className="navbar-brand d-flex align-items-center"
        style={{ padding: "2px 20px" }}
      >
        <Link to="/" className="text-decoration-none">
          <img
            src={timeTravelIcon}
            alt="Time Use Icon"
            style={{ width: "80px" }}
          />
        </Link>
        <Link to="/" className="text-decoration-none">
          <h4 className="fw-bold mb-0 ml-2 text-dark">
            The Mobility Dashboard
          </h4>
        </Link>
      </div>
      <div className="nav-container d-flex ms-auto">
        {/* Main navigation links */}
        <div className="nav-links">
          <Link
            to="/"
            className={`nav-link ${location.pathname === "/" ? "active-bold" : ""}`}
          >
            Home
          </Link>
          <Link
            to="/about"
            className={`nav-link ${location.pathname === "/about" ? "active-bold" : ""}`}
          >
            About
          </Link>
          <Link
            to="/trippurpose"
            className={`nav-link ${isDashboardActive ? "active-bold" : ""}`}
          >
            Dashboard
          </Link>
        </div>

        {/* Dashboard category selection */}
        <div className="nav-options d-flex">
          {["Trip Purpose", "Travel Mode", "Zero-Trip Making", "Day Pattern"].map(
            (option) => (
              <div
                key={option}
                className={`nav-option ${
                  activeOption === option ? "active" : ""
                }`}
                onClick={() => handleOptionClick(option)}
              >
                {option}
              </div>
            )
          )}
        </div>
      </div>
    </NavbarBs>
  );
};

export default Navbar;
