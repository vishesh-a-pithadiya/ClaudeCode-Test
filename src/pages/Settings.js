import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth';
import './Settings.css';

const FONT_SIZES = [
  { label: 'Small', value: '14px' },
  { label: 'Default', value: '16px' },
  { label: 'Large', value: '18px' },
  { label: 'Extra Large', value: '20px' },
];

function Settings() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('ti_dark_mode') === 'true';
  });
  const [fontSizeIndex, setFontSizeIndex] = useState(() => {
    const saved = localStorage.getItem('ti_font_size_index');
    return saved ? parseInt(saved, 10) : 1;
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    localStorage.setItem('ti_dark_mode', darkMode);
  }, [darkMode]);

  useEffect(() => {
    document.documentElement.style.fontSize = FONT_SIZES[fontSizeIndex].value;
    localStorage.setItem('ti_font_size_index', fontSizeIndex);
  }, [fontSizeIndex]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="settings">
      {/* Profile Section */}
      <div className="settings-profile" onClick={() => navigate('/login')}>
        <div className="profile-avatar">
          {isAuthenticated
            ? (user.name || user.email || '?')[0].toUpperCase()
            : '?'}
        </div>
        <div className="profile-info">
          <div className="profile-name">
            {isAuthenticated ? (user.name || 'TI User') : 'Sign In'}
          </div>
          <div className="profile-sub">
            {isAuthenticated ? user.email : 'Sign in to your myTI account'}
          </div>
        </div>
        <svg className="profile-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </div>

      {/* App Settings Section */}
      <div className="settings-section">
        <div className="settings-section-header">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
          <span>App settings</span>
        </div>
        <div className="settings-group">
          <div className="settings-row">
            <span className="settings-label">Dark mode</span>
            <button
              className={`settings-toggle ${darkMode ? 'active' : ''}`}
              onClick={() => setDarkMode(!darkMode)}
              aria-label="Toggle dark mode"
            >
              <span className="toggle-knob" />
            </button>
          </div>
          <div className="settings-row settings-font-row">
            <div className="font-size-slider-row">
              <span className="font-size-label-small">A</span>
              <input
                type="range"
                min="0"
                max={FONT_SIZES.length - 1}
                value={fontSizeIndex}
                onChange={(e) => setFontSizeIndex(parseInt(e.target.value, 10))}
                className="font-size-slider"
              />
              <span className="font-size-label-large">A</span>
            </div>
            <div className="font-size-ticks">
              {FONT_SIZES.map((size, i) => (
                <button
                  key={i}
                  className={`font-size-tick ${i === fontSizeIndex ? 'active' : ''}`}
                  onClick={() => setFontSizeIndex(i)}
                >
                  {size.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Support Section */}
      <div className="settings-section">
        <div className="settings-section-header">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <span>Support</span>
        </div>
        <div className="settings-group">
          <a href="https://www.ti.com/myti-dashboard/docs/mytidashboard" target="_blank" rel="noopener noreferrer" className="settings-row">
            <span className="settings-label">My requests</span>
            <svg className="settings-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><polyline points="9 18 15 12 9 6" /></svg>
          </a>
        </div>
      </div>

      {/* Logout Button */}
      {isAuthenticated && (
        <div className="settings-section">
          <div className="settings-group">
            <button className="settings-row settings-logout" onClick={handleLogout}>
              <span className="settings-label">Log Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Settings;
