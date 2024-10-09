import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
puppeteer.use(StealthPlugin())

export const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const sendEvent = ({ event, action = "action-result", account, ...props }) => {
  return event.sender.send(action, { ...account, ...props });
}

export async function launchBrowser({ account = {}, headless, browsers }) {
  const { user_agent, proxy, _id } = account;
  const { ip, port } = proxy || {};

  const browser = await puppeteer.launch({
    headless,
    args: [
      `--proxy-server=${ip}:${port}`,
      `--user-agent=${user_agent}`,
      // `--user-data-dir=${folderPath}/cache`
    ]
  });

  browsers[_id] = browser;
}

export async function closeBrowser({ account, browsers }) {
  const { _id } = account;
  if (browsers[_id]) {
    await browsers[_id].close();
    console.log(`Browser with ID ${_id} closed.`);
    delete browsers[_id];
  } else {
    console.log(`No browser found with ID ${_id}.`);
  }
}

export async function openPage({ account, url, browsers, pages }) {
  const { _id, cookies, proxy } = account;
  const { user, pass } = proxy || {};
  const browser = browsers[_id];
  if (!browser) {
    throw new Error(`No browser found with ID ${_id}.`);
  }
  const page = await browser.newPage();

  // Chặn tải ảnh và video
  await page.setRequestInterception(true);
  page.on('request', (request) => {
    if (['image', 'svg', 'media', 'stylesheet', 'font'].includes(request.resourceType())) {
      request.abort();  // Hủy các yêu cầu không cần thiết
    } else {
      request.continue();
    }
  });

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

  if (cookies) {
    await page.setCookie(...JSON.parse(cookies));
  }
  await page.goto(url, { timeout: 60000 });
  pages[`${_id}_${url}`] = page;
  return page;
}
