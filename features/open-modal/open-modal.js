import { BrowserWindow } from 'electron';
import path from 'path';

import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const openModal = ({ window }) => {
  const modal = new BrowserWindow({
    parent: window,
    width: 800,
    height: 600,
  });

  // Show dev tools
  // modal.webContents.openDevTools();

  // Load the HTML file
  modal.loadFile('modal.html');
}

export {
  openModal,
};