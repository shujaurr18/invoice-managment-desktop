const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');

// Don't use electron-is-dev, use simple check
const isDev = process.env.NODE_ENV === 'development';

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      webSecurity: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // Determine the correct path to the index.html file
  const indexPath = isDev 
    ? 'http://localhost:3000' 
    : `file://${path.join(__dirname, 'index.html')}`;

  console.log('Loading URL:', indexPath);
  
  // Add error handling for page load
  mainWindow.loadURL(indexPath).catch(err => {
    console.error('Failed to load URL:', err);
  });

  // Open DevTools in development mode only
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  // Log any render process errors
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('Page failed to load:', errorCode, errorDescription);
  });

  // Log when page finishes loading
  mainWindow.webContents.on('did-finish-load', () => {
    console.log('Page finished loading');
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();
  
  // Check if HTML file exists in production mode
  if (!isDev) {
    const htmlPath = path.join(__dirname, 'index.html');
    try {
      if (fs.existsSync(htmlPath)) {
        console.log('index.html exists at:', htmlPath);
      } else {
        console.error('index.html not found at:', htmlPath);
      }
    } catch (err) {
      console.error('Error checking for index.html:', err);
    }
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});