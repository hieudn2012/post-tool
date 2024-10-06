import { app, BrowserWindow, ipcMain } from 'electron';

import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { adminLogin } from './src/features/admin-login.js';
import { getAccounts } from './src/features/get-accounts.js';
import { run, stop } from './src/features/run.js';
import { openNewPage } from './src/features/open-new-page.js';
import { threadsLogin } from './src/features/threads-login.js';
import { saveCookies } from './src/features/save-cookies.js';
import request from './src/utils/request.js';
import { API_URL } from './src/constants/common.js';
import { sendEvent, sleep } from './src/utils/common.js';
import { instagramLogin } from './src/features/instagram-login.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let mainWindow;

const browsers = {};
const pages = {};
const statuses = {};

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

  // handle admin login
  ipcMain.handle('admin-login', async (event, data) => {
    await adminLogin(data);
  });

  // handle get accounts
  ipcMain.handle('get-accounts', async (event, status) => {
    const accounts = await getAccounts(status);
    return accounts;
  });

  // handle run
  ipcMain.handle('run', async (event, account) => {
    const { data } = await request.post(`${API_URL}/accounts/check-run/${account._id}`);
    if (!data.canRun) {
      await sendEvent({ event, account: { ...account, eventMessage: `Waiting for next post ${account.account}...` } });
      await sleep(data.timeout);
    }
    await run({ account, event, browsers, pages, statuses });
  });

  // handle stop
  ipcMain.handle('stop', async (event, account) => {
    stop({ account, browsers });
  });

  // handle relaunch
  ipcMain.handle('relaunch', async (event) => {
    app.relaunch();
    app.quit();
  });

  // handle open new page
  ipcMain.handle('open-new-page', async (event, account) => {
    openNewPage({ account, browsers, pages });
  });

  // handle threads login
  ipcMain.handle('threads-login', async (event, account) => {
    threadsLogin({ account, browsers, pages });
  });

  // handle save cookies
  ipcMain.handle('save-cookies', async (event, account) => {
    saveCookies({ account, browsers, pages });
  });

  // handle get statuses
  ipcMain.handle('get-statuses', async (event) => {
    return statuses;
  });

  // instagram login
  ipcMain.handle('instagram-login', async (event, account) => {
    await instagramLogin({ account, browsers, pages });
  });
}

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