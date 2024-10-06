import { INSTAGRAM_URL, THREADS_LOGIN_URL } from "../constants/common.js";
import { launchBrowser, openPage, sleep } from "../utils/common.js";
import request from "../utils/request.js";

export const instagramLogin = async ({ account, browsers, pages }) => {
  const { account: username, account_password, account_2fa } = account;

  await launchBrowser({ account, headless: false, browsers });
  const page = await openPage({ account, url: THREADS_LOGIN_URL, pages, browsers });
  await page.goto(INSTAGRAM_URL);

  // get username input
  const usernameInput = await page.$('input[name="username"]');
  await usernameInput.type(username);
  await sleep(1000);

  // get password input
  const passwordInput = await page.$('input[name="password"]');
  await passwordInput.type(account_password);
  await sleep(1000);

  // tab 2 times to focus on the login button
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Enter");
  await sleep(7000);

  // get the verification code
  const { data } = await request.get(`https://2fa.live/tok/${account_2fa}`);
  const token = data.token;
  const verificationCodeInput = await page.$('input[name="verificationCode"]');
  await verificationCodeInput.type(token);
  await page.keyboard.press("Tab");
  await page.keyboard.press("Enter");
  await sleep(10000);
};