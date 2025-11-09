const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.wav': 'audio/wav',
  '.mp4': 'video/mp4',
  '.woff': 'application/font-woff',
  '.ttf': 'application/font-ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.otf': 'application/font-otf',
  '.wasm': 'application/wasm'
};

// حساب العد التنازلي
function calculateCountdown() {
  // 24 نوفمبر 2024 الساعة 10:00 صباحاً بتوقيت الرياض (UTC+3) = 07:00 UTC
  // إذا مرّ التاريخ، استخدم 24 نوفمبر 2025
  const now = new Date();
  const nov24_2024 = new Date('2024-11-24T07:00:00Z');
  const nov24_2025 = new Date('2025-11-24T07:00:00Z');
  
  // استخدم التاريخ القادم إذا مرّ 24 نوفمبر 2024
  const launchDate = now > nov24_2024 ? nov24_2025 : nov24_2024;
  const difference = launchDate - now;
  
  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, finished: true };
  }
  
  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((difference % (1000 * 60)) / 1000);
  
  return { days, hours, minutes, seconds, finished: false };
}

// إنشاء صورة SVG للعد التنازلي
function generateCountdownSVG() {
  const { days, hours, minutes, seconds, finished } = calculateCountdown();
  
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="500" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1f0059;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#6d1df0;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="1200" height="500" fill="url(#grad)"/>
  <text x="600" y="120" font-family="Arial, sans-serif" font-size="64" font-weight="bold" fill="white" text-anchor="middle">الاطلاق التجريبي</text>
  <text x="600" y="170" font-family="Arial, sans-serif" font-size="28" fill="white" fill-opacity="0.9" text-anchor="middle">الأيام المتبقية على الإطلاق التجريبي</text>
  
  <g transform="translate(600, 300)">
    <!-- Days -->
    <g transform="translate(-440, 0)">
      <rect x="-110" y="-70" width="220" height="140" rx="16" fill="rgba(255,255,255,0.1)"/>
      <text x="0" y="0" font-family="Arial, sans-serif" font-size="56" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">${days}</text>
      <text x="0" y="40" font-family="Arial, sans-serif" font-size="26" fill="white" fill-opacity="0.95" text-anchor="middle">اليوم</text>
    </g>
    
    <!-- Hours -->
    <g transform="translate(-220, 0)">
      <rect x="-110" y="-70" width="220" height="140" rx="16" fill="rgba(255,255,255,0.1)"/>
      <text x="0" y="0" font-family="Arial, sans-serif" font-size="56" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">${hours}</text>
      <text x="0" y="40" font-family="Arial, sans-serif" font-size="26" fill="white" fill-opacity="0.95" text-anchor="middle">الساعة</text>
    </g>
    
    <!-- Minutes -->
    <g transform="translate(0, 0)">
      <rect x="-110" y="-70" width="220" height="140" rx="16" fill="rgba(255,255,255,0.1)"/>
      <text x="0" y="0" font-family="Arial, sans-serif" font-size="56" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">${minutes}</text>
      <text x="0" y="40" font-family="Arial, sans-serif" font-size="26" fill="white" fill-opacity="0.95" text-anchor="middle">الدقيقة</text>
    </g>
    
    <!-- Seconds -->
    <g transform="translate(220, 0)">
      <rect x="-110" y="-70" width="220" height="140" rx="16" fill="rgba(255,255,255,0.1)"/>
      <text x="0" y="0" font-family="Arial, sans-serif" font-size="56" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">${seconds}</text>
      <text x="0" y="40" font-family="Arial, sans-serif" font-size="26" fill="white" fill-opacity="0.95" text-anchor="middle">الثانية</text>
    </g>
  </g>
  
  ${finished ? '<text x="600" y="420" font-family="Arial, sans-serif" font-size="28" font-weight="bold" fill="white" text-anchor="middle">تم الإطلاق</text>' : ''}
  
  <text x="600" y="480" font-family="Arial, sans-serif" font-size="18" fill="white" fill-opacity="0.8" text-anchor="middle">RFQH TEAM.</text>
</svg>`;
  
  return svg;
}

const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);

  // Endpoint للصورة
  if (req.url === '/countdown.svg' || req.url === '/countdown.png' || req.url.startsWith('/countdown.svg')) {
    const svg = generateCountdownSVG();
    res.writeHead(200, { 
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
      'Pragma': 'no-cache',
      'Expires': '0'
    });
    res.end(svg, 'utf-8');
    return;
  }

  let filePath = '.' + req.url;
  if (filePath === './') {
    filePath = './index.html';
  }

  const extname = String(path.extname(filePath)).toLowerCase();
  const contentType = mimeTypes[extname] || 'application/octet-stream';

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 - File Not Found</h1>', 'utf-8');
      } else {
        res.writeHead(500);
        res.end(`Server Error: ${error.code}`, 'utf-8');
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  console.log('Press Ctrl+C to stop the server');
  console.log(`\nافتح هذا الرابط لرؤية الصورة: http://localhost:${PORT}/countdown.svg`);
});

