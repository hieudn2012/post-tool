const { BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const { getRootPath } = require('../common');

let selectedAccount = {};

const previewHistories = ({ window, account }) => {
  selectedAccount = account;
  const modal = new BrowserWindow({
    parent: window,
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // Show dev tools
  // modal.webContents.openDevTools();

  // Load the HTML file
  modal.loadFile(path.join(__dirname, 'preview-histories.html'));
}

ipcMain.handle('get-histories', async (event) => {
  const path = getRootPath();
  const history = fs.readFileSync(`${path}/history/${selectedAccount.account}.json`, 'utf8');

  const data = JSON.parse(history);
  return data.posted || [];
});

ipcMain.handle('clear-histories', async (event) => {
  const path = getRootPath();
  fs.writeFileSync(`${path}/history/${selectedAccount.account}.json`, JSON.stringify({ posted: [] }));
});

module.exports = {
  previewHistories,
};