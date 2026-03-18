import React, { useState } from 'react';
import './Home.css';

function Home() {
  const [designOpen, setDesignOpen] = useState(false);

  return (
    <div className="home">
      <div className="hero">
        <h1>Welcome to <span className="highlight">TI App</span></h1>
        <p className="home-subtitle">
          Semiconductors, processors, and embedded technology for a smarter world.
        </p>
      </div>
      <div className="home-sections">
        <a href="https://www.ti.com" target="_blank" rel="noopener noreferrer" className="home-section">
          <div className="section-icon">
            <svg className="section-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4" y="4" width="16" height="16" rx="2" />
              <rect x="8" y="8" width="8" height="8" rx="1" />
              <line x1="12" y1="2" x2="12" y2="4" />
              <line x1="8" y1="2" x2="8" y2="4" />
              <line x1="16" y1="2" x2="16" y2="4" />
              <line x1="12" y1="20" x2="12" y2="22" />
              <line x1="8" y1="20" x2="8" y2="22" />
              <line x1="16" y1="20" x2="16" y2="22" />
              <line x1="2" y1="12" x2="4" y2="12" />
              <line x1="2" y1="8" x2="4" y2="8" />
              <line x1="2" y1="16" x2="4" y2="16" />
              <line x1="20" y1="12" x2="22" y2="12" />
              <line x1="20" y1="8" x2="22" y2="8" />
              <line x1="20" y1="16" x2="22" y2="16" />
            </svg>
          </div>
          <div className="section-text">
            <h3>Products</h3>
          </div>
        </a>
        <div className="home-section-wrapper">
          <div className="home-section" onClick={() => setDesignOpen(!designOpen)} style={{ cursor: 'pointer' }}>
            <div className="section-icon">
              <svg className="section-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
              </svg>
            </div>
            <div className="section-text">
              <h3>Design Resources</h3>
            </div>
            <span className={`section-chevron ${designOpen ? 'open' : ''}`}>▸</span>
          </div>
          {designOpen && (
            <div className="sub-options">
              <a href="https://www.ti.com/reference-designs/index.html" target="_blank" rel="noopener noreferrer" className="sub-option">
                TI Reference Designs
              </a>
              <a href="https://www.ti.com/customer-support/request-form?referer=E2E&si=8" target="_blank" rel="noopener noreferrer" className="sub-option">
                TI Design Review
              </a>
            </div>
          )}
        </div>
        <div className="home-section">
          <div className="section-icon">
            <svg className="section-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0z" />
            </svg>
          </div>
          <div className="section-text">
            <h3>Support</h3>
          </div>
        </div>
        <div className="home-section">
          <div className="section-icon">
            <svg className="section-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
          </div>
          <div className="section-text">
            <h3>Dashboard</h3>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
