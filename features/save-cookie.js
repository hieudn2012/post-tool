import { sendEvent } from "./common.js";

// save cookies
async function saveCookie({ account, event, pages, browsers, userAgents }) {
  const page = pages[`${account.id}_https://www.threads.net/login/`];
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