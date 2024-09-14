import fs from 'node:fs';
import { get2FaCode, getRootPath, launchBrowser, openPage } from './common.js';

async function login({ account, browsers, pages, userAgents }) {
  const folderPath = getRootPath();
  try {
    const userAgent = fs.readFileSync('user-agent.txt', 'utf8').split('\n')[Math.floor(Math.random() * 10)];
    await launchBrowser({ account, headless: false, browsers, userAgents });
    const page = await openPage({ account, url: 'https://www.threads.net/login/', browsers, pages });

    // find input with tabindex = 0
    const userInputElement = await page.$('input[tabindex="0"]');
    await userInputElement.type(account.account);

    // find input with type = "password"
    const passInputElement = await page.$('input[type="password"]');
    await passInputElement.type(account.password);

    // tab to login button
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');

    const code = await get2FaCode();

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
}

export {
  login
};
