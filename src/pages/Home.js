import React from 'react';
import './Home.css';

function Home() {
  return (
    <div className="home">
      <h1>Welcome to Texas Instruments</h1>
      <p className="home-subtitle">
        Semiconductors, processors, and embedded technology for a smarter world.
      </p>
      <div className="home-cards">
        <div className="card">
          <h3>Products</h3>
          <p>Explore our wide range of analog and embedded processing products.</p>
        </div>
        <div className="card">
          <h3>Design Resources</h3>
          <p>Access reference designs, tools, and technical documentation.</p>
        </div>
        <div className="card">
          <h3>Support</h3>
          <p>Get help from our community and technical support teams.</p>
        </div>
      </div>
    </div>
  );
}

export default Home;
