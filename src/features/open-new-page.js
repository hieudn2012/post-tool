import { THREADS_LOGIN_URL } from "../constants/common.js";
import { launchBrowser, openPage } from "../utils/common.js";

export const openNewPage = async ({ account, browsers, pages }) => {
  await launchBrowser({ account, headless: false, browsers });
  await openPage({ account, url: THREADS_LOGIN_URL, pages, browsers });
};