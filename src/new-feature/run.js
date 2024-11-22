import puppeteer from 'puppeteer-core';
import GoLogin from 'gologin';
import fs from 'node:fs';

const { connect } = puppeteer;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const post = async (page) => {
  // find button with class = "x1i10hfl x1ypdohk xdl72j9 x2lah0s xe8uvvx xdj266r x11i5rnm xat24cr x1mh8g0r x2lwn1j xeuugli xexx8yu x4uap5 x18d9i69 xkhd6sd x1n2onr6 x16tdsg8 x1hl2dhg xggy1nq x1ja2u2z x1t137rt x1q0g3np x1lku1pv x1a2a7pz x6s0dn4 x9f619 x3nfvp2 x1s688f xc9qbxq xl56j7k x193iq5w x12w9bfk x1g2r6go x11xpdln xz4gly6 x87ps6o xuxw1ft x19kf12q x9dqhi0 x6bh95i x1re03b8 x1hvtcl2 x3ug3ww x1a2cdl4 xnhgr82 x1qt0ttw xgk8upj x13fuv20 xu3j5b3 x1q0q8m5 x26u7qi x178xt8z xm81vs4 xso031l xy80clv xp07o12"
  await page.click('.x1i10hfl.x1ypdohk.xdl72j9.x2lah0s.xe8uvvx.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.x2lwn1j.xeuugli.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x1n2onr6.x16tdsg8.x1hl2dhg.xggy1nq.x1ja2u2z.x1t137rt.x1q0g3np.x1lku1pv.x1a2a7pz.x6s0dn4.x9f619.x3nfvp2.x1s688f.xc9qbxq.xl56j7k.x193iq5w.x12w9bfk.x1g2r6go.x11xpdln.xz4gly6.x87ps6o.xuxw1ft.x19kf12q.x9dqhi0.x6bh95i.x1re03b8.x1hvtcl2.x3ug3ww.x1a2cdl4.xnhgr82.x1qt0ttw.xgk8upj.x13fuv20.xu3j5b3.x1q0q8m5.x26u7qi.x178xt8z.xm81vs4.xso031l.xy80clv.xp07o12');
  await delay(3000);

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
    await delay(1000);
  });

  // find div with class = x6s0dn4 x78zum5 x49hn82 xcrlgei x1rlzn12 x889kno
  await page.waitForSelector('div.x6s0dn4.x78zum5.x49hn82.xcrlgei.x1rlzn12.x889kno');
  const commentButton = await page.$('div.x6s0dn4.x78zum5.x49hn82.xcrlgei.x1rlzn12.x889kno');
  const target = await commentButton.$('div:nth-child(2)');
  await target.click({ delay: 1000 });
  await delay(2000);


  // parent is a div with class = x9f619 xrvj5dj xd0jker xryxfnj xs9asl8 xbbxn1n xxbr6pl x1wxlsmb x5hsz1j x127lhb5 xn0cd8s, find child is a p by doom parent > div > div > div > p
  const postText = await page.$('div.x9f619.xrvj5dj.xd0jker.xryxfnj.xs9asl8.xbbxn1n.xxbr6pl.x1wxlsmb.x5hsz1j.x127lhb5.xn0cd8s > div > div > div > p');
  const content = `① photo ʟɪɴᴋ https://buff.ly/3YWO8lN \n① video ʟɪɴᴋ https://buff.ly/3YWO8lN`
  await postText.type(content);

  // find button with class = "xds687c xz9dl7a xn6708d xsag5q8 x1ye3gou x10l6tqk x13vifvy"
  await page.waitForSelector('.xds687c.xz9dl7a.xn6708d.xsag5q8.x1ye3gou.x10l6tqk.x13vifvy', { visible: true });
  await delay(2000);
  await page.click('.xds687c.xz9dl7a.xn6708d.xsag5q8.x1ye3gou.x10l6tqk.x13vifvy', { delay: 300 });

  // find post button with class = x6s0dn4 x9f619 x78zum5 x15zctf7 x18r3tyq x1qughib x1p5oq8j xxbr6pl xwxc41k xbbxn1n
  const postButton = await page.$('div.x6s0dn4.x9f619.x78zum5.x15zctf7.x18r3tyq.x1qughib.x1p5oq8j.xxbr6pl.xwxc41k.xbbxn1n > div');
  await postButton.click({ delay: 300 });
}

const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NmU1OTk2OTg4OTViY2JiYmFiNDQ2MWUiLCJ0eXBlIjoiZGV2Iiwiand0aWQiOiI2NzNjNTFhZTY2MjY3ZGZlZDg1N2E2ZTkifQ.OSBZosuthmv1sk0f7kCcz-14jPvzpClgjO9oqHa_Mkg';
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
  await page.goto('https://www.threads.net/');
  await page.content();
  await delay(10000);

  const limit = 4;
  let count = 0;
  while (count < limit) {
    await post(page);
    await delay(10000);
    console.log(`Post ${count + 1} completed`);
    count++;
  }



  await browser.close();
  await GL.stop();
};