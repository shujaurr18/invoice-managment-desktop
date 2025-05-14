const fs = require('fs');
const path = require('path');

// Create scripts directory if it doesn't exist
if (!fs.existsSync('scripts')) {
  fs.mkdirSync('scripts');
}

// Copy electron.js to build directory
fs.copyFileSync(
  path.join(__dirname, '../public/electron.js'),
  path.join(__dirname, '../build/electron.js')
);

console.log('Electron.js copied to build directory'); 