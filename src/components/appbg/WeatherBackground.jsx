import { useEffect } from 'react';

// Helper function to convert hex to HSL
const hexToHsl = (hex) => {
  let r = 0, g = 0, b = 0;
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex.slice(1, 3), 16);
    g = parseInt(hex.slice(3, 5), 16);
    b = parseInt(hex.slice(5, 7), 16);
  }
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h *= 60;
  }
  return [h, s * 100, l * 100];
};

// Helper function to convert HSL to hex
const hslToHex = (h, s, l) => {
  h /= 360;
  s /= 100;
  l /= 100;

  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  const toHex = (x) => {
    const hex = Math.round(x * 255).toString(16);
    return hex.padStart(2, '0');
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

const getTimePeriod = (hour) => {
  if (hour >= 6 && hour <= 9) return 'morning';
  if (hour >= 12 && hour <= 15) return 'afternoon';
  if (hour >= 18 && hour < 21) return 'evening';
  return 'night';
};

const getBaseGradient = (description, timePeriod) => {
  const desc = description.toLowerCase();
// console.log(desc);

  // Group 800: Clear
  if (desc.includes('clear')) {
    switch(timePeriod) {
      case 'morning': return ['#FFD700', '#87CEEB']; // Sunrise gold to sky blue
      case 'afternoon': return ['#87CEEB', '#4682B4']; // Bright sky
      case 'evening': return ['#FF4500', '#8A2BE2']; // Sunset orange to royal purple
      case 'night': return ['#191970', '#000c15']; // Deep navy
      default: return ['#87CEEB', '#4682B4'];
    }
  }

  // Group 80x: Clouds
  if (desc.includes('clouds')) {
    switch(timePeriod) {
      case 'morning': return ['#B0C4DE', '#778899']; // Light steel
      case 'afternoon': return ['#778899', '#708090']; // Slate gray
      case 'evening': return ['#696969', '#2F4F4F']; // Dim gray
      case 'night': return ['#2F4F4F', '#1C1C1C']; // Dark slate
      default: return ['#B0C4DE', '#778899'];
    }
  }

  // Group 2xx: Thunderstorm
  if (desc.includes('thunderstorm')) {
    return timePeriod === 'night' 
      ? ['#301934', '#000000']  // Darker purple at night
      : ['#4B0082', '#000000']; // Indigo during daylight
  }

  // Group 3xx: Drizzle
  if (desc.includes('drizzle')) {
    switch(timePeriod) {
      case 'morning': return ['#A9A9A9', '#808080'];
      case 'afternoon': return ['#808080', '#696969'];
      case 'evening': return ['#696969', '#4F4F4F'];
      case 'night': return ['#2F4F4F', '#1C1C1C'];
      default: return ['#808080', '#696969'];
    }
  }

  // Group 5xx: Rain
  if (desc.includes('rain')) {
    switch(timePeriod) {
      case 'morning': return ['#668899', '#556677'];
      case 'afternoon': return ['#556677', '#445566'];
      case 'evening': return ['#445566', '#334455'];
      case 'night': return ['#334455', '#223344'];
      default: return ['#556677', '#445566'];
    }
  }

  // Group 6xx: Snow
  if (desc.includes('snow')) {
    return timePeriod === 'night'
      ? ['#F0F8FF', '#D3D3D3']  // Blue-tinged snow at night
      : ['#FFFFFF', '#E0E0E0'];  // Bright white during day
  }

  // Group 7xx: Atmosphere
  if (desc.includes('mist') || desc.includes('fog') || desc.includes('haze')) {
    switch(timePeriod) {
      case 'morning': return ['#E0E0E0', '#BDBDBD'];
      case 'afternoon': return ['#D3D3D3', '#A9A9A9'];
      case 'evening': return ['#A9A9A9', '#808080'];
      case 'night': return ['#808080', '#696969'];
      default: return ['#D3D3D3', '#A9A9A9'];
    }
  }

  // Default gradient with time variations
  switch(timePeriod) {
    case 'morning': return ['#FFD700', '#87CEEB'];
    case 'afternoon': return ['#87CEEB', '#4682B4'];
    case 'evening': return ['#FF4500', '#8A2BE2'];
    case 'night': return ['#00008B', '#191970'];
    default: return ['#87CEEB', '#4682B4'];
  }
};

// Temperature adjustment function
const adjustColorForTemp = (hexColor, temp) => {
  const [h, s, l] = hexToHsl(hexColor);
  const tempFactor = (temp - 20) * 0.5; // Adjust 0.5% lightness per degree from 20°C
  const newLightness = Math.min(Math.max(l + tempFactor, 0), 100);
  return hslToHex(h, s, newLightness);
};

// React component
const WeatherBackground = ({ time, description, temp }) => {
  useEffect(() => {
    const date = new Date(time);
    const hour = date.getHours();
    const timePeriod = getTimePeriod(hour);
    // console.log(timePeriod,hour);
    
    const baseGradient = getBaseGradient(description, timePeriod);
    const adjustedGradient = baseGradient.map(color => adjustColorForTemp(color, temp));
    try {
      
      document.getElementById("BgColorDiv").style.background = `linear-gradient(to bottom, ${adjustedGradient.join(', ')})`;
    } catch (error) {
      
    }

    return () => {
      document.getElementById("BgColorDiv").style.background = '';
    };
  }, [time, description, temp]);

  return null;
};

export default WeatherBackground;