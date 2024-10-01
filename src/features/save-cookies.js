import { API_URL, THREADS_LOGIN_URL } from "../constants/common.js";
import { closeBrowser } from "../utils/common.js";
import request from "../utils/request.js";

export const saveCookies = async ({ account, browsers, pages }) => {
  const { _id } = account;

  const page = pages[`${_id}_${THREADS_LOGIN_URL}`];
  const cookies = await page.cookies();

  await request.put(`${API_URL}/accounts/${_id}`, { cookies: JSON.stringify(cookies) });
  await closeBrowser({ account, browsers });
}