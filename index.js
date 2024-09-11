const { app, BrowserWindow, ipcMain, dialog, ipcRenderer } = require('electron')

const path = require('node:path')
const puppeteer = require('puppeteer');
const fs = require('fs');
const { createFolder } = require('./features/create-folder');
const { importAccounts } = require('./features/import-accounts');
const { importPosts } = require('./features/import-posts');
const { run } = require('./features/run');
const { sleep, launchBrowser, openPage, checkFolderPath, getRootPath, sendEvent, closeBrowser } = require('./features/common');
const { previewPosts } = require('./features/preview-posts/preview-posts');
const { previewHistories } = require('./features/view-histories/preview-histories');

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
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 860,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
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
    const browser = await puppeteer.launch({
      headless: false,
      args: [
        `--proxy-server=${account.ip}:${account.port}`,
        `--user-agent=${userAgent}`,
      ]
    });
    const page = await browser.newPage();
    await page.authenticate({
      username: account.user,
      password: account.pass
    });
    await page.setViewport({
      width: 1280,
      height: 800,
      deviceScaleFactor: 1
    });
    await page.goto('https://www.threads.net/login/');

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

// Handle settup
ipcMain.handle('setup', async (event, account) => {
  try {
    const userAgent = fs.readFileSync('user-agent.txt', 'utf8').split('\n')[Math.floor(Math.random() * 10)];
    const browser = await puppeteer.launch({
      headless: false,
      args: [
        `--proxy-server=${account.ip}:${account.port}`,
        `--user-agent=${userAgent}`,
      ]
    });
    const page = await browser.newPage();
    await page.authenticate({
      username: account.user,
      password: account.pass
    });
    await page.setViewport({
      width: 1280,
      height: 800,
      deviceScaleFactor: 1
    });
    await page.goto('https://www.instagram.com/');

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

    // find input with name = "username"
    const userInputElement = await page.$('input[name="username"]');
    await userInputElement.type(account.account);

    // tab to password input
    await page.keyboard.press('Tab');
    await page.keyboard.type(account.password);
    await page.keyboard.press('Enter');

    await sleep(3000);

    // find input with name = "verificationCode"
    const codeInputElement = await page.$('input[name="verificationCode"]');
    console.log(codeInputElement);
    await codeInputElement.type(code);
    await page.keyboard.press('Enter');

    await sleep(15000);

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
ipcMain.handle('import-posts', async (event) => {
  return await importPosts(folderPath);
});

// Handle preview posts
ipcMain.handle('preview-posts', async (event) => {
  return previewPosts({ folderPath, window: mainWindow });
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
ipcMain.handle('view-histories', async (event, account) => {
  return previewHistories({ window: mainWindow, account });
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