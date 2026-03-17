import React, { useState } from 'react';
import './Search.css';

function Search() {
  const [query, setQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      window.open(
        `https://www.ti.com/search?query=${encodeURIComponent(query.trim())}`,
        '_blank',
        'noopener,noreferrer'
      );
    }
  };

  return (
    <div className="search">
      <h1>Search TI.com</h1>
      <p className="search-description">
        Search the Texas Instruments website for products, datasheets, application notes, and more.
      </p>
      <form className="search-form" onSubmit={handleSearch}>
        <input
          type="text"
          className="search-input"
          placeholder="Search TI.com..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" className="search-button">
          Search
        </button>
      </form>
      <div className="search-links">
        <h3>Quick Links</h3>
        <ul>
          <li>
            <a href="https://www.ti.com/products.html" target="_blank" rel="noopener noreferrer">
              Products
            </a>
          </li>
          <li>
            <a href="https://www.ti.com/design-resources.html" target="_blank" rel="noopener noreferrer">
              Design Resources
            </a>
          </li>
          <li>
            <a href="https://www.ti.com/support.html" target="_blank" rel="noopener noreferrer">
              Support
            </a>
          </li>
          <li>
            <a href="https://www.ti.com/ordering.html" target="_blank" rel="noopener noreferrer">
              Order Now
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Search;
