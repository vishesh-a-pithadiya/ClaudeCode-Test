import React from 'react';

function ChipIcon({ size = 28, color = '#cc0000' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Center chip body */}
      <rect x="16" y="16" width="32" height="32" rx="3" fill={color} />
      {/* Inner die */}
      <rect x="22" y="22" width="20" height="20" rx="2" fill="#fff" opacity="0.3" />
      <rect x="26" y="26" width="12" height="12" rx="1" fill="#fff" opacity="0.4" />

      {/* Top pins */}
      <rect x="22" y="8" width="4" height="10" rx="1" fill={color} />
      <rect x="30" y="8" width="4" height="10" rx="1" fill={color} />
      <rect x="38" y="8" width="4" height="10" rx="1" fill={color} />

      {/* Bottom pins */}
      <rect x="22" y="46" width="4" height="10" rx="1" fill={color} />
      <rect x="30" y="46" width="4" height="10" rx="1" fill={color} />
      <rect x="38" y="46" width="4" height="10" rx="1" fill={color} />

      {/* Left pins */}
      <rect x="8" y="22" width="10" height="4" rx="1" fill={color} />
      <rect x="8" y="30" width="10" height="4" rx="1" fill={color} />
      <rect x="8" y="38" width="10" height="4" rx="1" fill={color} />

      {/* Right pins */}
      <rect x="46" y="22" width="10" height="4" rx="1" fill={color} />
      <rect x="46" y="30" width="10" height="4" rx="1" fill={color} />
      <rect x="46" y="38" width="10" height="4" rx="1" fill={color} />
    </svg>
  );
}

export default ChipIcon;
