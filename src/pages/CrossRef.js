import React, { useState, useRef, useEffect } from 'react';
import './CrossRef.css';

// Cross-reference database: competitor part → TI equivalent(s)
// Each entry: { competitor, manufacturer, tiParts: [{ part, description, url }] }
const CROSSREF_DB = [
  // --- Analog Devices (ADI) ---
  { competitor: 'AD8221', manufacturer: 'Analog Devices', category: 'Amplifiers', tiParts: [{ part: 'INA128', description: 'Precision, Low-Power Instrumentation Amplifier', url: 'https://www.ti.com/product/INA128' }] },
  { competitor: 'AD620', manufacturer: 'Analog Devices', category: 'Amplifiers', tiParts: [{ part: 'INA118', description: 'Precision, Low-Power Instrumentation Amplifier', url: 'https://www.ti.com/product/INA118' }] },
  { competitor: 'AD8605', manufacturer: 'Analog Devices', category: 'Amplifiers', tiParts: [{ part: 'OPA340', description: 'Single, Low-Power, Rail-to-Rail Op Amp', url: 'https://www.ti.com/product/OPA340' }] },
  { competitor: 'AD8628', manufacturer: 'Analog Devices', category: 'Amplifiers', tiParts: [{ part: 'OPA335', description: 'Zero-Drift, Single-Supply Op Amp', url: 'https://www.ti.com/product/OPA335' }] },
  { competitor: 'AD7124', manufacturer: 'Analog Devices', category: 'Data Converters', tiParts: [{ part: 'ADS1248', description: '24-Bit, 2kSPS Delta-Sigma ADC', url: 'https://www.ti.com/product/ADS1248' }] },
  { competitor: 'AD7606', manufacturer: 'Analog Devices', category: 'Data Converters', tiParts: [{ part: 'ADS8688', description: '16-Bit, 500kSPS, 8-Channel SAR ADC', url: 'https://www.ti.com/product/ADS8688' }] },
  { competitor: 'AD5689', manufacturer: 'Analog Devices', category: 'Data Converters', tiParts: [{ part: 'DAC8562', description: '16-Bit, Dual, Low-Power DAC', url: 'https://www.ti.com/product/DAC8562' }] },
  { competitor: 'AD9361', manufacturer: 'Analog Devices', category: 'RF & Wireless', tiParts: [{ part: 'AFE7769', description: 'Quad-Channel RF Transceiver', url: 'https://www.ti.com/product/AFE7769' }] },
  { competitor: 'ADP2303', manufacturer: 'Analog Devices', category: 'Power Management', tiParts: [{ part: 'TPS54302', description: '3A, 28V, Step-Down Converter', url: 'https://www.ti.com/product/TPS54302' }] },
  { competitor: 'ADP1720', manufacturer: 'Analog Devices', category: 'Power Management', tiParts: [{ part: 'TPS7A20', description: '250mA, Low-Noise LDO Regulator', url: 'https://www.ti.com/product/TPS7A20' }] },
  { competitor: 'ADXL345', manufacturer: 'Analog Devices', category: 'Sensors', tiParts: [{ part: 'ADXL345-ALT', description: 'See TI mmWave sensors for motion detection', url: 'https://www.ti.com/sensors/overview.html' }] },
  { competitor: 'ADG1608', manufacturer: 'Analog Devices', category: 'Switches & Mux', tiParts: [{ part: 'MUX36S08', description: '36V, Low-Capacitance 8:1 Mux', url: 'https://www.ti.com/product/MUX36S08' }] },
  { competitor: 'AD8418', manufacturer: 'Analog Devices', category: 'Amplifiers', tiParts: [{ part: 'INA240', description: 'High-Side, Bidirectional Current Sense Amp', url: 'https://www.ti.com/product/INA240' }] },

  // --- Microchip / Atmel ---
  { competitor: 'ATmega328P', manufacturer: 'Microchip', category: 'MCU', tiParts: [{ part: 'MSP430FR2355', description: '16-Bit, FRAM MCU with ADC', url: 'https://www.ti.com/product/MSP430FR2355' }] },
  { competitor: 'ATmega2560', manufacturer: 'Microchip', category: 'MCU', tiParts: [{ part: 'MSP430FR5994', description: '16-Bit, Ultra-Low-Power FRAM MCU', url: 'https://www.ti.com/product/MSP430FR5994' }] },
  { competitor: 'ATSAMD21', manufacturer: 'Microchip', category: 'MCU', tiParts: [{ part: 'CC2340', description: 'SimpleLink Arm Cortex-M0+ BLE MCU', url: 'https://www.ti.com/product/CC2340R5' }] },
  { competitor: 'PIC16F877A', manufacturer: 'Microchip', category: 'MCU', tiParts: [{ part: 'MSP430G2553', description: '16-Bit, Mixed-Signal MCU', url: 'https://www.ti.com/product/MSP430G2553' }] },
  { competitor: 'PIC32MX', manufacturer: 'Microchip', category: 'MCU', tiParts: [{ part: 'TM4C123GH6PM', description: '32-Bit ARM Cortex-M4F MCU', url: 'https://www.ti.com/product/TM4C123GH6PM' }] },
  { competitor: 'MCP2515', manufacturer: 'Microchip', category: 'Interface', tiParts: [{ part: 'TCAN4550', description: 'CAN FD Controller with Transceiver', url: 'https://www.ti.com/product/TCAN4550' }] },
  { competitor: 'MCP4725', manufacturer: 'Microchip', category: 'Data Converters', tiParts: [{ part: 'DAC5311', description: '8-Bit, Single-Channel DAC', url: 'https://www.ti.com/product/DAC5311' }] },
  { competitor: 'MCP3008', manufacturer: 'Microchip', category: 'Data Converters', tiParts: [{ part: 'ADS7828', description: '12-Bit, 8-Channel ADC', url: 'https://www.ti.com/product/ADS7828' }] },

  // --- STMicroelectronics ---
  { competitor: 'STM32F103', manufacturer: 'STMicroelectronics', category: 'MCU', tiParts: [{ part: 'TM4C1294NCPDT', description: '32-Bit ARM Cortex-M4F Connected MCU', url: 'https://www.ti.com/product/TM4C1294NCPDT' }] },
  { competitor: 'STM32F407', manufacturer: 'STMicroelectronics', category: 'MCU', tiParts: [{ part: 'AM2434', description: 'Sitara ARM Cortex-R5F Processor', url: 'https://www.ti.com/product/AM2434' }] },
  { competitor: 'STM32L476', manufacturer: 'STMicroelectronics', category: 'MCU', tiParts: [{ part: 'MSP432P401R', description: '32-Bit ARM Cortex-M4F Low-Power MCU', url: 'https://www.ti.com/product/MSP432P401R' }] },
  { competitor: 'STM32H743', manufacturer: 'STMicroelectronics', category: 'MCU', tiParts: [{ part: 'AM6232', description: 'Sitara ARM Cortex-A53 Processor', url: 'https://www.ti.com/product/AM6232' }] },
  { competitor: 'L298N', manufacturer: 'STMicroelectronics', category: 'Motor Drivers', tiParts: [{ part: 'DRV8871', description: '3.6A H-Bridge Motor Driver', url: 'https://www.ti.com/product/DRV8871' }] },
  { competitor: 'L7805', manufacturer: 'STMicroelectronics', category: 'Power Management', tiParts: [{ part: 'LM340', description: '5V, 1.5A Fixed Voltage Regulator', url: 'https://www.ti.com/product/LM340' }] },
  { competitor: 'LD1117', manufacturer: 'STMicroelectronics', category: 'Power Management', tiParts: [{ part: 'TLV1117', description: '800mA, Low-Dropout Regulator', url: 'https://www.ti.com/product/TLV1117' }] },
  { competitor: 'VL53L0X', manufacturer: 'STMicroelectronics', category: 'Sensors', tiParts: [{ part: 'OPT3101', description: 'Time-of-Flight Sensor', url: 'https://www.ti.com/product/OPT3101' }] },

  // --- NXP ---
  { competitor: 'LPC1768', manufacturer: 'NXP', category: 'MCU', tiParts: [{ part: 'TM4C1294NCPDT', description: '32-Bit ARM Cortex-M4F MCU with Ethernet', url: 'https://www.ti.com/product/TM4C1294NCPDT' }] },
  { competitor: 'i.MX6', manufacturer: 'NXP', category: 'Processors', tiParts: [{ part: 'AM625', description: 'Sitara ARM Cortex-A53 Processor', url: 'https://www.ti.com/product/AM625' }] },
  { competitor: 'i.MX8M', manufacturer: 'NXP', category: 'Processors', tiParts: [{ part: 'AM62A7', description: 'Sitara Vision Processor with AI', url: 'https://www.ti.com/product/AM62A7' }] },
  { competitor: 'TJA1050', manufacturer: 'NXP', category: 'Interface', tiParts: [{ part: 'TCAN330', description: 'CAN Transceiver', url: 'https://www.ti.com/product/TCAN330' }] },
  { competitor: 'PCA9685', manufacturer: 'NXP', category: 'LED Drivers', tiParts: [{ part: 'TLC5940', description: '16-Channel LED Driver with PWM', url: 'https://www.ti.com/product/TLC5940' }] },

  // --- Infineon / Cypress ---
  { competitor: 'IRF540N', manufacturer: 'Infineon', category: 'Power MOSFETs', tiParts: [{ part: 'CSD19536KCS', description: '100V, N-Channel NexFET Power MOSFET', url: 'https://www.ti.com/product/CSD19536KCS' }] },
  { competitor: 'IR2110', manufacturer: 'Infineon', category: 'Gate Drivers', tiParts: [{ part: 'UCC27211', description: '120V Half-Bridge Gate Driver', url: 'https://www.ti.com/product/UCC27211' }] },
  { competitor: 'IR2104', manufacturer: 'Infineon', category: 'Gate Drivers', tiParts: [{ part: 'UCC27201', description: '120V Half-Bridge Gate Driver', url: 'https://www.ti.com/product/UCC27201' }] },
  { competitor: 'IRS2092', manufacturer: 'Infineon', category: 'Audio', tiParts: [{ part: 'TPA3255', description: '315W Stereo Class-D Audio Amplifier', url: 'https://www.ti.com/product/TPA3255' }] },
  { competitor: 'PSoC 6', manufacturer: 'Infineon', category: 'MCU', tiParts: [{ part: 'CC2652R', description: 'SimpleLink Multiprotocol Wireless MCU', url: 'https://www.ti.com/product/CC2652R' }] },

  // --- ON Semiconductor / onsemi ---
  { competitor: 'NCP1117', manufacturer: 'onsemi', category: 'Power Management', tiParts: [{ part: 'TLV1117', description: '800mA, Low-Dropout Regulator', url: 'https://www.ti.com/product/TLV1117' }] },
  { competitor: 'NCV7356', manufacturer: 'onsemi', category: 'Interface', tiParts: [{ part: 'TCAN4550', description: 'CAN FD Controller with Transceiver', url: 'https://www.ti.com/product/TCAN4550' }] },
  { competitor: 'NCS20071', manufacturer: 'onsemi', category: 'Amplifiers', tiParts: [{ part: 'TLV9001', description: 'Single, 1MHz, RRIO Op Amp', url: 'https://www.ti.com/product/TLV9001' }] },
  { competitor: 'FAN7530', manufacturer: 'onsemi', category: 'Power Management', tiParts: [{ part: 'UCC28180', description: 'PFC Controller', url: 'https://www.ti.com/product/UCC28180' }] },

  // --- Maxim (now part of ADI) ---
  { competitor: 'MAX232', manufacturer: 'Maxim', category: 'Interface', tiParts: [{ part: 'MAX232', description: 'Dual RS-232 Driver/Receiver', url: 'https://www.ti.com/product/MAX232' }] },
  { competitor: 'MAX485', manufacturer: 'Maxim', category: 'Interface', tiParts: [{ part: 'SN65HVD72', description: 'RS-485 Transceiver', url: 'https://www.ti.com/product/SN65HVD72' }] },
  { competitor: 'MAX6675', manufacturer: 'Maxim', category: 'Data Converters', tiParts: [{ part: 'ADS1118', description: '16-Bit ADC with Thermocouple Support', url: 'https://www.ti.com/product/ADS1118' }] },
  { competitor: 'DS18B20', manufacturer: 'Maxim', category: 'Sensors', tiParts: [{ part: 'TMP117', description: 'High-Accuracy Digital Temperature Sensor', url: 'https://www.ti.com/product/TMP117' }] },
  { competitor: 'MAX17048', manufacturer: 'Maxim', category: 'Power Management', tiParts: [{ part: 'BQ27441', description: 'Battery Fuel Gauge', url: 'https://www.ti.com/product/BQ27441-G1' }] },

  // --- Renesas ---
  { competitor: 'ISL8117', manufacturer: 'Renesas', category: 'Power Management', tiParts: [{ part: 'TPS54560', description: '5A, 60V Step-Down Converter', url: 'https://www.ti.com/product/TPS54560' }] },
  { competitor: 'RX65N', manufacturer: 'Renesas', category: 'MCU', tiParts: [{ part: 'TM4C1294NCPDT', description: '32-Bit ARM Cortex-M4F MCU', url: 'https://www.ti.com/product/TM4C1294NCPDT' }] },
  { competitor: 'RA6M4', manufacturer: 'Renesas', category: 'MCU', tiParts: [{ part: 'MSPM0G3507', description: 'Arm Cortex-M0+ MCU', url: 'https://www.ti.com/product/MSPM0G3507' }] },

  // --- Qualcomm ---
  { competitor: 'QCA7000', manufacturer: 'Qualcomm', category: 'Communication', tiParts: [{ part: 'DP83867', description: 'Gigabit Ethernet PHY', url: 'https://www.ti.com/product/DP83867' }] },

  // --- FTDI ---
  { competitor: 'FT232R', manufacturer: 'FTDI', category: 'Interface', tiParts: [{ part: 'TUSB3410', description: 'USB to UART Bridge Controller', url: 'https://www.ti.com/product/TUSB3410' }] },
  { competitor: 'FT2232H', manufacturer: 'FTDI', category: 'Interface', tiParts: [{ part: 'TUSB8041', description: 'USB Hub Controller', url: 'https://www.ti.com/product/TUSB8041' }] },

  // --- Silicon Labs ---
  { competitor: 'CP2102', manufacturer: 'Silicon Labs', category: 'Interface', tiParts: [{ part: 'TUSB3410', description: 'USB to UART Bridge', url: 'https://www.ti.com/product/TUSB3410' }] },
  { competitor: 'EFM32', manufacturer: 'Silicon Labs', category: 'MCU', tiParts: [{ part: 'MSP430FR5969', description: '16-Bit, Ultra-Low-Power FRAM MCU', url: 'https://www.ti.com/product/MSP430FR5969' }] },
  { competitor: 'Si7021', manufacturer: 'Silicon Labs', category: 'Sensors', tiParts: [{ part: 'HDC2080', description: 'Low-Power Humidity & Temperature Sensor', url: 'https://www.ti.com/product/HDC2080' }] },

  // --- Vishay ---
  { competitor: 'TCPT1300', manufacturer: 'Vishay', category: 'Sensors', tiParts: [{ part: 'OPT3002', description: 'Light-to-Digital Sensor', url: 'https://www.ti.com/product/OPT3002' }] },

  // --- Bosch ---
  { competitor: 'BMP280', manufacturer: 'Bosch', category: 'Sensors', tiParts: [{ part: 'DRV5032', description: 'Ultra-Low-Power Hall Effect Sensor', url: 'https://www.ti.com/product/DRV5032' }] },
  { competitor: 'BME280', manufacturer: 'Bosch', category: 'Sensors', tiParts: [{ part: 'HDC2080', description: 'Humidity & Temperature Sensor', url: 'https://www.ti.com/product/HDC2080' }] },

  // --- Espressif ---
  { competitor: 'ESP32', manufacturer: 'Espressif', category: 'MCU / Wireless', tiParts: [{ part: 'CC3235S', description: 'SimpleLink Wi-Fi Dual-Band MCU', url: 'https://www.ti.com/product/CC3235S' }] },
  { competitor: 'ESP8266', manufacturer: 'Espressif', category: 'MCU / Wireless', tiParts: [{ part: 'CC3120', description: 'SimpleLink Wi-Fi Network Processor', url: 'https://www.ti.com/product/CC3120' }] },

  // --- Nordic ---
  { competitor: 'nRF52832', manufacturer: 'Nordic', category: 'MCU / Wireless', tiParts: [{ part: 'CC2652R', description: 'SimpleLink Multiprotocol Wireless MCU', url: 'https://www.ti.com/product/CC2652R' }] },
  { competitor: 'nRF52840', manufacturer: 'Nordic', category: 'MCU / Wireless', tiParts: [{ part: 'CC2652P', description: 'Multiprotocol Wireless MCU with PA', url: 'https://www.ti.com/product/CC2652P' }] },
  { competitor: 'nRF5340', manufacturer: 'Nordic', category: 'MCU / Wireless', tiParts: [{ part: 'CC2674R10', description: 'Multiprotocol Wireless MCU', url: 'https://www.ti.com/product/CC2674R10' }] },
];

function CrossRef() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target) &&
          inputRef.current && !inputRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (value) => {
    setQuery(value);
    if (value.trim().length >= 2) {
      const q = value.trim().toLowerCase();
      const matched = CROSSREF_DB.filter(entry =>
        entry.competitor.toLowerCase().includes(q) ||
        entry.manufacturer.toLowerCase().includes(q)
      ).slice(0, 8);
      setSuggestions(matched);
      setShowSuggestions(matched.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const doSearch = (searchQuery) => {
    const q = (searchQuery || query).trim().toLowerCase();
    if (!q) return;
    setShowSuggestions(false);
    setSearched(true);

    const matched = CROSSREF_DB.filter(entry =>
      entry.competitor.toLowerCase().includes(q) ||
      entry.manufacturer.toLowerCase().includes(q) ||
      entry.category.toLowerCase().includes(q) ||
      entry.tiParts.some(tp => tp.part.toLowerCase().includes(q))
    );
    setResults(matched);
  };

  const selectSuggestion = (entry) => {
    setQuery(entry.competitor);
    setShowSuggestions(false);
    setSearched(true);
    setResults([entry]);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      doSearch();
    }
  };

  return (
    <div className="crossref-page">
      <h1 className="crossref-title" onClick={() => { setQuery(''); setResults([]); setSearched(false); setSuggestions([]); setShowSuggestions(false); }} style={{ cursor: 'pointer' }}>CrossRef</h1>
      <p className="crossref-subtitle">
        Find TI equivalents for competitor semiconductor parts
      </p>

      {/* Search input */}
      <div className="crossref-search-wrapper">
        <div className="crossref-search-box">
          <svg className="crossref-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            className="crossref-input"
            placeholder="Enter competitor part (e.g. STM32F103, AD8221)"
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          />
          {query && (
            <button className="crossref-clear" onClick={() => { setQuery(''); setResults([]); setSearched(false); setSuggestions([]); }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            </button>
          )}
        </div>
        <button className="crossref-search-btn" onClick={() => doSearch()}>Search</button>

        {/* Suggestions dropdown */}
        {showSuggestions && (
          <div ref={suggestionsRef} className="crossref-suggestions">
            {suggestions.map((entry, i) => (
              <button key={i} className="crossref-suggestion-item" onClick={() => selectSuggestion(entry)}>
                <span className="suggestion-part">{entry.competitor}</span>
                <span className="suggestion-mfr">{entry.manufacturer}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Results */}
      {searched && results.length === 0 && (
        <div className="crossref-no-results">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="40" height="40">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <p>No cross-reference found for "<strong>{query}</strong>"</p>
          <p className="crossref-no-results-hint">Try searching by part number, manufacturer, or category</p>
          <a
            href={`https://www.ti.com/cross-reference-search-results.html#702702702702702702702702702702702702702702702702702?searchTerm=${encodeURIComponent(query)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="crossref-ti-link"
          >
            Search on TI.com
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </a>
        </div>
      )}

      {results.length > 0 && (
        <div className="crossref-results">
          {results.map((entry, i) => (
            <div key={i} className="crossref-result-card">
              <div className="crossref-competitor">
                <div className="crossref-competitor-header">
                  <span className="crossref-competitor-part">{entry.competitor}</span>
                  <span className="crossref-competitor-badge">{entry.manufacturer}</span>
                </div>
                <span className="crossref-competitor-category">{entry.category}</span>
              </div>

              <div className="crossref-arrow">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <polyline points="19 12 12 19 5 12" />
                </svg>
              </div>

              {entry.tiParts.map((tp, j) => (
                <a key={j} href={tp.url} target="_blank" rel="noopener noreferrer" className="crossref-ti-part">
                  <div className="crossref-ti-part-info">
                    <span className="crossref-ti-part-number">{tp.part}</span>
                    <span className="crossref-ti-part-desc">{tp.description}</span>
                  </div>
                  <div className="crossref-ti-part-action">
                    <span className="crossref-view-label">View</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </div>
                </a>
              ))}
            </div>
          ))}

          <div className="crossref-actions">
            <button className="crossref-new-search" onClick={() => { setQuery(''); setResults([]); setSearched(false); setSuggestions([]); setShowSuggestions(false); inputRef.current && inputRef.current.focus(); }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              New Search
            </button>
            <a
              href={`https://www.ti.com/cross-reference-search-results.html?searchTerm=${encodeURIComponent(query)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="crossref-ti-link"
            >
              See more on TI.com
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
          </div>
        </div>
      )}

      {/* Browse by manufacturer */}
      {!searched && (
        <div className="crossref-browse">
          <h3 className="crossref-browse-title">Browse by Manufacturer</h3>
          <div className="crossref-mfr-grid">
            {['Analog Devices', 'STMicroelectronics', 'Microchip', 'NXP', 'Infineon', 'onsemi', 'Maxim', 'Nordic', 'Espressif', 'Renesas', 'Silicon Labs', 'FTDI'].map(mfr => (
              <button key={mfr} className="crossref-mfr-chip" onClick={() => { setQuery(mfr); doSearch(mfr); }}>
                {mfr}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default CrossRef;
