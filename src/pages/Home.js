import React from 'react';
import ChipIcon from '../components/ChipIcon';
import './Home.css';

function Home() {
  return (
    <div className="home">
      <div className="hero">
        <h1>Welcome to <span className="highlight">TI App</span></h1>
        <p className="home-subtitle">
          Semiconductors, processors, and embedded technology for a smarter world.
        </p>
      </div>
      <div className="home-sections">
        <div className="home-section">
          <div className="section-icon"><ChipIcon size={40} color="#222" /></div>
          <div className="section-text">
            <h3>Products</h3>
            <p>Explore our wide range of analog and embedded processing products.</p>
          </div>
        </div>
        <a href="https://www.ti.com/reference-designs/index.html" target="_blank" rel="noopener noreferrer" className="home-section">
          <div className="section-icon">🔧</div>
          <div className="section-text">
            <h3>Design Resources</h3>
            <p>Access reference designs, tools, and technical documentation.</p>
          </div>
        </a>
        <div className="home-section">
          <div className="section-icon">💬</div>
          <div className="section-text">
            <h3>Support</h3>
            <p>Get help from our community and technical support teams.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
