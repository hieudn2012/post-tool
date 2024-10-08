import fs from 'node:fs';
import { sleep, launchBrowser, sendEvent, openPage, getRootPath } from './common.js';

// Handle run
const run = async ({ event, account, browsers, userAgents, pages, headless }) => {
  const category = account.category;
  if (!category) {
    sendEvent({ event, account, status: 'Category is not selected', retry: false });
    return;
  }

  const folderPath = getRootPath();
  if (!fs.existsSync(`${folderPath}/history/${account.account}.json`)) {
    fs.writeFileSync(`${folderPath}/history/${account.account}.json`, '{}');
  }
  const historyString = fs.readFileSync(`${folderPath}/history/${account.account}.json`, 'utf8');
  const history = JSON.parse(historyString);
  const posted = (history.posted || []).filter(post => post.category === category);
  const postedIds = posted.map(post => post.postId);

  const postsString = fs.readFileSync(`${folderPath}/categories/${category}/posts.json`, 'utf8');
  const posts = JSON.parse(postsString);
  let randomPost = posts[Math.floor(Math.random() * posts.length)];
  const seconds = account.timePost * 60 * 60 * 1000;
  const lastPost = posted[posted.length - 1];

  let timeSleep = -1;
  if (lastPost) {
    const givenDate = new Date(lastPost.date);
    const currentDate = new Date();
    const differenceInMilliseconds = currentDate - givenDate;
    timeSleep = Math.floor(seconds - differenceInMilliseconds);
  }
  if (lastPost && timeSleep > 0) {
    event.sender.send('action-result', { ...account, status: `Waiting for next post...` });
    // Sleep for timeSleep + random time from 1 to 10 minutes
    await sleep(timeSleep + Math.floor(Math.random() * 600000));
  }

  await launchBrowser({
    account,
    headless,
    browsers,
    userAgents,
    withCookies: true,
  });

  try {
    sendEvent({ event, account, status: 'Changing user agent...' });

    const page = await openPage({
      account,
      url: 'https://www.threads.net/',
      browsers,
      pages,
      withCookies: true
    });

    sendEvent({ event, account, status: 'Page is opening and finding the post button...' });
    await sleep(15000);

    // find div with class = "x1i10hfl x1ypdohk xdl72j9 x2lah0s xe8uvvx xdj266r x11i5rnm xat24cr x1mh8g0r x2lwn1j xeuugli xexx8yu x4uap5 x18d9i69 xkhd6sd x1n2onr6 x16tdsg8 x1hl2dhg xggy1nq x1ja2u2z x1t137rt x1q0g3np x1lku1pv x1a2a7pz x6s0dn4 x9f619 x3nfvp2 x1s688f xc9qbxq xl56j7k x193iq5w x12w9bfk x1g2r6go x11xpdln xz4gly6 x87ps6o xuxw1ft x19kf12q x9dqhi0 x6bh95i x1re03b8 x1hvtcl2 x3ug3ww x1a2cdl4 xnhgr82 x1qt0ttw xgk8upj x13fuv20 xu3j5b3 x1q0q8m5 x26u7qi x178xt8z xm81vs4 xso031l xy80clv xp07o12"
    const postButton = await page.$('div.x1i10hfl.x1ypdohk.xdl72j9.x2lah0s.xe8uvvx.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.x2lwn1j.xeuugli.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x1n2onr6.x16tdsg8.x1hl2dhg.xggy1nq.x1ja2u2z.x1t137rt.x1q0g3np.x1lku1pv.x1a2a7pz.x6s0dn4.x9f619.x3nfvp2.x1s688f.xc9qbxq.xl56j7k.x193iq5w.x12w9bfk.x1g2r6go.x11xpdln.xz4gly6.x87ps6o.xuxw1ft.x19kf12q.x9dqhi0.x6bh95i.x1re03b8.x1hvtcl2.x3ug3ww.x1a2cdl4.xnhgr82.x1qt0ttw.xgk8upj.x13fuv20.xu3j5b3.x1q0q8m5.x26u7qi.x178xt8z.xm81vs4.xso031l.xy80clv.xp07o12');
    postButton.click();

    sendEvent({ event, account, status: 'Found the post button and checking post content...' });

    // check posted is full
    if (posted.length === posts.length) {
      sendEvent({ event, account, status: 'All posts are posted', retry: false });
      await browsers[account.id].close();
      return;
    }

    while (postedIds.includes(randomPost.postId)) {
      randomPost = posts[Math.floor(Math.random() * posts.length)];
    }

    const postContent = `${randomPost.title} ${randomPost.url}`;

    // find input type  = file, while loop until found
    sendEvent({ event, account, status: 'Waiting to find upload image...' });
    await sleep(15000);
    const fileInputElement = await page.$('input[type="file"]');

    await fileInputElement.uploadFile(`${folderPath}/categories/${category}/images/${randomPost.id}.png`);
    sendEvent({ event, account, status: 'Uploaded image for post and Finding post content...' });

    // find div with class = "xzsf02u xw2csxc x1odjw0f x1n2onr6 x1hnll1o xpqswwc notranslate"
    const captionElement = await page.$('div.xzsf02u.xw2csxc.x1odjw0f.x1n2onr6.x1hnll1o.xpqswwc.notranslate');
    // find p nested in captionElement
    const pElement = await captionElement.$('p');
    // type caption
    await pElement.type(postContent);

    // tab to post button
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');

    sendEvent({ event, account, status: 'Waiting to post...' });
    await sleep(10000);

    // save cookies
    const newCookies = await page.cookies();
    fs.writeFileSync(`${folderPath}/cookies/${account.account}.json`, JSON.stringify(newCookies));

    history.posted = [...history.posted || [], { id: randomPost.id, postId: randomPost.postId, date: new Date().toISOString(), category }];
    fs.writeFileSync(`${folderPath}/history/${account.account}.json`, JSON.stringify(history));

    sendEvent({ event, account, status: 'Waiting to save cookies... and start new round' });
    await sleep(3000);

    await browsers[account.id].close();

    sendEvent({
      event,
      account,
      status: 'Done',
      isNewRound: true,
      latestPost: {
        date: new Date().toISOString(),
      }
    });

    // Send to API to save history
    fetch('https://66e15506c831c8811b548c9a.mockapi.io/histories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        postedBy: account.account,
        postedAt: new Date().toLocaleString(),
        postId: randomPost.id,
      }),
    });

  } catch (error) {
    if (!browsers[account.id]) {
      return await sendEvent({ event, account, status: 'You are stoped!' });
    }
    await browsers[account.id]?.close();
    if (error.message === 'net::ERR_PROXY_CONNECTION_FAILED at https://www.threads.net/') {
      return await sendEvent({ event, account, status: 'Proxy error, stoped!' });
    }

    event.sender.send('action-result', { ...account, status: `${error} || waiting for 60s to start new round`, retry: false });
    await sleep(60000);
    event.sender.send('action-result', { ...account, status: `New round`, retry: true });

    // Send to API to save error
    fetch('https://66e15506c831c8811b548c9a.mockapi.io/errors', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        postedBy: account.account,
        postedAt: new Date().toLocaleString(),
        error: error,
      }),
    });
  }
};

export {
  run,
};