import { launchBrowser, openPage } from "./common.js";

export const openTestBrowser = async ({ runner, browsers, pages, userAgents }) => {
  await launchBrowser({ runner, headless: false, browsers, userAgents });
  await openPage({ runner, url: 'https://www.threads.net/', browsers, pages });
};