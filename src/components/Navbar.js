import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <>
      <nav className="navbar-header">
        <div className="navbar-brand">
          <img src="/ti-logo.svg" alt="Texas Instruments" className="navbar-logo" />
        </div>
        <button className="navbar-login">Login</button>
      </nav>
      <nav className="tab-bar">
        <NavLink to="/" end className="tab-item">
          <svg className="tab-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          <span className="tab-label">Home</span>
        </NavLink>
        <NavLink to="/e2e" className="tab-item">
          <svg className="tab-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <span className="tab-label">E2E</span>
        </NavLink>
        <NavLink to="/search" className="tab-item">
          <svg className="tab-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <span className="tab-label">Search</span>
        </NavLink>
        <button className="tab-item tab-menu" onClick={() => {}}>
          <svg className="tab-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
          <span className="tab-label">Menu</span>
        </button>
      </nav>
    </>
  );
}

export default Navbar;
