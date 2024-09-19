import { app, BrowserWindow, ipcMain } from 'electron';

import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { adminLogin } from './features/admin-login.js';
import { getRunnerDetails, listenAction } from './features/listen-action.js';
import { getRunners } from './features/get-runners.js';
import { run } from './features/run.js';
import { sendEvent, sleep } from './features/common.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let mainWindow;

const browsers = {};
const pages = {};

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
  mainWindow.webContents.openDevTools();
}

// Handle admin login
ipcMain.handle('admin-login', async (event, account) => {
  return adminLogin(account);
});

// Handle get runners
ipcMain.handle('get-runners', async (event, token) => {
  return getRunners(token);
});

// Handle listen action
ipcMain.handle('listen-action', async (event, data) => {
  return listenAction({ data, browsers, pages, event });
});

// Handle run
ipcMain.handle('run', async (event, { accountId, token }) => {
  const runner = await getRunnerDetails({ accountId, token });
  if (runner.error && !runner.timeout) {
    return sendEvent({ event, runner: { accountId }, message: runner.error });
  }
  if (runner.timeout) {
    await sendEvent({ event, runner: { accountId }, message: runner.error });
    await sleep(runner.timeout);
  }
  await run({ event, runner: { ...runner, token }, browsers, pages, headless: true });
});

// Handle action result
ipcMain.handle('action-result', async (event, data) => {
  console.log(data, 'action-result');
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