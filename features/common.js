import fs from 'node:fs';
import puppeteer from 'puppeteer';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getRootPath() {
  const configs = fs.readFileSync('config.txt', 'utf8');
  return configs.split('\n')[0];
}

async function launchBrowser({ account, headless, browsers, userAgents, withCookies = false }) {
  const folderPath = getRootPath();
  const agentList = fs.readFileSync(`${folderPath}/user-agent.txt`, 'utf8').trim().split('\n');
  let userAgent = agentList[Math.floor(Math.random() * agentList.length)];

  if (withCookies) {
    userAgent = fs.readFileSync(`${folderPath}/user-agent/${account.account}.txt`, 'utf8');
  }

  const browser = await puppeteer.launch({
    headless,
    args: [
      `--proxy-server=${account.ip}:${account.port}`,
      `--user-agent=${userAgent}`
    ]
  });

  browsers[account.id] = browser;
  userAgents[account.id] = userAgent;
  return browsers[account.id];
}

async function closeBrowser({ account, browsers }) {
  const id = account.id;
  if (browsers[id]) {
    await browsers[id].close();
    console.log(`Browser with ID ${id} closed.`);
    delete browsers[id];
  } else {
    console.log(`No browser found with ID ${id}.`);
  }
}

async function openPage({ account, url, browsers, pages, withCookies = false }) {
  const folderPath = getRootPath();
  const browser = browsers[account.id];
  if (!browser) {
    throw new Error(`No browser found with ID ${account.id}.`);
  }
  const page = await browser.newPage();
  await page.authenticate({
    username: account.user,
    password: account.pass
  });
  await page.setViewport({
    // random from 1280x800, 1366x768, 1920x1080
    width: [1280, 1366, 1920][Math.floor(Math.random() * 3)],
    height: [800, 768, 1080][Math.floor(Math.random() * 3)],
    deviceScaleFactor: 1,
  });
  if (withCookies) {
    const cookies = fs.readFileSync(`${folderPath}/cookies/${account.account}.json`, 'utf8');
    await page.setCookie(...JSON.parse(cookies));
  }
  pages[`${account.id}_${url}`] = page;
  await page.goto(url);
  return page;
}

function checkFolderPath({ window }) {
  const folderPath = getRootPath();
  if (!folderPath) {
    dialog.showMessageBox(window, {
      type: 'warning',
      message: 'Please select a folder to store data',
      buttons: ['OK']
    });
    throw new Error('Folder path is empty');
  }
}

async function sendEvent({ event, action = "action-result", account, ...props }) {
  await event.sender.send(action, { ...account, ...props });
}

function getAllCategories() {
  const folderPath = getRootPath();
  const categories = fs.readdirSync(`${folderPath}/categories`);
  return categories;
}

export {
  sleep,
  getRootPath,
  launchBrowser,
  closeBrowser,
  openPage,
  checkFolderPath,
  sendEvent,
  getAllCategories,
};