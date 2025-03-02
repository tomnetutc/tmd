import React from 'react';
import './css/navbar.css';
import { Navbar as NavbarBs } from "react-bootstrap";
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import timeTravelIcon from '../src/images/time-clockk.svg';

export const Navbar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Derive active option from the current pathname
    const getActiveOption = (): string => {
        switch (location.pathname) {
            case '/travelpurpose':
                return 'Travel Purpose';
            case '/travelmode':
                return 'Travel Mode';
            case '/zerotripmaking':
                return 'Zero-trip Making';
            case '/daypattern':
                    return 'Day Pattern';
    
            case '/home':
            case '/about':
                return ''; // No active option for Home or About
            default:
                return '';
        }
    };

    const handleOptionClick = (option: string) => {
        switch (option) {
            case 'Travel Purpose':
                navigate('/travelpurpose');
                break;
            case 'Travel Mode':
                navigate('/travelmode');
                break;
            case 'Zero-Trip Making':
                navigate('/zerotripmaking');
                break;
            case 'Day Pattern':
                navigate('/daypattern');
                break;    
    
            default:
                navigate('/');
                break;
        }
    };

    const activeOption = getActiveOption();

    return (
        <NavbarBs sticky="top" expand="lg" className="my-navbar shadow-sm">
            <NavLink to="/" className="navbar-brand d-flex align-items-center" style={{ padding: '2px 20px', textDecoration: 'none' }}>
            <img src={timeTravelIcon} alt="Time Use Icon" style={{ width: '34px' }} />
            <h4 className="fw-bold mb-0 ml-2">The Mobility Dashboard</h4>
            </NavLink>
            <div className="nav-container d-flex ms-auto">
                <div className="nav-links">
                    <Link to="/" className="nav-link">Home</Link>
                    <Link to="/about" className="nav-link">About</Link>
                    <Link to="/travelpurpose" className="nav-link">Dashboard</Link>
                </div>
                <div className="nav-options d-flex">
                    {['Travel Purpose', 'Travel Mode', 'Zero-Trip Making', 'Day Pattern'].map(option => (
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
