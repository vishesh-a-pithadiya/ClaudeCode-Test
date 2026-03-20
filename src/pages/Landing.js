import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Landing.css';

function Landing() {
  const navigate = useNavigate();

  const handleSelect = (role) => {
    localStorage.setItem('userRole', role);
    navigate('/home');
  };

  return (
    <div className="landing-page">
      <div className="landing-logo">
        <img src="/ti-logo.svg" alt="Texas Instruments" className="landing-logo-img" />
      </div>
      <h1 className="landing-title">Who are you?</h1>
      <p className="landing-subtitle">Select your role to get started</p>

      <div className="landing-options">
        <button className="landing-option" onClick={() => handleSelect('customer')}>
          <div className="landing-option-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="36" height="36">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <span className="landing-option-label">Customer</span>
        </button>

        <button className="landing-option" onClick={() => handleSelect('apps')}>
          <div className="landing-option-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="36" height="36">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
          </div>
          <span className="landing-option-label">Apps</span>
        </button>
      </div>
    </div>
  );
}

export default Landing;
