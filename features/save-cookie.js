import fs from 'node:fs';
import { THEAD_URL, THREADS_LOGIN_URL } from "../src/constants/common.js";
import { getRootPath, sendEvent } from "./common.js";

// save cookies
async function saveCookie({ account, event, pages, browsers, userAgents }) {
  const folderPath = getRootPath();

  const page = pages[`${account.id}_${THREADS_LOGIN_URL}`] || pages[`${account.id}_${THEAD_URL}`];
  if (!page) {
    sendEvent({ account, event, status: 'No page found' });
    throw new Error(`No page found with ID ${account.id}.`);
  }
  const cookies = await page.cookies();
  fs.writeFileSync(`${folderPath}/cookies/${account.account}.json`, JSON.stringify(cookies));

  fs.writeFileSync(`${folderPath}/user-agent/${account.account}.txt`, userAgents[account.id]);

  await sendEvent({ event, account, status: 'Cookies saved' });
  await browsers[account.id].close();
}

export {
  saveCookie
};