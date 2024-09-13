import { BrowserWindow, ipcMain } from 'electron';
import fs from 'node:fs';
import { getRootPath } from '../common.js';

let selectedAccount = {};

import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Manually create __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const previewHistories = ({ window, account }) => {
  selectedAccount = account;
  const modal = new BrowserWindow({
    parent: window,
    width: 800,
    height: 600,
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
    },
  });

  // Show dev tools
  // modal.webContents.openDevTools();

  // Load the HTML file
  modal.loadFile('preview-histories.html');
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

export {
  previewHistories,
};