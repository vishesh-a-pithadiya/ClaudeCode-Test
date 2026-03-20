import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Products.css';

// Sector → End Equipment → Sub-systems (final level links to TI.com)
const PRODUCT_TREE = {
  'Automotive': {
    'ADAS': [
      { name: 'Radar Sensors', url: 'https://www.ti.com/sensors/mmwave-radar/overview.html' },
      { name: 'Camera & Vision Processing', url: 'https://www.ti.com/video-surveillance/camera/overview.html' },
      { name: 'Lidar', url: 'https://www.ti.com/sensors/specialty-sensors/overview.html' },
      { name: 'Power Management', url: 'https://www.ti.com/power-management/overview.html' },
      { name: 'Processors', url: 'https://www.ti.com/microcontrollers-mcus-processors/arm-based-processors/overview.html' },
      { name: 'Interface & Connectivity', url: 'https://www.ti.com/interface/overview.html' },
    ],
    'Body Electronics': [
      { name: 'Lighting & LED Drivers', url: 'https://www.ti.com/power-management/led-drivers/overview.html' },
      { name: 'Motor Control', url: 'https://www.ti.com/motor-drivers/overview.html' },
      { name: 'Body Control Modules', url: 'https://www.ti.com/microcontrollers-mcus-processors/overview.html' },
      { name: 'Climate Control', url: 'https://www.ti.com/sensors/temperature-sensors/overview.html' },
      { name: 'Door & Seat Modules', url: 'https://www.ti.com/motor-drivers/brushed-dc-bdc/overview.html' },
    ],
    'EV / HEV': [
      { name: 'Battery Management Systems', url: 'https://www.ti.com/power-management/battery-management/overview.html' },
      { name: 'Traction Inverter', url: 'https://www.ti.com/motor-drivers/overview.html' },
      { name: 'On-Board Charger', url: 'https://www.ti.com/power-management/overview.html' },
      { name: 'DC/DC Converter', url: 'https://www.ti.com/power-management/non-isolated-dc-dc-switching-regulators/overview.html' },
      { name: 'Gate Drivers', url: 'https://www.ti.com/power-management/gate-drivers/overview.html' },
    ],
    'Infotainment': [
      { name: 'Display & Graphics', url: 'https://www.ti.com/display-technology/overview.html' },
      { name: 'Audio Amplifiers', url: 'https://www.ti.com/audio-ic/amplifiers/overview.html' },
      { name: 'Connectivity (Wi-Fi / BT)', url: 'https://www.ti.com/wireless-connectivity/overview.html' },
      { name: 'Processors & SoCs', url: 'https://www.ti.com/microcontrollers-mcus-processors/arm-based-processors/overview.html' },
    ],
  },
  'Personal Electronics': {
    'Smartphones & Tablets': [
      { name: 'Battery Charging', url: 'https://www.ti.com/power-management/battery-management/overview.html' },
      { name: 'Power Management', url: 'https://www.ti.com/power-management/overview.html' },
      { name: 'Audio Amplifiers', url: 'https://www.ti.com/audio-ic/amplifiers/overview.html' },
      { name: 'Display Drivers', url: 'https://www.ti.com/display-technology/overview.html' },
      { name: 'Haptic Drivers', url: 'https://www.ti.com/motor-drivers/overview.html' },
      { name: 'USB Type-C & PD', url: 'https://www.ti.com/interface/usb/overview.html' },
    ],
    'Laptops & PCs': [
      { name: 'Battery Management', url: 'https://www.ti.com/power-management/battery-management/overview.html' },
      { name: 'DC/DC Converters', url: 'https://www.ti.com/power-management/non-isolated-dc-dc-switching-regulators/overview.html' },
      { name: 'USB & Thunderbolt', url: 'https://www.ti.com/interface/usb/overview.html' },
      { name: 'Audio Codecs', url: 'https://www.ti.com/audio-ic/overview.html' },
      { name: 'Wireless Connectivity', url: 'https://www.ti.com/wireless-connectivity/overview.html' },
    ],
    'Wearables': [
      { name: 'Biosensing AFE', url: 'https://www.ti.com/sensors/overview.html' },
      { name: 'Low-Power MCUs', url: 'https://www.ti.com/microcontrollers-mcus-processors/msp430-microcontrollers/overview.html' },
      { name: 'Battery Chargers', url: 'https://www.ti.com/power-management/battery-management/overview.html' },
      { name: 'BLE Connectivity', url: 'https://www.ti.com/wireless-connectivity/bluetooth/overview.html' },
      { name: 'Display Drivers', url: 'https://www.ti.com/display-technology/overview.html' },
    ],
    'Smart Home': [
      { name: 'Wi-Fi & BLE', url: 'https://www.ti.com/wireless-connectivity/overview.html' },
      { name: 'Sensors', url: 'https://www.ti.com/sensors/overview.html' },
      { name: 'Power Management', url: 'https://www.ti.com/power-management/overview.html' },
      { name: 'Audio & Voice', url: 'https://www.ti.com/audio-ic/overview.html' },
      { name: 'Motor Control', url: 'https://www.ti.com/motor-drivers/overview.html' },
    ],
    'Gaming & VR': [
      { name: 'Display Processing', url: 'https://www.ti.com/display-technology/overview.html' },
      { name: 'Haptic Feedback', url: 'https://www.ti.com/motor-drivers/overview.html' },
      { name: 'Audio Amplifiers', url: 'https://www.ti.com/audio-ic/amplifiers/overview.html' },
      { name: 'Power Management', url: 'https://www.ti.com/power-management/overview.html' },
      { name: 'Sensing & Tracking', url: 'https://www.ti.com/sensors/overview.html' },
    ],
  },
  'Industrial': {
    'Power Systems': [
      { name: 'AC/DC & DC/DC Conversion', url: 'https://www.ti.com/power-management/overview.html' },
      { name: 'UPS & Backup Power', url: 'https://www.ti.com/power-management/ac-dc-isolated/overview.html' },
      { name: 'Solar Inverters', url: 'https://www.ti.com/microcontrollers-mcus-processors/c2000-real-time-control-mcus/overview.html' },
      { name: 'Gate Drivers', url: 'https://www.ti.com/power-management/gate-drivers/overview.html' },
      { name: 'Current & Voltage Sensing', url: 'https://www.ti.com/sensor/current-sense-amplifiers/overview.html' },
      { name: 'Protection & Isolation', url: 'https://www.ti.com/isolation/overview.html' },
    ],
    'Factory Automation': [
      { name: 'PLC / IO Modules', url: 'https://www.ti.com/microcontrollers-mcus-processors/arm-based-processors/overview.html' },
      { name: 'Motor Drives', url: 'https://www.ti.com/motor-drivers/overview.html' },
      { name: 'Industrial Communication', url: 'https://www.ti.com/interface/industrial-ethernet/overview.html' },
      { name: 'Sensor Transmitters', url: 'https://www.ti.com/sensors/overview.html' },
      { name: 'HMI & Display', url: 'https://www.ti.com/display-technology/overview.html' },
      { name: 'Power Supply', url: 'https://www.ti.com/power-management/overview.html' },
    ],
    'Building Automation': [
      { name: 'HVAC Control', url: 'https://www.ti.com/sensors/temperature-sensors/overview.html' },
      { name: 'Lighting Control', url: 'https://www.ti.com/power-management/led-drivers/overview.html' },
      { name: 'Wireless Connectivity', url: 'https://www.ti.com/wireless-connectivity/overview.html' },
      { name: 'Occupancy Sensing', url: 'https://www.ti.com/sensors/mmwave-radar/overview.html' },
      { name: 'Metering', url: 'https://www.ti.com/data-converters/adc-circuit/overview.html' },
    ],
    'Test & Measurement': [
      { name: 'Data Acquisition', url: 'https://www.ti.com/data-converters/adc-circuit/overview.html' },
      { name: 'Signal Conditioning', url: 'https://www.ti.com/amplifier-circuit/op-amps/overview.html' },
      { name: 'Signal Generation', url: 'https://www.ti.com/data-converters/dac-circuit/overview.html' },
      { name: 'Power Measurement', url: 'https://www.ti.com/sensor/current-sense-amplifiers/overview.html' },
      { name: 'Isolation & Interface', url: 'https://www.ti.com/isolation/overview.html' },
    ],
    'Robotics': [
      { name: 'Motor Control', url: 'https://www.ti.com/motor-drivers/overview.html' },
      { name: 'Sensing & Vision', url: 'https://www.ti.com/sensors/mmwave-radar/overview.html' },
      { name: 'Processing', url: 'https://www.ti.com/microcontrollers-mcus-processors/arm-based-processors/overview.html' },
      { name: 'Communication', url: 'https://www.ti.com/interface/industrial-ethernet/overview.html' },
      { name: 'Power Management', url: 'https://www.ti.com/power-management/overview.html' },
    ],
  },
  'Aerospace & Defence': {
    'Avionics': [
      { name: 'Flight Control Processing', url: 'https://www.ti.com/microcontrollers-mcus-processors/overview.html' },
      { name: 'Navigation & GPS', url: 'https://www.ti.com/sensors/overview.html' },
      { name: 'Communication Systems', url: 'https://www.ti.com/rf-microwave/overview.html' },
      { name: 'Power Conversion', url: 'https://www.ti.com/power-management/overview.html' },
      { name: 'Data Buses (MIL-STD-1553)', url: 'https://www.ti.com/interface/overview.html' },
      { name: 'Display Systems', url: 'https://www.ti.com/display-technology/overview.html' },
    ],
    'Radar & EW': [
      { name: 'RF Signal Chain', url: 'https://www.ti.com/rf-microwave/overview.html' },
      { name: 'Data Converters', url: 'https://www.ti.com/data-converters/overview.html' },
      { name: 'Signal Processing', url: 'https://www.ti.com/microcontrollers-mcus-processors/digital-signal-processors/overview.html' },
      { name: 'Power Amplifiers', url: 'https://www.ti.com/amplifier-circuit/overview.html' },
      { name: 'Clocking & Timing', url: 'https://www.ti.com/clock-and-timing/overview.html' },
    ],
    'Unmanned Systems': [
      { name: 'Motor & Servo Control', url: 'https://www.ti.com/motor-drivers/overview.html' },
      { name: 'Navigation & IMU', url: 'https://www.ti.com/sensors/overview.html' },
      { name: 'Battery Management', url: 'https://www.ti.com/power-management/battery-management/overview.html' },
      { name: 'Wireless Links', url: 'https://www.ti.com/wireless-connectivity/overview.html' },
      { name: 'Embedded Processing', url: 'https://www.ti.com/microcontrollers-mcus-processors/arm-based-microcontrollers/overview.html' },
    ],
    'Space & Satellites': [
      { name: 'Radiation-Tolerant Power', url: 'https://www.ti.com/power-management/overview.html' },
      { name: 'Data Conversion', url: 'https://www.ti.com/data-converters/overview.html' },
      { name: 'Clocking', url: 'https://www.ti.com/clock-and-timing/overview.html' },
      { name: 'Interface', url: 'https://www.ti.com/interface/overview.html' },
    ],
  },
  'Enterprise': {
    'Server & Data Center': [
      { name: 'Power Delivery', url: 'https://www.ti.com/power-management/non-isolated-dc-dc-switching-regulators/overview.html' },
      { name: 'Data Converters', url: 'https://www.ti.com/data-converters/overview.html' },
      { name: 'Clocking & Timing', url: 'https://www.ti.com/clock-and-timing/overview.html' },
      { name: 'Thermal Management', url: 'https://www.ti.com/sensors/temperature-sensors/overview.html' },
      { name: 'Hot-Swap & eFuse', url: 'https://www.ti.com/power-management/power-switches/overview.html' },
    ],
    'Networking & Telecom': [
      { name: 'Ethernet PHY & Switch', url: 'https://www.ti.com/interface/ethernet/overview.html' },
      { name: 'Processors', url: 'https://www.ti.com/microcontrollers-mcus-processors/arm-based-processors/overview.html' },
      { name: 'Power Over Ethernet', url: 'https://www.ti.com/interface/ethernet/power-over-ethernet-poe/overview.html' },
      { name: 'Voltage Translation', url: 'https://www.ti.com/logic-circuit/voltage-translation/overview.html' },
      { name: 'RS-485 / CAN', url: 'https://www.ti.com/interface/rs-485-rs-422/overview.html' },
    ],
    'Storage': [
      { name: 'HDD Motor Control', url: 'https://www.ti.com/motor-drivers/overview.html' },
      { name: 'Power Management', url: 'https://www.ti.com/power-management/overview.html' },
      { name: 'Data Interface', url: 'https://www.ti.com/interface/overview.html' },
      { name: 'Signal Integrity', url: 'https://www.ti.com/interface/signal-conditioners-retimers-redrivers/overview.html' },
    ],
    'Enterprise Wireless': [
      { name: 'Wi-Fi Access Points', url: 'https://www.ti.com/wireless-connectivity/wi-fi/overview.html' },
      { name: 'Bluetooth / BLE', url: 'https://www.ti.com/wireless-connectivity/bluetooth/overview.html' },
      { name: 'Sub-1 GHz', url: 'https://www.ti.com/wireless-connectivity/sub-1-ghz/overview.html' },
      { name: 'Antenna & RF', url: 'https://www.ti.com/rf-microwave/overview.html' },
    ],
  },
};

const LEVEL_LABELS = ['Sector', 'End Equipment', 'Sub-system'];

function Products() {
  const navigate = useNavigate();
  const [path, setPath] = useState([]);

  const getCurrentItems = () => {
    let node = PRODUCT_TREE;
    for (const key of path) {
      node = node[key];
    }
    return node;
  };

  const items = getCurrentItems();
  const isSubsystems = Array.isArray(items);
  const currentLevel = path.length;

  const goBack = () => {
    setPath(path.slice(0, -1));
  };

  const selectItem = (key) => {
    setPath([...path, key]);
  };

  return (
    <div className="products-page">
      <button className="products-home-back" onClick={() => navigate('/home')}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Home
      </button>
      <h1>TI Products</h1>

      {/* Breadcrumb */}
      <div className="products-breadcrumb">
        <button
          className={`breadcrumb-item ${path.length === 0 ? 'active' : ''}`}
          onClick={() => setPath([])}
        >
          All
        </button>
        {path.map((segment, i) => (
          <React.Fragment key={i}>
            <svg className="breadcrumb-sep" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="12" height="12">
              <polyline points="9 18 15 12 9 6" />
            </svg>
            <button
              className={`breadcrumb-item ${i === path.length - 1 ? 'active' : ''}`}
              onClick={() => setPath(path.slice(0, i + 1))}
            >
              {segment}
            </button>
          </React.Fragment>
        ))}
      </div>

      {/* Level indicator */}
      <div className="products-level">
        {currentLevel < LEVEL_LABELS.length
          ? `Select ${LEVEL_LABELS[currentLevel]}`
          : 'Browse on TI.com'}
      </div>

      {/* Back button */}
      {path.length > 0 && (
        <button className="products-back" onClick={goBack}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back
        </button>
      )}

      {/* Items */}
      <div className="products-tree-list">
        {isSubsystems ? (
          items.map((sub, i) => (
            <a key={i} href={sub.url} target="_blank" rel="noopener noreferrer" className="product-tree-subsystem">
              <span className="product-tree-subsystem-name">{sub.name}</span>
              <svg className="product-tree-external" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
          ))
        ) : (
          Object.keys(items).map((key) => {
            const child = items[key];
            const count = Array.isArray(child) ? child.length : countChildren(child);
            return (
              <button key={key} className="product-tree-item" onClick={() => selectItem(key)}>
                <span className="product-tree-item-name">{key}</span>
                <div className="product-tree-item-right">
                  <span className="product-tree-item-count">{count}</span>
                  <svg className="product-tree-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

function countChildren(node) {
  if (Array.isArray(node)) return node.length;
  let count = 0;
  for (const key of Object.keys(node)) {
    count += Array.isArray(node[key]) ? node[key].length : countChildren(node[key]);
  }
  return count;
}

export default Products;
