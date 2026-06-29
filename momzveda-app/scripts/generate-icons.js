// Generate PWA icons as SVG files that Next.js can serve
const fs = require('fs');

function createIconSVG(size) {
  const pad = size * 0.12;
  const r = size * 0.18;
  const cx = size / 2;
  const momzSize = size * 0.18;
  const vedaSize = size * 0.18;
  const tagSize = size * 0.04;
  const lineW = size * 0.28;
  const lineH = size * 0.008;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1B0B3B"/>
      <stop offset="100%" stop-color="#2A0F52"/>
    </linearGradient>
    <linearGradient id="line" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#1E90E8"/>
      <stop offset="100%" stop-color="#7A1FB0"/>
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${r}" fill="url(#bg)"/>
  <rect x="${cx - lineW/2}" y="${cx - momzSize*0.7}" width="${lineW}" height="${lineH}" rx="${lineH/2}" fill="url(#line)" opacity="0.5"/>
  <text x="${cx}" y="${cx + momzSize*0.15}" text-anchor="middle" font-size="${momzSize}" fill="#1E90E8" font-family="Arial Black, Arial, sans-serif" font-weight="900" letter-spacing="2">Momz<tspan fill="#7A1FB0" font-family="Georgia, serif" font-weight="400" font-style="italic">Veda</tspan></text>
  <rect x="${cx - lineW/2}" y="${cx + momzSize*0.45}" width="${lineW}" height="${lineH}" rx="${lineH/2}" fill="url(#line)" opacity="0.5"/>
  <text x="${cx}" y="${cx + momzSize*0.85}" text-anchor="middle" font-size="${tagSize}" fill="rgba(255,255,255,0.3)" font-family="Arial, sans-serif" font-weight="600" letter-spacing="2">YOUR MOM FRIEND</text>
</svg>`;
}

// Write icons
fs.writeFileSync('public/icons/icon-192.svg', createIconSVG(192));
fs.writeFileSync('public/icons/icon-512.svg', createIconSVG(512));

// Also create simple PNG-compatible versions using a solid approach
function createSimpleIcon(size) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${size*0.18}" fill="#1B0B3B"/>
  <text x="${size/2}" y="${size*0.42}" text-anchor="middle" font-size="${size*0.2}" fill="#1E90E8" font-family="Arial Black, sans-serif" font-weight="900" letter-spacing="1">M</text>
  <text x="${size/2 + size*0.12}" y="${size*0.42}" text-anchor="middle" font-size="${size*0.16}" fill="#7A1FB0" font-family="Georgia, serif" font-style="italic">v</text>
  <rect x="${size*0.25}" y="${size*0.5}" width="${size*0.5}" height="${size*0.01}" rx="${size*0.005}" fill="#1E90E8" opacity="0.5"/>
  <text x="${size/2}" y="${size*0.67}" text-anchor="middle" font-size="${size*0.06}" fill="rgba(255,255,255,0.35)" font-family="Arial, sans-serif" font-weight="600" letter-spacing="2">YOUR MOM</text>
  <text x="${size/2}" y="${size*0.75}" text-anchor="middle" font-size="${size*0.06}" fill="rgba(255,255,255,0.35)" font-family="Arial, sans-serif" font-weight="600" letter-spacing="2">FRIEND</text>
</svg>`;
}

fs.writeFileSync('public/icons/icon-192.png.svg', createSimpleIcon(192));
fs.writeFileSync('public/icons/icon-512.png.svg', createSimpleIcon(512));

console.log('Icons generated!');
