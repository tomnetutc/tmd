import React from 'react';
import './css/navbar.css';
import { Navbar as NavbarBs } from "react-bootstrap";
import { Link, useNavigate, useLocation } from 'react-router-dom';

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
            case 'Zero-trip Making':
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
            <div className="navbar-brand d-flex align-items-center" style={{ padding: '2px 20px' }}>
                <h4 style={{ width: '30px', marginRight: '10px' }}>The Mobility Dashboard</h4>
            </div>
            <div className="nav-container d-flex ms-auto">
                <div className="nav-links">
                    <Link to="/" className="nav-link">Home</Link>
                    <Link to="/about" className="nav-link">About</Link>
                    <Link to="/travelpurpose" className="nav-link">Dashboard</Link>
                </div>
                <div className="nav-options d-flex">
                    {['Travel Purpose', 'Travel Mode', 'Zero-trip Making', 'Day Pattern'].map(option => (
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
