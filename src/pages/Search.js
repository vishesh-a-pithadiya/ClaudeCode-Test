import React, { useState, useEffect, useRef } from 'react';
import './Search.css';

// TI product catalog for local search suggestions
const TI_CATALOG = [
  { name: 'MSP430', category: 'Microcontrollers', desc: 'Ultra-low-power 16-bit MCUs', url: 'https://www.ti.com/microcontrollers-mcus-processors/msp430-microcontrollers/overview.html' },
  { name: 'MSP432', category: 'Microcontrollers', desc: '32-bit ARM Cortex-M4F MCUs', url: 'https://www.ti.com/microcontrollers-mcus-processors/arm-based-microcontrollers/overview.html' },
  { name: 'TMS320', category: 'Processors', desc: 'Digital Signal Processors', url: 'https://www.ti.com/microcontrollers-mcus-processors/digital-signal-processors/overview.html' },
  { name: 'CC2640', category: 'Wireless', desc: 'SimpleLink Bluetooth Low Energy', url: 'https://www.ti.com/wireless-connectivity/bluetooth/overview.html' },
  { name: 'CC3220', category: 'Wireless', desc: 'SimpleLink Wi-Fi MCU', url: 'https://www.ti.com/wireless-connectivity/wi-fi/overview.html' },
  { name: 'LM5164', category: 'Power Management', desc: '100-V input DC/DC converter', url: 'https://www.ti.com/power-management/overview.html' },
  { name: 'TPS6211x', category: 'Power Management', desc: '17-V, 1.5-A step-down converter', url: 'https://www.ti.com/power-management/non-isolated-dc-dc-switching-regulators/overview.html' },
  { name: 'LM358', category: 'Amplifiers', desc: 'Dual operational amplifier', url: 'https://www.ti.com/amplifier-circuit/op-amps/overview.html' },
  { name: 'OPA2134', category: 'Amplifiers', desc: 'SoundPlus audio op amp', url: 'https://www.ti.com/amplifier-circuit/op-amps/overview.html' },
  { name: 'ADS1115', category: 'Data Converters', desc: '16-bit ADC with PGA', url: 'https://www.ti.com/data-converters/adc-circuit/overview.html' },
  { name: 'DAC8564', category: 'Data Converters', desc: '16-bit quad DAC', url: 'https://www.ti.com/data-converters/dac-circuit/overview.html' },
  { name: 'SN74LVC', category: 'Logic', desc: 'Low-voltage CMOS logic', url: 'https://www.ti.com/logic-circuit/overview.html' },
  { name: 'TLV1117', category: 'Power Management', desc: '800-mA LDO regulator', url: 'https://www.ti.com/power-management/linear-regulators-ldo/overview.html' },
  { name: 'INA219', category: 'Sensors', desc: 'Current/power monitor with I2C', url: 'https://www.ti.com/sensor/current-sense-amplifiers/overview.html' },
  { name: 'HDC1080', category: 'Sensors', desc: 'Humidity & temperature sensor', url: 'https://www.ti.com/sensors/overview.html' },
  { name: 'DRV8825', category: 'Motor Drivers', desc: 'Stepper motor driver', url: 'https://www.ti.com/motor-drivers/overview.html' },
  { name: 'TM4C123', category: 'Microcontrollers', desc: 'Tiva C Series ARM Cortex-M4', url: 'https://www.ti.com/microcontrollers-mcus-processors/arm-based-microcontrollers/overview.html' },
  { name: 'BQ25895', category: 'Battery Management', desc: 'I2C controlled battery charger', url: 'https://www.ti.com/power-management/battery-management/overview.html' },
  { name: 'TXB0108', category: 'Logic', desc: '8-bit voltage-level translator', url: 'https://www.ti.com/logic-circuit/voltage-translation/overview.html' },
  { name: 'AM335x', category: 'Processors', desc: 'Sitara ARM Cortex-A8', url: 'https://www.ti.com/microcontrollers-mcus-processors/arm-based-processors/overview.html' },
];

const CATEGORIES = [
  { name: 'Products', icon: '🔧', url: 'https://www.ti.com' },
  { name: 'Microcontrollers', icon: '📟', url: 'https://www.ti.com/microcontrollers-mcus-processors/overview.html' },
  { name: 'Power Management', icon: '⚡', url: 'https://www.ti.com/power-management/overview.html' },
  { name: 'Wireless Connectivity', icon: '📡', url: 'https://www.ti.com/wireless-connectivity/overview.html' },
  { name: 'Amplifiers', icon: '📈', url: 'https://www.ti.com/amplifier-circuit/overview.html' },
  { name: 'Data Converters', icon: '🔄', url: 'https://www.ti.com/data-converters/overview.html' },
  { name: 'Reference Designs', icon: '📐', url: 'https://www.ti.com/reference-designs/index.html' },
  { name: 'Application Notes', icon: '📄', url: 'https://www.ti.com/lit/an' },
];

function Search() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Load recent searches from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('ti_recent_searches');
    if (stored) {
      try { setRecentSearches(JSON.parse(stored)); } catch {}
    }
  }, []);

  // Close suggestions on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target) &&
          inputRef.current && !inputRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Filter suggestions as user types
  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }
    const q = query.toLowerCase();
    const matched = TI_CATALOG.filter(item =>
      item.name.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.desc.toLowerCase().includes(q)
    ).slice(0, 5);

    const matchedCategories = CATEGORIES.filter(cat =>
      cat.name.toLowerCase().includes(q)
    ).slice(0, 3);

    setSuggestions({ products: matched, categories: matchedCategories });
  }, [query]);

  const saveRecentSearch = (term) => {
    const updated = [term, ...recentSearches.filter(s => s !== term)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('ti_recent_searches', JSON.stringify(updated));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      saveRecentSearch(query.trim());
      setShowSuggestions(false);
      window.open(
        `https://www.ti.com/sitesearch/en-us/docs/universalsearch.tsp?searchTerm=${encodeURIComponent(query.trim())}`,
        '_blank',
        'noopener,noreferrer'
      );
    }
  };

  const handleSuggestionClick = (item) => {
    saveRecentSearch(item.name);
    setShowSuggestions(false);
    setQuery('');
    window.open(item.url, '_blank', 'noopener,noreferrer');
  };

  const handleRecentClick = (term) => {
    setQuery(term);
    setShowSuggestions(false);
    window.open(
      `https://www.ti.com/sitesearch/en-us/docs/universalsearch.tsp?searchTerm=${encodeURIComponent(term)}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  const clearRecent = () => {
    setRecentSearches([]);
    localStorage.removeItem('ti_recent_searches');
  };

  const hasProducts = suggestions.products && suggestions.products.length > 0;
  const hasCategories = suggestions.categories && suggestions.categories.length > 0;
  const hasSuggestions = hasProducts || hasCategories;

  return (
    <div className="search">
      <h1>Search TI.com</h1>
      <p className="search-description">
        Search for products, datasheets, application notes, and more.
      </p>
      <div className="search-bar-wrapper">
        <form className="search-form" onSubmit={handleSearch}>
          <div className="search-input-wrapper">
            <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              className="search-input"
              placeholder="Part number, keyword, or description..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              autoComplete="off"
            />
            {query && (
              <button type="button" className="search-clear" onClick={() => { setQuery(''); inputRef.current.focus(); }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>
          <button type="submit" className="search-button">
            Search
          </button>
        </form>

        {showSuggestions && (
          <div className="search-suggestions" ref={suggestionsRef}>
            {hasSuggestions ? (
              <>
                {hasProducts && (
                  <div className="suggestion-section">
                    <div className="suggestion-header">Products</div>
                    {suggestions.products.map((item, i) => (
                      <button key={i} className="suggestion-item" onClick={() => handleSuggestionClick(item)}>
                        <div className="suggestion-main">
                          <span className="suggestion-name">{item.name}</span>
                          <span className="suggestion-desc">{item.desc}</span>
                        </div>
                        <span className="suggestion-category">{item.category}</span>
                      </button>
                    ))}
                  </div>
                )}
                {hasCategories && (
                  <div className="suggestion-section">
                    <div className="suggestion-header">Categories</div>
                    {suggestions.categories.map((cat, i) => (
                      <button key={i} className="suggestion-item" onClick={() => handleSuggestionClick(cat)}>
                        <span className="suggestion-cat-icon">{cat.icon}</span>
                        <span className="suggestion-name">{cat.name}</span>
                      </button>
                    ))}
                  </div>
                )}
                <button className="suggestion-search-all" onClick={handleSearch}>
                  Search all results for "<strong>{query}</strong>"
                </button>
              </>
            ) : query.trim() ? (
              <div className="suggestion-empty">
                <p>No suggestions found</p>
                <button className="suggestion-search-all" onClick={handleSearch}>
                  Search TI.com for "<strong>{query}</strong>"
                </button>
              </div>
            ) : recentSearches.length > 0 ? (
              <div className="suggestion-section">
                <div className="suggestion-header">
                  Recent Searches
                  <button className="suggestion-clear" onClick={clearRecent}>Clear</button>
                </div>
                {recentSearches.map((term, i) => (
                  <button key={i} className="suggestion-item" onClick={() => handleRecentClick(term)}>
                    <svg className="suggestion-recent-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    <span className="suggestion-name">{term}</span>
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        )}
      </div>

      {/* Browse categories when not searching */}
      {!query && (
        <div className="search-browse">
          <h3 className="browse-title">Browse Categories</h3>
          <div className="browse-grid">
            {CATEGORIES.map((cat, i) => (
              <a key={i} href={cat.url} target="_blank" rel="noopener noreferrer" className="browse-item">
                <span className="browse-icon">{cat.icon}</span>
                <span className="browse-name">{cat.name}</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Search;
