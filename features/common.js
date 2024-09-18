import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
puppeteer.use(StealthPlugin())

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function launchBrowser({ runner, headless, browsers, withCookies = false }) {
  const { accountId } = runner;
  const { ip, port } = runner.proxy;

  const userAgent = withCookies ? runner.account.user_agent : runner.random_user_agent;

  const browser = await puppeteer.launch({
    headless,

    args: [
      `--proxy-server=${ip}:${port}`,
      `--user-agent=${userAgent}`,
      // `--user-data-dir=`
    ]
  });

  browsers[accountId] = browser;
  return browsers[accountId];
}

async function closeBrowser({ runner, browsers }) {
  const id = runner.accountId;
  if (browsers[id]) {
    await browsers[id].close();
    console.log(`Browser with ID ${id} closed.`);
    delete browsers[id];
  } else {
    console.log(`No browser found with ID ${id}.`);
  }
}

async function openPage({ runner, url, browsers, pages, withCookies = false }) {
  const { accountId } = runner;
  const { user, pass } = runner.proxy;

  const browser = browsers[accountId];
  if (!browser) {
    throw new Error(`No browser found with ID ${accountId}`);
  }
  const page = await browser.newPage();
  await page.authenticate({
    username: user,
    password: pass
  });
  await page.setViewport({
    // random from 1280x800, 1366x768, 1920x1080
    width: [1280, 1366, 1920][Math.floor(Math.random() * 3)],
    height: [800, 768, 1080][Math.floor(Math.random() * 3)],
    deviceScaleFactor: 1,
  });
  if (withCookies) {
    const cookies = runner.account.cookies;
    await page.setCookie(...JSON.parse(cookies));
  }
  pages[`${accountId}_${url}`] = page;
  await page.goto(url);
  return page;
}

async function sendEvent({ event, action = "action-result", runner, ...props }) {
  await event.sender.send(action, { ...runner, ...props });
}

export {
  sleep,
  launchBrowser,
  closeBrowser,
  openPage,
  sendEvent,
};