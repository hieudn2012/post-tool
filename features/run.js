import { sleep, launchBrowser, openPage, sendEvent } from './common.js';
import { saveCookies } from './save-cookie.js';

import fs from 'node:fs';

// Handle run
const run = async ({ event, runner, browsers, pages, headless }) => {
  const working_folder = runner.working_folder;
  const accountId = runner.accountId;
  const { _id: contentId, title, link } = runner.content;

  sendEvent({ event, runner, message: 'Opening Threads...' });

  await launchBrowser({
    runner,
    headless: false,
    browsers,
    withCookies: true,
  });

  try {
    const page = await openPage({
      runner,
      url: 'https://www.threads.net/',
      browsers,
      pages,
      withCookies: true
    });

    await sleep(10000);


    await sendEvent({ event, runner: { accountId }, message: 'Opening Threads and finding post button...' });
    const postButton = await page.$('div.x1i10hfl.x1ypdohk.xdl72j9.x2lah0s.xe8uvvx.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.x2lwn1j.xeuugli.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x1n2onr6.x16tdsg8.x1hl2dhg.xggy1nq.x1ja2u2z.x1t137rt.x1q0g3np.x1lku1pv.x1a2a7pz.x6s0dn4.x9f619.x3nfvp2.x1s688f.xc9qbxq.xl56j7k.x193iq5w.x12w9bfk.x1g2r6go.x11xpdln.xz4gly6.x87ps6o.xuxw1ft.x19kf12q.x9dqhi0.x6bh95i.x1re03b8.x1hvtcl2.x3ug3ww.x1a2cdl4.xnhgr82.x1qt0ttw.xgk8upj.x13fuv20.xu3j5b3.x1q0q8m5.x26u7qi.x178xt8z.xm81vs4.xso031l.xy80clv.xp07o12');
    postButton.click();

    const postContent = `${title} ${link}`;

    await sendEvent({ event, runner: { accountId }, message: 'Uploading image...' });
    await sleep(10000);
    const fileInputElement = await page.$('input[type="file"]');
    const imagePaths = `${working_folder}/images/${contentId}.png`;
    
    if (!fs.existsSync(imagePaths)) {
      await sendEvent({ event, runner: { accountId }, message: 'Image not found!' });
      browsers[accountId].close();
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
    await sendEvent({ event, runner: { accountId }, message: 'Waiting for post...' });
    await sleep(10000);
    await saveCookies({ runner, pages });
    await sendEvent({ event, runner: { accountId }, message: 'Post done!, Waiting for the save cookies...' });
    await sleep(3000);
    await sendEvent({ event, runner: { accountId }, message: 'New round', retry: true });

    await browsers[accountId].close();
  } catch (error) {
    if (!browsers[accountId]) {
      return await sendEvent({ event, runner: { accountId }, message: 'You are stoped!' });
    }
    await browsers[accountId]?.close();
    if (error.message === 'net::ERR_PROXY_CONNECTION_FAILED at https://www.threads.net/') {
      return await sendEvent({ event, runner: { accountId }, message: 'Proxy error, stoped!' });
    }
    
    await sendEvent({ event, runner: { accountId }, message: error.message });
    await sleep(10000);
    await sendEvent({ event, runner: { accountId }, message: 'Error occured, retrying...' });
    await sleep(5000);
    await sendEvent({ event, runner: { accountId }, message: 'Retrying...', retry: true });
  }
};

export {
  run,
};