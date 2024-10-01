import { API_URL, THREADS_LOGIN_URL } from "../constants/common.js";
import { closeBrowser, launchBrowser, openPage, sleep } from "../utils/common.js";
import request from "../utils/request.js";

export const threadsLogin = async ({ account, browsers, pages }) => {
  const { account: username, account_password, account_2fa } = account || {};

  await launchBrowser({ account, headless: false, browsers });
  const page = await openPage({ account, url: THREADS_LOGIN_URL, pages, browsers });
  await sleep(10000);

  const usernameInput = await page.$('input[autocomplete="username"]');
  await usernameInput.type(username);

  await page.keyboard.press("Tab");
  await page.keyboard.type(account_password);

  await page.keyboard.press("Tab");
  await page.keyboard.press("Enter");
  await sleep(10000);

  const { data } = await request.get(`https://2fa.live/tok/${account_2fa}`);
  const token = data.token;
  const codeInput = await page.$('input[autocomplete="one-time-code"]');
  await codeInput.type(token);
  await page.keyboard.press("Tab");
  await page.keyboard.press("Enter");
  await sleep(10000);

  const cookies = await page.cookies();
  await request.put(`${API_URL}/accounts/${account._id}`, { cookies: JSON.stringify(cookies) });
  await sleep(2000);
  await closeBrowser({ account, browsers });
};