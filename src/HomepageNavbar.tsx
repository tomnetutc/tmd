import React from 'react';
import './css/navbar.css';
import { Navbar as NavbarBs } from "react-bootstrap";
import { Link} from 'react-router-dom';

export const HomepageNavbar: React.FC = () => {

    return (
        <NavbarBs sticky="top" expand="lg" className="my-navbar shadow-sm">
            <div className="navbar-brand d-flex align-items-center" style={{ padding: '2px 20px' }}>
                <h4 style={{ width: '30px', marginRight: '10px' }}>The Mobility Dashboard</h4>
            </div>
            <div className="nav-container d-flex ms-auto">
                <div className="nav-links">
                    <Link to="/" className="nav-link">Home</Link>
                    <Link to="/about" className="nav-link">About</Link>
                    <Link to="/travelpurpose" className="nav-link">Dashboard</Link>
                </div>
            </div>
        </NavbarBs>
    );
};

export default HomepageNavbar;
