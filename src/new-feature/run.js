import puppeteer from 'puppeteer';
import GoLogin from 'gologin';
import fs from 'node:fs';
import { getConfig } from './common.js';

const { connect } = puppeteer;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const moveMouseRandomly = async (page) => {
  const viewport = page.viewport();
  for (let i = 0; i < 5; i++) {
    const x = Math.floor(Math.random() * viewport.width);
    const y = Math.floor(Math.random() * viewport.height);
    await page.mouse.move(x, y);
    await delay(500); // Delay giữa các bước di chuyển
  }
};

const scrollPage = async (page) => {
  const scrollHeight = await page.evaluate(() => document.body.scrollHeight);
  for (let i = 0; i < scrollHeight; i += 500) {
    await page.evaluate(`window.scrollTo(0, ${i})`);
    await delay(1000); // Tạo khoảng nghỉ
  }
};

const randomDelay = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

const post = async (page) => {
  await scrollPage(page);
  await moveMouseRandomly(page);

  // find button with class = "x1i10hfl x1ypdohk xdl72j9 x2lah0s xe8uvvx xdj266r x11i5rnm xat24cr x1mh8g0r x2lwn1j xeuugli xexx8yu x4uap5 x18d9i69 xkhd6sd x1n2onr6 x16tdsg8 x1hl2dhg xggy1nq x1ja2u2z x1t137rt x1q0g3np x1lku1pv x1a2a7pz x6s0dn4 x9f619 x3nfvp2 x1s688f xc9qbxq xl56j7k x193iq5w x12w9bfk x1g2r6go x11xpdln xz4gly6 x87ps6o xuxw1ft x19kf12q x9dqhi0 x6bh95i x1re03b8 x1hvtcl2 x3ug3ww x1a2cdl4 xnhgr82 x1qt0ttw xgk8upj x13fuv20 xu3j5b3 x1q0q8m5 x26u7qi x178xt8z xm81vs4 xso031l xy80clv xp07o12"
  await page.click('.x1i10hfl.x1ypdohk.xdl72j9.x2lah0s.xe8uvvx.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.x2lwn1j.xeuugli.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x1n2onr6.x16tdsg8.x1hl2dhg.xggy1nq.x1ja2u2z.x1t137rt.x1q0g3np.x1lku1pv.x1a2a7pz.x6s0dn4.x9f619.x3nfvp2.x1s688f.xc9qbxq.xl56j7k.x193iq5w.x12w9bfk.x1g2r6go.x11xpdln.xz4gly6.x87ps6o.xuxw1ft.x19kf12q.x9dqhi0.x6bh95i.x1re03b8.x1hvtcl2.x3ug3ww.x1a2cdl4.xnhgr82.x1qt0ttw.xgk8upj.x13fuv20.xu3j5b3.x1q0q8m5.x26u7qi.x178xt8z.xm81vs4.xso031l.xy80clv.xp07o12');
  await moveMouseRandomly(page);
  await delay(randomDelay(1000, 5000));

  // find input with type = "file"
  await page.waitForSelector('input[type=file]');
  const input = await page.$('input[type=file]');

  const parentFolder = `/Users/admin/Downloads/Medias`;
  // get all child folders in parent folder omit hidden folders
  const childFolders = fs.readdirSync(parentFolder);
  // ignore hidden folders
  const ignoreFolders = ['.DS_Store'];
  const filteredChildFolders = childFolders.filter(folder => !ignoreFolders.includes(folder));

  const length = filteredChildFolders.length;
  const randomIndex = Math.floor(Math.random() * length);
  const selectedFolder = filteredChildFolders[randomIndex];
  // get all files in selected folder
  const files = fs.readdirSync(`${parentFolder}/${selectedFolder}`);
  const ignoreFiles = ['.DS_Store'];
  const filteredFiles = files.filter(file => !ignoreFiles.includes(file));

  // log all files
  filteredFiles.forEach(async (file) => {
    await input.uploadFile(`${parentFolder}/${selectedFolder}/${file}`);
    await delay(randomDelay(5000, 10000));
  });

  const captions = [
    `2006🥵`,
    `2008🥵`,
    `snap?`,
    `insta?`,
    `Hiii`,
  ];

  // find div with class xzsf02u xw2csxc x1odjw0f x1n2onr6 x1hnll1o xpqswwc notranslate
  const caption = captions[Math.floor(Math.random() * captions.length)];
  const captionInput = await page.$('div.xzsf02u.xw2csxc.x1odjw0f.x1n2onr6.x1hnll1o.xpqswwc.notranslate > p');
  await captionInput.type(caption, { delay: 100 });

  // find div with class = x6s0dn4 x78zum5 x49hn82 xcrlgei x1rlzn12 x889kno
  await page.waitForSelector('div.x6s0dn4.x78zum5.x49hn82.xcrlgei.x1rlzn12.x889kno');
  const commentButton = await page.$('div.x6s0dn4.x78zum5.x49hn82.xcrlgei.x1rlzn12.x889kno');
  const target = await commentButton.$('div:nth-child(2)');
  await target.click({ delay: 1000 });
  await delay(2000);

  const links = getConfig().links.trim();
  const linkList = links.split('\n');
  const randomIndexLink = Math.floor(Math.random() * linkList.length);
  const randomLink = linkList[randomIndexLink];

  // parent is a div with class = x9f619 xrvj5dj xd0jker xryxfnj xs9asl8 xbbxn1n xxbr6pl x1wxlsmb x5hsz1j x127lhb5 xn0cd8s, find child is a p by doom parent > div > div > div > p
  const postText = await page.$('div.x9f619.xrvj5dj.xd0jker.xryxfnj.xs9asl8.xbbxn1n.xxbr6pl.x1wxlsmb.x5hsz1j.x127lhb5.xn0cd8s > div > div > div > p');
  const content = `🔞 Watch more here 🔞💦 ${randomLink} ☑️`
  await delay(randomDelay(2000, 5000));
  await postText.type(content, { delay: 100 });
  await delay(randomDelay(2000, 5000));

  // find x button with class = "xds687c xz9dl7a xn6708d xsag5q8 x1ye3gou x10l6tqk x13vifvy"
  // await page.waitForSelector('.xds687c.xz9dl7a.xn6708d.xsag5q8.x1ye3gou.x10l6tqk.x13vifvy', { visible: true });
  // await delay(randomDelay(2000, 5000));
  // await page.click('.xds687c.xz9dl7a.xn6708d.xsag5q8.x1ye3gou.x10l6tqk.x13vifvy', { delay: 500 });

  await moveMouseRandomly(page);

  // find post button with class = x6s0dn4 x9f619 x78zum5 x15zctf7 x18r3tyq x1qughib x1p5oq8j xxbr6pl xwxc41k xbbxn1n
  const postButton = await page.$('div.x6s0dn4.x9f619.x78zum5.x15zctf7.x18r3tyq.x1qughib.x1p5oq8j.xxbr6pl.xwxc41k.xbbxn1n > div');
  await postButton.click({ delay: 1000 });
}

const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NmU1OTk2OTg4OTViY2JiYmFiNDQ2MWUiLCJ0eXBlIjoiZGV2Iiwiand0aWQiOiI2NzNjNTFhZTY2MjY3ZGZlZDg1N2E2ZTkifQ.OSBZosuthmv1sk0f7kCcz-14jPvzpClgjO9oqHa_Mkg';


const post2 = async (page) => {
  await scrollPage(page);
  await moveMouseRandomly(page);

  // choose selector with id = barcelona-page-layout
  const root = await page.waitForSelector('#barcelona-page-layout');

  // find post button
  const postButton = await root.$(`div > div > :nth-child(2) > div > :nth-child(2) > div > :nth-child(3)`);
  await moveMouseRandomly(page);
  await postButton.click();

  // find input with type = "file"
  await page.waitForSelector('input[type=file]');
  const input = await page.$('input[type=file]');
  await moveMouseRandomly(page);

  const parentFolder = `/Users/admin/Downloads/Medias`;
  const childFolders = fs.readdirSync(parentFolder);
  // ignore hidden folders
  const ignoreFolders = ['.DS_Store'];
  const filteredChildFolders = childFolders.filter(folder => !ignoreFolders.includes(folder));

  const length = filteredChildFolders.length;
  const randomIndex = Math.floor(Math.random() * length);
  const selectedFolder = filteredChildFolders[randomIndex];
  // get all files in selected folder
  const files = fs.readdirSync(`${parentFolder}/${selectedFolder}`);
  const ignoreFiles = ['.DS_Store'];
  const filteredFiles = files.filter(file => !ignoreFiles.includes(file));

  for (const file of filteredFiles) {
    await input.uploadFile(`${parentFolder}/${selectedFolder}/${file}`);
    await moveMouseRandomly(page);
    await delay(randomDelay(2000, 4000));
  }

  // find div with aria-placeholder = "What's new?"
  const divCaption = await page.waitForSelector('div[aria-placeholder="What\'s new?"]');
  const caption = await divCaption.$(`p`);
  await caption.type(`🔞 Watch more here 🔞💦  ☑️`, { delay: 100 });
  await moveMouseRandomly(page);

  // find text include = "Add to thread"
  const addThread = await page.waitForSelector('text=Add to thread');
  await addThread.click();

  // find div with aria-placeholder = "Say more..."
  const divComment = await page.waitForSelector('div[aria-placeholder="Say more..."]');
  const comment = await divComment.$(`p`);
  await comment.type(`🔞 Watch more here 🔞💦  ☑️`, { delay: 100 });
  await moveMouseRandomly(page);
};


export const run = async (userId) => {
  const GL = new GoLogin({
    token: TOKEN,
    profile_id: userId,
  });

  const { status, wsUrl } = await GL.start().catch((e) => {
    console.trace(e);

    return { status: 'failure' };
  });

  if (status !== 'success') {
    console.log('Invalid status');

    return;
  }

  const browser = await connect({
    browserWSEndpoint: wsUrl.toString(),
    ignoreHTTPSErrors: true,
  });

  const page = await browser.newPage();
  page.setViewport({ width: 1920, height: 1080 });
  await page.goto('https://www.threads.net/');
  await page.content();
  await delay(10000);

  const limit = 1;
  let count = 0;
  while (count < limit) {
    await post2(page);
    await delay(10000);
    console.log(`Post ${count + 1} completed`);
    count++;
  }



  await browser.close();
  await GL.stop();
};