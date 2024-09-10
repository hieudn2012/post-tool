const { app, BrowserWindow, ipcMain, dialog } = require('electron')

const path = require('node:path')
const puppeteer = require('puppeteer');
const fs = require('fs');

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


let mainWindow;
let folderPath = '';

// Create function for create folder base on folderPath, we have cookies, user-agent, history, logger.txt, user-agent.txt
function createFolder() {
  if (!fs.existsSync(`${folderPath}/cookies`)) {
    fs.mkdirSync(`${folderPath}/cookies`);
  }
  if (!fs.existsSync(`${folderPath}/user-agent`)) {
    fs.mkdirSync(`${folderPath}/user-agent`);
  }
  if (!fs.existsSync(`${folderPath}/history`)) {
    fs.mkdirSync(`${folderPath}/history`);
  }
  if (!fs.existsSync(`${folderPath}/logger.txt`)) {
    fs.writeFileSync(`${folderPath}/logger.txt`, '');
  }
  if (!fs.existsSync(`${folderPath}/user-agent.txt`)) {
    fs.writeFileSync(`${folderPath}/user-agent.txt`, '');
  }
  if (!fs.existsSync(`${folderPath}/accounts.json`)) {
    fs.writeFileSync(`${folderPath}/accounts.json`, "[]");
  }
  if (!fs.existsSync(`${folderPath}/images`)) {
    fs.mkdirSync(`${folderPath}/images`);
  }
  if (!fs.existsSync(`${folderPath}/posts.json`)) {
    fs.writeFileSync(`${folderPath}/posts.json`, "[]");
  }
}

// check if folderPath is not empty
function checkFolderPath(event) {
  if (folderPath === '') {
    // show warning dialog
    dialog.showMessageBox(mainWindow, {
      type: 'warning',
      message: 'Please select a folder to store data',
      buttons: ['OK']
    });
    throw new Error('Folder path is empty');
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 860,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  mainWindow.loadFile('index.html')

  // Open devtool to debug
  // win.webContents.openDevTools();
}

ipcMain.handle('test', async (event, account) => {
  try {
    checkFolderPath(event);
    // get user agent from user-agent.txt random line
    const userAgent = fs.readFileSync(`${folderPath}/user-agent.txt`, 'utf8').split('\n')[Math.floor(Math.random() * 10)];

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
      // random width from 800 to 1920
      width: Math.floor(Math.random() * 1120) + 800,
      // random height from 600 to 1080
      height: Math.floor(Math.random() * 480) + 600,
      deviceScaleFactor: 1
    });
    await page.goto('https://whatismyipaddress.com/');

    // page open new tab
    const newTab = await browser.newPage();
    await newTab.goto('https://whatismybrower.com');

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
  // check if history file is exist
  if (!fs.existsSync(`${folderPath}/history/${account.account}.json`)) {
    fs.writeFileSync(`${folderPath}/history/${account.account}.json`, '{}');
  }
  const historyString = fs.readFileSync(`${folderPath}/history/${account.account}.json`, 'utf8');
  const history = JSON.parse(historyString);
  const posted = history.posted || [];
  const postedIds = posted.map(post => post.id);

  const postsString = fs.readFileSync(`${folderPath}/posts.json`, 'utf8');
  const posts = JSON.parse(postsString);
  let randomPost = posts[Math.floor(Math.random() * posts.length)];
  const seconds = account.timePost * 60 * 60 * 1000;
  const lastPost = posted[posted.length - 1];

  let timeSleep = -1;
  if (lastPost) {
    const givenDate = new Date(lastPost.date);
    const currentDate = new Date();
    const differenceInMilliseconds = currentDate - givenDate;
    timeSleep = Math.floor(seconds - differenceInMilliseconds);
  }
  if (lastPost && timeSleep > 0) {
    event.sender.send('action-result', { ...account, status: `Waiting for next post...` });
    // Sleep for timeSleep + random time from 1 to 10 minutes
    await sleep(timeSleep + Math.floor(Math.random() * 600000));
  }

  const userAgent = fs.readFileSync(`${folderPath}/user-agent/${account.account}.txt`, 'utf8');
  const browser = await puppeteer.launch({
    headless: false,
    args: [
      `--proxy-server=${account.ip}:${account.port}`,
      `--user-agent=${userAgent.trim()}`,
    ]
  });

  try {
    // get user agent by account name
    event.sender.send('action-result', { ...account, status: 'Changing user agent...' });

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
    const cookiesString = fs.readFileSync(`${folderPath}/cookies/${account.account}.json`, 'utf8');
    const cookies = JSON.parse(cookiesString);
    await page.setCookie(...cookies);
    await page.goto('https://www.threads.net/', { timeout: 60000 });

    event.sender.send('action-result', { ...account, status: 'Page is opening...' });
    await sleep(15000);

    // find div with class = "x1i10hfl x1ypdohk xdl72j9 x2lah0s xe8uvvx xdj266r x11i5rnm xat24cr x1mh8g0r x2lwn1j xeuugli xexx8yu x4uap5 x18d9i69 xkhd6sd x1n2onr6 x16tdsg8 x1hl2dhg xggy1nq x1ja2u2z x1t137rt x1q0g3np x1lku1pv x1a2a7pz x6s0dn4 x9f619 x3nfvp2 x1s688f xc9qbxq xl56j7k x193iq5w x12w9bfk x1g2r6go x11xpdln xz4gly6 x87ps6o xuxw1ft x19kf12q x9dqhi0 x6bh95i x1re03b8 x1hvtcl2 x3ug3ww x1a2cdl4 xnhgr82 x1qt0ttw xgk8upj x13fuv20 xu3j5b3 x1q0q8m5 x26u7qi x178xt8z xm81vs4 xso031l xy80clv xp07o12"
    const postButton = await page.$('div.x1i10hfl.x1ypdohk.xdl72j9.x2lah0s.xe8uvvx.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.x2lwn1j.xeuugli.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x1n2onr6.x16tdsg8.x1hl2dhg.xggy1nq.x1ja2u2z.x1t137rt.x1q0g3np.x1lku1pv.x1a2a7pz.x6s0dn4.x9f619.x3nfvp2.x1s688f.xc9qbxq.xl56j7k.x193iq5w.x12w9bfk.x1g2r6go.x11xpdln.xz4gly6.x87ps6o.xuxw1ft.x19kf12q.x9dqhi0.x6bh95i.x1re03b8.x1hvtcl2.x3ug3ww.x1a2cdl4.xnhgr82.x1qt0ttw.xgk8upj.x13fuv20.xu3j5b3.x1q0q8m5.x26u7qi.x178xt8z.xm81vs4.xso031l.xy80clv.xp07o12');
    postButton.click();

    event.sender.send('action-result', { ...account, status: 'Found post button' });

    // check posted is full
    if (posted.length === posts.length) {
      event.sender.send('action-result', { ...account, status: 'All posts are posted', retry: false });
      await browser.close();
      return;
    }

    while (postedIds.includes(randomPost.id)) {
      randomPost = posts[Math.floor(Math.random() * posts.length)];
    }

    const postContent = `${randomPost.title} ${randomPost.url}`;

    // find input type  = file, while loop until found
    await sleep(15000);
    const fileInputElement = await page.$('input[type="file"]');
    await fileInputElement.uploadFile(`${folderPath}/images/${randomPost.id}.png`);
    event.sender.send('action-result', { ...account, status: 'Uploaded image for post and Finding post content...' });

    // find div with class = "xzsf02u xw2csxc x1odjw0f x1n2onr6 x1hnll1o xpqswwc notranslate"
    const captionElement = await page.$('div.xzsf02u.xw2csxc.x1odjw0f.x1n2onr6.x1hnll1o.xpqswwc.notranslate');
    // find p nested in captionElement
    const pElement = await captionElement.$('p');
    // type caption
    await pElement.type(postContent);

    // save cookies
    const newCookies = await page.cookies();
    fs.writeFileSync(`${folderPath}/cookies/${account.account}.json`, JSON.stringify(newCookies));

    history.posted = [...posted, { id: randomPost.id, date: new Date().toISOString() }];
    fs.writeFileSync(`${folderPath}/history/${account.account}.json`, JSON.stringify(history));



    // tab to post button
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');

    await sleep(10000);
    await browser.close();
    event.sender.send('action-result', {
      ...account,
      status: 'Done',
      isNewRound: true,
      latestPost: {
        date: new Date().toISOString(),
      }
    });

  } catch (error) {
    // open dialog to show error
    event.sender.send('action-result', { ...account, status: error, retry: false });
    console.log(error, ' error');
    await browser.close();
  }
});

// Handle request to open the folder selection dialog
ipcMain.handle('select-folder', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  });
  folderPath = result.filePaths[0] || '';
  createFolder();
  const accountString = fs.readFileSync(`${folderPath}/accounts.json`, 'utf8');
  return {
    path: folderPath,
    accounts: JSON.parse(accountString)
  };  // Return the selected folder path or an empty string if no folder was selected
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