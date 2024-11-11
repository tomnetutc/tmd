import React, { useState } from 'react';
import './css/navbar.css';
import { NavbarProps } from './Types';
import { Navbar as NavbarBs } from "react-bootstrap";
import { Link } from 'react-router-dom';

export const Navbar: React.FC<NavbarProps> = ({ onMenuOptionChange, isTeleworkPage }) => {
    const [activeOption, setActiveOption] = useState<string>('Travel Purpose');

    const handleOptionClick = (option: string) => {
        setActiveOption(option);
    };

    return (
        <NavbarBs sticky="top" expand="lg" className="my-navbar shadow-sm">
            <div className="navbar-brand d-flex align-items-center" style={{ padding: '2px 20px' }}>
                <h4 className="fw-bold mb-0 ml-2"><img src="path-to-your-icon.png" alt="Icon" style={{ width: '30px', marginRight: '10px' }} />TMD Dasboard</h4>
            </div>
            {/* Combined container for nav links and options */}
            <div className="nav-container d-flex ms-auto">
            <div className="nav-options d-flex">
            <div className="nav-links">
                    <Link to="/" className="nav-link">Home</Link>
                    <Link to="/about" className="nav-link">About</Link>
                    <Link to="/dashboard" className="nav-link">Dashboard</Link>
                </div>
            </div>
                <div className="nav-options d-flex">
                    {['Travel Purpose', 'Travel Mode', 'Trip Chaining', 'Zero-trip Making'].map(option => (
                        <div
                            key={option}
                            className={`nav-option ${activeOption === option ? 'active' : ''}`}
                            onClick={() => handleOptionClick(option)}
                        >
                            {option}
                        </div>
                    ))}
                </div>
            </div>
        </NavbarBs>
    );
};

export default Navbar;
