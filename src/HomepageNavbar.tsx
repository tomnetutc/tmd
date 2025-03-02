import React from "react";
import "./css/navbar.css";
import { Navbar as NavbarBs } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import timeTravelIcon from "../src/images/SVGLogo.svg";

export const HomepageNavbar: React.FC = () => {
  const location = useLocation();

  // Function to determine if a navigation link is active
  const isActiveLink = (path: string) => location.pathname === path;

  return (
    <NavbarBs
      sticky="top"
      expand="lg"
      className="my-navbar shadow-sm"
      style={{ width: "100%" }}
    >
      <div
        className="navbar-brand d-flex align-items-center"
        style={{ padding: "0px 150px" }}
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
        </Link>{" "}
      </div>
      <div className="nav-container d-flex ms-auto">
        <div className="nav-links" style={{ padding: "0px 110px" }}>
          <Link
            to="/"
            className={`nav-link ${isActiveLink("/") ? "active-bold" : ""}`}
          >
            Home
          </Link>
          <Link
            to="/about"
            className={`nav-link ${
              isActiveLink("/about") ? "active-bold" : ""
            }`}
          >
            About
          </Link>
          <Link
            to="/travelpurpose"
            className={`nav-link ${
              isActiveLink("/travelpurpose") ? "active-bold" : ""
            }`}
          >
            Dashboard
          </Link>
        </div>
      </div>
    </NavbarBs>
  );
};

export default HomepageNavbar;
