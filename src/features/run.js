import { API_URL, THREADS_LOGIN_URL } from "../constants/common.js";
import { closeBrowser, launchBrowser, openPage, sendEvent, sleep } from "../utils/common.js";
import request from "../utils/request.js";
import fs from 'node:fs';

export const stop = async ({ account, browsers }) => {
  const id = account._id;

  if (browsers[id]) {
    await browsers[id].close();
    delete browsers[id];
  } else {
    console.log(`No browser found with ID ${id}.`);
  }
}

export const run = async ({ account = {}, event, browsers, pages }) => {
  await sendEvent({ event, account: { ...account, eventMessage: 'Running...' } });

  const { _id } = account;

  if (browsers[_id]) {
    console.log(`Account ${_id} is already running.`);
    return;
  }

  try {
    await launchBrowser({ account, headless: true, browsers });
    const page = await openPage({ account, url: THREADS_LOGIN_URL, browsers, pages });
    await sleep(5000);

    // find div with class "xc26acl x6s0dn4 x78zum5 xl56j7k x6ikm8r x10wlt62 x1swvt13 x1pi30zi xlyipyv xp07o12"
    const postButton = await page.$('div.xc26acl.x6s0dn4.x78zum5.xl56j7k.x6ikm8r.x10wlt62.x1swvt13.x1pi30zi.xlyipyv.xp07o12');
    await postButton.click();
    await sendEvent({ event, account: { ...account, eventMessage: 'Finding post button...' } });
    await sleep(10000);

    const { data } = await request.get(`${API_URL}/accounts/${_id}/content-for-run`);
    const { postContent, _id: content_id, image, working_directory } = data;

    // download image and upload to file input
    const img = await fetch(image);
    const buffer = await img.arrayBuffer();
    const bufferData = Buffer.from(buffer);

    if (!fs.existsSync(`${working_directory}/${_id}`)) {
      fs.mkdirSync(`${working_directory}/${_id}`);
    }
    fs.writeFileSync(`${working_directory}/${_id}/file_upload.png`, bufferData);

    // find input with type = "file"
    const fileInput = await page.$('input[type="file"]');
    await fileInput.uploadFile(`${working_directory}/${_id}/file_upload.png`);
    await sendEvent({ event, account: { ...account, eventMessage: 'Finding image upload...' } });
    await sleep(10000);

    // find p with class "xdj266r x11i5rnm xat24cr x1mh8g0r"
    const postText = await page.$('p.xdj266r.x11i5rnm.xat24cr.x1mh8g0r');
    await postText.type(postContent);
    await sleep(2000);

    // tabs 4 times
    await page.keyboard.press('Tab');
    await sleep(500);
    await page.keyboard.press('Tab');
    await sleep(500);
    await page.keyboard.press('Tab');
    await sleep(500);
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    await sendEvent({ event, account: { ...account, eventMessage: 'Submiting...' } });
    await sleep(10000);


    await request.post(`${API_URL}/history`, {
      content_id: content_id,
      account_id: _id,
    });
    await sleep(5000);

    await closeBrowser({ account, browsers });
    await sendEvent({ event, account: { ...account, eventMessage: 'New round!', isNewRound: true } });
  } catch (error) {
    await request.post(`${API_URL}/errors`, {
      accountId: _id,
      message: error?.message,
    });
    await sendEvent({ event, account: { ...account, eventMessage: 'Error' } });
    console.log(`Error running account ${_id}: ${error.message}`);
  }
}
