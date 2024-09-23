import { app, BrowserWindow, ipcMain } from 'electron';

import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { adminLogin } from './src/features/admin-login.js';
import { getAccounts } from './src/features/get-accounts.js';
import { run, stop } from './src/features/run.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let mainWindow;

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
  ipcMain.handle('get-accounts', async (event) => {
    const accounts = await getAccounts();
    return accounts;
  });

  // handle run
  ipcMain.handle('run', async (event, account) => {
    run({ account, event });
  });

  // handle stop
  ipcMain.handle('stop', async (event, account) => {
    stop({ account, event });
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