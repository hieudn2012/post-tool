import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import fs from 'node:fs';
import { createFolder } from './features/create-folder.js';
import { importAccounts } from './features/import-accounts.js';
import { importPosts, importImages } from './features/import-posts.js';
import { run } from './features/run.js';
import {
  sleep,
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
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let mainWindow;
let folderPath = getRootPath();

const browsers = {};
const pages = {};
const userAgents = {};

// save cookies
async function saveCookies({ account, event }) {
  const page = pages[`${account.id}_https://www.threads.net/login/`];
  if (!page) {
    sendEvent({ account, status: 'No page found' });
    throw new Error(`No page found with ID ${account.id}.`);
  }
  const cookies = await page.cookies();
  fs.writeFileSync(`${folderPath}/cookies/${account.account}.json`, JSON.stringify(cookies));

  fs.writeFileSync(`${folderPath}/user-agent/${account.account}.txt`, userAgents[account.id]);

  await sendEvent({ event, account, status: 'Cookies saved' });
  await browsers[account.id].close();
}

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

ipcMain.handle('test', async (event, account) => {
  try {
    checkFolderPath({ window: mainWindow });
    await launchBrowser({ account, headless: false, browsers, userAgents });
    await openPage({ account, url: 'https://www.threads.net/login/', browsers, pages });
  } catch (error) {
    console.error('Login failed:', error);
  }
});


// Handle the login event from the renderer process
ipcMain.handle('login', async (event, account) => {
  try {
    const userAgent = fs.readFileSync('user-agent.txt', 'utf8').split('\n')[Math.floor(Math.random() * 10)];
    const browser = await launchBrowser({ account, headless: false, browsers, userAgents });
    const page = await openPage({ account, url: 'https://www.threads.net/login/', browsers, pages });

    // find input with tabindex = 0
    const userInputElement = await page.$('input[tabindex="0"]');
    await userInputElement.type(account.account);

    // find input with type = "password"
    const passInputElement = await page.$('input[type="password"]');
    await passInputElement.type(account.password);

    // tab to login button
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');

    // open a new tab with url = "2fa.live"
    const newTab = await browser.newPage();
    await newTab.goto('https://2fa.live/');

    // find textarea with id = "listToken"
    const tokenElement = await newTab.$('textarea#listToken');
    await tokenElement.type(account.account2fa);
    await sleep(5000);

    // find button with id = "submit"
    const submitElement = await newTab.$('a#submit');
    submitElement.click();

    // waiting 2s
    await sleep(3000);

    // find textarea with id = "output"
    const outputElement = await newTab.$('textarea#output');
    const value = await newTab.evaluate(element => element.value, outputElement);
    const code = value.split('|')[1];

    // quit new tab
    await newTab.close();

    // find input with autocomplete = "one-time-code"
    const codeInputElement = await page.$('input[autocomplete="one-time-code"]');
    await codeInputElement.type(code);

    // press tab to submit
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    await sleep(20000);

    // create new file json with account name
    fs.writeFileSync(`${folderPath}/cookies/${account.account}.json`, JSON.stringify(await page.cookies()));

    // save user agent by account name
    fs.writeFileSync(`${folderPath}/user-agent/${account.account}.txt`, userAgent);

  } catch (error) {
    console.error('Login failed:', error);
  }
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
  try {
    await saveCookies({ account, event });
  } catch (error) {
    console.error('Save cookies failed:', error);
  }
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