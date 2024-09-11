const { BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

const previewPosts = ({ folderPath, window }) => {
  const modal = new BrowserWindow({
    parent: window,
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // Show dev tools
  modal.webContents.openDevTools();

  // Load the HTML file
  modal.loadFile(path.join(__dirname, 'preview-posts.html'));
}

ipcMain.handle('get-posts', async (event) => {
  // Get path from config.txt
  const configs = fs.readFileSync('config.txt', 'utf8');
  const path = configs.split('\n')[0];
  
  const posts = fs.readFileSync(`${path}/posts.json`, 'utf8');

  return JSON.parse(posts);
});

module.exports = {
  previewPosts,
};