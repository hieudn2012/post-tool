const { BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const { getRootPath } = require('../common');

const previewPosts = ({ window }) => {
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
  modal.loadFile(path.join(__dirname, 'preview-posts.html'));
}

ipcMain.handle('get-posts', async (event) => {
  const path = getRootPath();

  // get all posts from categories
  const categories = fs.readdirSync(`${path}/categories`);
  const data = categories.reduce((acc, category) => {
    const posts = fs.readFileSync(`${path}/categories/${category}/posts.json`, 'utf8');
    return acc.concat(JSON.parse(posts));
  }, []);

  return data;
});

module.exports = {
  previewPosts,
};