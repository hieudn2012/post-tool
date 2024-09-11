const { BrowserWindow, ipcMain } = require('electron');
const path = require('path');

const openModal = ({ window }) => {
  const modal = new BrowserWindow({
    parent: window,
    width: 800,
    height: 600,
  });

  // Show dev tools
  // modal.webContents.openDevTools();

  // Load the HTML file
  modal.loadFile(path.join(__dirname, 'modal.html'));
}

module.exports = {
  openModal,
};