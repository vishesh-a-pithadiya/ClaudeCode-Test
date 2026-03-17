import React from 'react';
import './E2E.css';

function E2E() {
  return (
    <div className="e2e">
      <h1>E2E Community</h1>
      <p className="e2e-description">
        The TI E2E support forums are an engineer's go-to source for fast,
        verified answers and design help — straight from the experts at TI and
        the community.
      </p>
      <div className="e2e-sections">
        <div className="e2e-section">
          <h3>Ask a Question</h3>
          <p>Post your technical questions and get answers from TI experts and community members.</p>
        </div>
        <div className="e2e-section">
          <h3>Browse Forums</h3>
          <p>Explore discussions across analog, embedded processing, wireless, and more.</p>
        </div>
        <div className="e2e-section">
          <h3>Knowledge Base</h3>
          <p>Search through articles, FAQs, and troubleshooting guides.</p>
        </div>
      </div>
    </div>
  );
}

export default E2E;
