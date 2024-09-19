import axios from 'axios';
import { THREADS_LOGIN_URL, INSTAGRAM_URL, THEAD_URL, APP_API_URL } from '../src/constants/common.js';

export const saveCookies = async ({ runner, pages, isNew }) => {
  const { accountId, random_user_agent, token, account } = runner;
  const page = pages[`${accountId}_${THREADS_LOGIN_URL}`]
    || pages[`${accountId}_${INSTAGRAM_URL}`]
    || pages[`${accountId}_${THEAD_URL}`];
  const newCookies = await page.cookies();
  const data = {
    cookies: JSON.stringify(newCookies),
    user_agent: account.user_agent || random_user_agent,
  };
  if (isNew) {
    data.user_agent = random_user_agent
  }
  await axios.put(`${APP_API_URL}/accounts/${accountId}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });

  // save history
  await axios.post(`${APP_API_URL}/history`, {
    account: runner.account.account,
    ip: runner.proxy.ip,
    port: runner.proxy.port,
    content_id: runner.content._id,
    category_id: runner.content.category,
    category_name: runner.category.category,
    create_at: new Date(),
    root: runner.root,
  }, {
    headers: { Authorization: `Bearer ${token}` }
  });
};