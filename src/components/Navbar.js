import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth';
import './Navbar.css';

function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  return (
    <>
      <nav className="navbar-header">
        <div className="navbar-brand">
          <img src="/ti-logo.svg" alt="Texas Instruments" className="navbar-logo" />
        </div>
        {isAuthenticated ? (
          <button className="navbar-user" onClick={() => navigate('/login')}>
            <span className="navbar-avatar">
              {(user.name || user.email || '?')[0].toUpperCase()}
            </span>
          </button>
        ) : (
          <button className="navbar-login" onClick={() => navigate('/login')}>Login</button>
        )}
      </nav>
      <nav className="tab-bar">
        <NavLink to="/home" className="tab-item">
          <svg className="tab-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          <span className="tab-label">Home</span>
        </NavLink>
        <NavLink to="/search" className="tab-item">
          <svg className="tab-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <span className="tab-label">Search</span>
        </NavLink>
        <NavLink to="/settings" className="tab-item">
          <svg className="tab-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
          <span className="tab-label">Settings</span>
        </NavLink>
      </nav>
    </>
  );
}

export default Navbar;
