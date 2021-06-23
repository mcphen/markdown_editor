const { app, BrowserWindow, Menu } = require('electron');
const { autoUpdater } = require('electron-updater');
const menu = require('./menu');

let window;

app.on('ready', () => {
    window = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      }
    });
    window.loadFile('index.html');

    autoUpdater.on('update-available', () => {
        mainWindow.webContents.send('update_available');
      });
      autoUpdater.on('update-downloaded', () => {
        mainWindow.webContents.send('update_downloaded');
      });
});

Menu.setApplicationMenu(menu);