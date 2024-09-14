import { INSTAGRAM_URL, THREADS_LOGIN_URL } from "../src/constants/common.js";
import { get2FaCode, launchBrowser, openPage, sleep } from "./common.js";

async function setupInstagram({ account, browsers, userAgents, pages }) {
  await launchBrowser({ account, browsers, userAgents, headless: false });
  const page = await openPage({ account, url: THREADS_LOGIN_URL, browsers, pages });

  await page.goto(INSTAGRAM_URL);

  const usernameInput = await page.waitForSelector('input[name="username"]');
  await usernameInput.type(account.account);

  await page.keyboard.press('Tab');
  await page.keyboard.type(account.password);

  await page.keyboard.press('Enter');
  
  const code = await get2FaCode(account.account2fa);
  await sleep(2000);

  const instagramCode = await page.waitForSelector('input[name="verificationCode"]');
  await instagramCode.type(code);
  await page.keyboard.press('Enter');
};

export {
  setupInstagram
};
