import React from 'react';
import { NavLink } from 'react-router-dom';
import { Container, Nav, Navbar as NavbarBs } from "react-bootstrap";
import timeTravelIcon from '../src/images/time-clockk.svg';

export const HomepageNavbar: React.FC = () => {
    return (
        <NavbarBs sticky="top" expand="lg" className="bg-white shadow-sm" style={{ height: '57px', padding: '0.5rem 1rem' }}>
            <Container>
            <Nav className="w-100 px-3">
                <NavLink to="/" className="navbar-brand d-flex align-items-center me-auto">
                    <img src={timeTravelIcon} alt="Time Use Icon" style={{ width: '34px' }} />
                    <h4 className="fw-bold mb-0 ml-2">The Mobility Dashboard</h4>
                </NavLink>
                <NavbarBs.Toggle aria-controls="responsive-navbar-nav" />
                <NavbarBs.Collapse id="responsive-navbar-nav">
                    <Nav className="ms-auto">
                        <NavLink to="/" className="nav-link">
                            Home
                        </NavLink>
                        <NavLink to="/about" className="nav-link">
                            About
                        </NavLink>
                        <NavLink to="/travelpurpose" className="nav-link">
                            Dashboard
                        </NavLink>
                    </Nav>
                </NavbarBs.Collapse>
            </Nav>
            </Container>
        </NavbarBs>
    );
};

export default HomepageNavbar;
