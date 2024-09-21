import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import fs from 'node:fs';
import { createFolder } from './features/create-folder.js';
import { importAccounts } from './features/import-accounts.js';
import { importPosts, importImages } from './features/import-posts.js';
import { run } from './features/run.js';
import {
  launchBrowser,
  openPage,
  checkFolderPath,
  getRootPath,
  sendEvent,
  closeBrowser,
} from './features/common.js';
import { loadCategories } from './features/load-categories.js';
import { openModal } from './features/open-modal/open-modal.js';
import { addCategory } from './features/add-category.js';

import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { clearHistories } from './features/clear-history.js';
import { getAccountConfig, loadPostsByCategory, saveAccountConfig } from './features/account-config.js';
import { getDefaultCategory } from './features/get-default-category.js';
import { login } from './features/login.js';
import { saveCookie } from './features/save-cookie.js';
import { THREADS_LOGIN_URL } from './src/constants/common.js'
import { setupInstagram } from './features/setup-instagram.js';
import { getCookies } from './features/get-cookies.js';
import { importContents } from './features/import-contents.js';
import { adminLogin } from './features/admin-login.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let mainWindow;
let folderPath = getRootPath();

const browsers = {};
const pages = {};
const userAgents = {};

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1600,
    height: 860,
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
    }
  })

  mainWindow.loadFile('index.html')

  // Open devtool to debug
  // mainWindow.webContents.openDevTools();
}

// Get global state from store
ipcMain.handle('getGlobalState', (event, key) => {
  return store.get(key);
});

// Update global state to store
ipcMain.on('updateGlobalState', (event, key, value) => {
  store.set(key, value);
});

ipcMain.handle('test', async (event, account) => {
  checkFolderPath({ window: mainWindow });
  await launchBrowser({ account, headless: false, browsers, userAgents });
  await openPage({ account, url: THREADS_LOGIN_URL, browsers, pages });
});

// Handle the login event from the renderer process
ipcMain.handle('login', async (event, account) => {
  await login({ account, browsers, pages, userAgents });
});

// Handle run
ipcMain.handle('run', async (event, account) => {
  run({
    event,
    account,
    folderPath,
    browsers,
    pages,
    userAgents,
    headless: !!account.headless,
  });
});

// Handle request to open the folder selection dialog
ipcMain.handle('select-folder', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  });
  folderPath = result.filePaths[0] || '';
  createFolder(folderPath);
  const accountString = fs.readFileSync(`${folderPath}/accounts.json`, 'utf8');
  return {
    path: folderPath,
    accounts: JSON.parse(accountString)
  };  // Return the selected folder path or an empty string if no folder was selected
});

// Handle stop
ipcMain.handle('stop', async (event, account) => {
  try {
    await closeBrowser({ account, browsers });
    await sendEvent({ event, account, status: 'Stopped' });
  } catch (error) {
    console.error('Stop failed:', error);
  }
});

// Handle save cookies
ipcMain.handle('save-cookies', async (event, account) => {
  await saveCookie({ account, event, pages, browsers, userAgents });
});

// Handle load account
ipcMain.handle('load-account', async (event, account) => {
  await launchBrowser({ account, headless: false, browsers, userAgents, withCookies: true });
  await openPage({ account, url: 'https://www.threads.net/', browsers, pages, withCookies: true });
});

// Handle import accounts
ipcMain.handle('import-accounts', async (event) => {
  return await importAccounts(folderPath);
});

// Handle import posts
ipcMain.handle('import-posts', async (event, category) => {
  return await importPosts(category);
});

// Handle import images
ipcMain.handle('import-images', async (event, category) => {
  return await importImages(category);
});

// Handle preview posts
ipcMain.handle('preview-posts', async (event) => {
  console.log('Preview posts');
});

// Handle load default folder
ipcMain.handle('load-default', (event) => {
  createFolder(folderPath);
  const accountString = fs.readFileSync(`${folderPath}/accounts.json`, 'utf8');
  return {
    path: folderPath,
    accounts: JSON.parse(accountString)
  };
});

// Handle view histories
ipcMain.handle('clear-histories', async (event, account) => {
  clearHistories(account);
});

// Handle load categories
ipcMain.handle('load-categories', async (event) => {
  return loadCategories();
});

// Handle add category
ipcMain.handle('add-category', async (event, category) => {
  addCategory(category);
});

// Handle open modal
ipcMain.handle('open-modal', async (event) => {
  openModal({ window: mainWindow });
});

// handle load posts by category
ipcMain.handle('load-posts-by-category', async (event) => {
  return await loadPostsByCategory();
});

// handle save account config
ipcMain.handle('save-account-config', async (event, account) => {
  saveAccountConfig(account);
});

// Handle get default category
ipcMain.handle('get-default-category', (event, account) => {
  return getDefaultCategory(account);
});

// Handle get account config
ipcMain.handle('get-account-config', (event, account) => {
  return getAccountConfig(account);
});

// Handle setup Instagram
ipcMain.handle('setup-instagram', async (event, account) => {
  return setupInstagram({ account, browsers, userAgents, pages });
});

// Handle get cookies
ipcMain.handle('get-cookies', async (event, account) => {
  return await getCookies({ account });
});

// Handle import contents from folder
ipcMain.handle('import-contents', async (event) => {
  importContents();
});

// Handle admin login
ipcMain.handle('admin-login', async (event, account) => {
  return await adminLogin(account);
});

app.whenReady().then(() => {
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})