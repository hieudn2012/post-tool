import axios from 'axios';
import { sleep, launchBrowser, openPage, sendEvent, closeBrowser } from './common.js';
import { saveCookies } from './save-cookie.js';

import fs from 'node:fs';
import { APP_API_URL } from '../src/constants/common.js';

export const updateAccountMessage = async ({ message, accountId, token }) => {
  return axios.put(`${APP_API_URL}/accounts/${accountId}`, { message }, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
}

const writeError = async ({ message, accountId, token }) => {
  return axios.post(`${APP_API_URL}/errors`, { message, accountId }, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
};

// Handle run
const run = async ({ event, runner, browsers, pages, headless }) => {
  const { token } = runner;
  const working_folder = runner.working_folder;
  const accountId = runner.accountId;
  const { _id: contentId, title, link } = runner.content;


  const totalBrowsers = Object.keys(browsers).length;
  if (totalBrowsers > 6) {
    // ranrom time to wait from 30s to 1m
    updateAccountMessage({ message: 'Waiting...', accountId, token });
    await sleep(Math.floor(Math.random() * 30 + 30) * 1000);
  }

  // check browser is exist then close
  if (browsers[accountId]) {
    await closeBrowser({ runner, browsers });
  }

  await launchBrowser({
    runner,
    headless: true,
    browsers,
    withCookies: true,
  });

  await updateAccountMessage({ message: 'Running...', accountId, token });

  try {
    const page = await openPage({
      runner,
      url: 'https://www.threads.net/',
      browsers,
      pages,
      withCookies: true
    });

    await sleep(10000);
    const postButton = await page.$('div.x1i10hfl.x1ypdohk.xdl72j9.x2lah0s.xe8uvvx.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.x2lwn1j.xeuugli.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x1n2onr6.x16tdsg8.x1hl2dhg.xggy1nq.x1ja2u2z.x1t137rt.x1q0g3np.x1lku1pv.x1a2a7pz.x6s0dn4.x9f619.x3nfvp2.x1s688f.xc9qbxq.xl56j7k.x193iq5w.x12w9bfk.x1g2r6go.x11xpdln.xz4gly6.x87ps6o.xuxw1ft.x19kf12q.x9dqhi0.x6bh95i.x1re03b8.x1hvtcl2.x3ug3ww.x1a2cdl4.xnhgr82.x1qt0ttw.xgk8upj.x13fuv20.xu3j5b3.x1q0q8m5.x26u7qi.x178xt8z.xm81vs4.xso031l.xy80clv.xp07o12');
    await postButton.click();

    await sleep(10000);
    const postContent = `${title} ${link}`;
    const fileInputElement = await page.$('input[type="file"]');
    const imagePaths = `${working_folder}/images/${contentId}.png`;

    if (!fs.existsSync(imagePaths)) {
      await updateAccountMessage({ message: `Image not found ${contentId}`, accountId, token });
      await closeBrowser({ runner, browsers });
      return;
    }

    await fileInputElement.uploadFile(`${working_folder}/images/${contentId}.png`);
    await sleep(3000);


    const captionElement = await page.$('div.xzsf02u.xw2csxc.x1odjw0f.x1n2onr6.x1hnll1o.xpqswwc.notranslate');
    const pElement = await captionElement.$('p');
    await pElement.type(postContent);
    await sleep(2000);

    // tab to post button
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    await saveCookies({ runner, pages });
    await closeBrowser({ runner, browsers });
    await sendEvent({ event, runner: { accountId }, message: 'New round', retry: true });
  } catch (error) {
    await writeError({ message: error.message, accountId, token });
    if (!browsers[accountId]) {
      await updateAccountMessage({ message: 'Stoped!', accountId, token });
      return;
    }
    await closeBrowser({ runner, browsers });
    if (error.message === 'net::ERR_PROXY_CONNECTION_FAILED at https://www.threads.net/') {
      await updateAccountMessage({ message: `Proxy error: ${runner.proxy?.ip}`, accountId, token });
      return;
    }
    await sendEvent({ event, runner: { accountId }, message: 'Retrying...', retry: true });
  }
};

export {
  run,
};