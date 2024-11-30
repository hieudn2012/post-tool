import { app, BrowserWindow, ipcMain } from 'electron';

import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { getProfile } from './src/new-feature/get-profile.js';
import { run } from './src/new-feature/run.js';
import { openRandomFolder } from './src/new-feature/open-random-folder.js';
import {
  assignRandomIdToPost,
  changeWorkingFolder,
  copyRandomCaption,
  createEmptyFolder,
  deleteEmptyFolder, getRandomComment, loadConfig,
  openEmptyFolder,
  saveConfig,
  sendEvent
} from './src/new-feature/common.js';
import { crawlData } from './src/new-feature/crawl-data.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let mainWindow;

let workingFolder = '';

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1100,
    height: 1100,
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
  ipcMain.handle('assign-random-id-to-post', async (event, data) => {
    return assignRandomIdToPost(data, event);
  });

  // Get comment
  ipcMain.handle('get-comment', async (event, links) => {
    return getRandomComment(links, event);
  });

  // Crawl data
  ipcMain.handle('crawl-data', async (event) => {
    return crawlData(event);
  });

  // Change working folder
  ipcMain.handle('change-working-folder', async (event) => {
    return changeWorkingFolder('workingFolder', event);
  });

  // Change working folder
  ipcMain.handle('change-working-comment-folder', async (event) => {
    return changeWorkingFolder('commentFolder', event);
  });

  // Change folder save files
  ipcMain.handle('change-folder-save-files', async (event) => {
    return changeWorkingFolder((path) => {
      workingFolder = path;
      sendEvent({
        event,
        action: "action-result",
        eventMessage: `Folder save files changed to ${path}`,
        type: 'CHANGE_FOLDER_SAVE_FILES',
        path
      });
    });
  });

  // Save config
  ipcMain.handle('save-config', async (event, config) => {
    return saveConfig(config, event);
  });

  // Load config
  ipcMain.handle('load-config', async (event) => {
    return loadConfig(event);
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
