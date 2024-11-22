import { app, BrowserWindow, ipcMain, globalShortcut } from 'electron';

import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { getProfile } from './src/new-feature/get-profile.js';
import { run } from './src/new-feature/run.js';
import { openRandomFolder } from './src/new-feature/open-random-folder.js';
import { assignRandomIdToPost, copyRandomCaption, createEmptyFolder, deleteEmptyFolder, openEmptyFolder } from './src/new-feature/common.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let mainWindow;

const globalPath = `/Users/admin/Desktop/aaa`;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 300,
    height: 800,
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
    }
  })

  mainWindow.loadFile('index.html')


  // Open devtool to debug
  // mainWindow.webContents.openDevTools();

  // get profiles
  ipcMain.handle('get-profiles', async (event) => {
    return await getProfile();
  });

  // run
  ipcMain.handle('run', async (event, userId) => {
    return await run(userId);
  });

  // open random folder
  ipcMain.handle('open-random-folder', async (event, path) => {
    return openRandomFolder(path);
  });

  // copy random caption
  ipcMain.handle('copy-random-caption', async (event) => {
    return copyRandomCaption(event);
  });

  // create empty folder
  ipcMain.handle('create-empty-folder', async (event, path) => {
    return createEmptyFolder(path);
  });

  // delete empty folder
  ipcMain.handle('delete-empty-folder', async (event, path) => {
    return deleteEmptyFolder(path);
  });

  // Open empty folder
  ipcMain.handle('open-empty-folder', async (event, path) => {
    return openEmptyFolder(path);
  });

  // Assign random id to post
  ipcMain.handle('assign-random-id-to-post', async (event, url) => {
    return assignRandomIdToPost(url, event);
  });

  // Đăng ký tổ hợp phím Ctrl+Shift+C
  globalShortcut.register('Ctrl+Shift+Z', () => {
    return openRandomFolder(globalPath);
  });

  // Đăng ký tổ hợp phím Ctrl+Shift+X
  globalShortcut.register('Ctrl+Shift+X', (event) => {
    return copyRandomCaption(event);
  });

  // Đăng ký tổ hợp phím Ctrl+Shift+V
  globalShortcut.register('Ctrl+Shift+V', () => {
    return createEmptyFolder(globalPath);
  });

  // Đăng ký tổ hợp phím Ctrl+Shift+V
  globalShortcut.register('Ctrl+Shift+D', () => {
    return deleteEmptyFolder(globalPath);
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

app.on('will-quit', () => {
  // Hủy đăng ký tổ hợp phím khi ứng dụng đóng
  globalShortcut.unregisterAll();
});