import React from 'react';
import './css/navbar.css';
import { Navbar as NavbarBs } from "react-bootstrap";
import { Link} from 'react-router-dom';
import timeTravelIcon from '../src/images/time-clockk.svg';

export const HomepageNavbar: React.FC = () => {

    return (
        <NavbarBs sticky="top" expand="lg" className="my-navbar shadow-sm" style={{ width: '100%' }}>
            <div className="navbar-brand d-flex align-items-center" style={{ padding: '0px 150px' }}>
                <img src={timeTravelIcon} alt="Time Use Icon" style={{ width: '34px' }} />
                <h4 className="fw-bold mb-0 ml-2">The Mobility Dashboard</h4>
            </div>
            <div className="nav-container d-flex ms-auto">
                <div className="nav-links" style={{ padding: '0px 110px' }}>
                    <Link to="/" className="nav-link">Home</Link>
                    <Link to="/about" className="nav-link">About</Link>
                    <Link to="/travelpurpose" className="nav-link">Dashboard</Link>
                </div>
            </div>
        </NavbarBs>
    );
};

export default HomepageNavbar;
