import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import _ from 'lodash';
import { getConfig } from './common.js';

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
export const crawlData = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  });
  const page = await browser.newPage();
  await page.goto(`https://www.threads.net/@anmabs20`);
  await page.content();
  await sleep(5000);

  // scroll continuously for 5 seconds
  await page.evaluate(() => {
    const scroll = () => {
      window.scrollBy(0, window.innerHeight);
      window.scrollBy(0, -window.innerHeight);
    };
    setInterval(scroll, 1000);
  });

  // get last 10 posts by class name x78zum5 xdt5ytf
  const data = await page.evaluate(() => {
    const posts = document.querySelectorAll('.x1xmf6yo');
    return Array.from(posts).map(post => {
      //get all img and video tag in post
      const imgs = post.querySelectorAll('img');

      // filter image with class = xl1xv1r x1lq5wgf xgqcy7u x30kzoy x9jhf4c x9f619 x1lliihq xmz0i5r x193iq5w xuiwhb7 x1g40iwv x47corl x87ps6o x1ey2m1c xds687c x17qophe x10l6tqk x13vifvy x5yr21d xh8yej3
      const filterImgs = Array.from(imgs).filter(img => img.className === 'xl1xv1r x1lq5wgf xgqcy7u x30kzoy x9jhf4c x9f619 x1lliihq xmz0i5r x193iq5w xuiwhb7 x1g40iwv x47corl x87ps6o x1ey2m1c xds687c x17qophe x10l6tqk x13vifvy x5yr21d xh8yej3');
      const images = Array.from(filterImgs).map(img => img.src);

      const videos = post.querySelectorAll('video');
      const videosSrc = Array.from(videos).map(video => video.src);
      return {
        images,
        videosSrc,
      };
    });
  });

  const folderConfig = getConfig().saveFolder;

  _.forEach(data, async (post) => {
    const images = post.images;
    // create empty folder for each post
    const folderName = Math.random().toString(36).substring(2, 22);
    const folder = `${folderConfig}/${folderName}`;
    fs.mkdirSync(folder);

    _.forEach(images, async (image) => {
      try {
        // Tải file từ URL
        const response = await fetch(image);
        const contentType = response.headers.get('content-type');

        if (!response.ok) {
          throw new Error(`Failed to download file: ${response.statusText}`);
        }

        const extensionMap = {
          'image/jpeg': '.jpg',
          'image/png': '.png',
          'image/gif': '.gif',
          'application/pdf': '.pdf',
          'text/html': '.html',
        };
        const randomName =  Math.random().toString(36).substring(2, 22);
        const extension = extensionMap[contentType] || '.jpg';
        const fileName = `${randomName}${extension}`;


        // Đọc nội dung và lưu thành file
        const arrayBuffer = await response.arrayBuffer(); // Sử dụng arrayBuffer
        const buffer = Buffer.from(arrayBuffer); // Chuyển arrayBuffer thành Buffer
        const filePath = `${folder}/${fileName}`;

        // Ghi file
        fs.writeFileSync(filePath, buffer);
        console.log('File downloaded and saved to:', filePath);
      } catch (error) {
        console.error('Error downloading the file:', error);
      }
    });

    const videosSrc = post.videosSrc;
    _.forEach(videosSrc, async (video) => {
      try {
        // Tải file từ URL
        const response = await fetch(video);
        const contentType = response.headers.get('content-type');

        if (!response.ok) {
          throw new Error(`Failed to download file: ${response.statusText}`);
        }

        const extensionMap = {
          'video/mp4': '.mp4',
          'video/quicktime': '.mov',
          'video/3gpp': '.3gp',
        };
        const randomName =  Math.random().toString(36).substring(2, 22);
        const extension = extensionMap[contentType] || '.mp4';
        const fileName = `${randomName}${extension}`;


        // Đọc nội dung và lưu thành file
        const arrayBuffer = await response.arrayBuffer(); // Sử dụng arrayBuffer
        const buffer = Buffer.from(arrayBuffer); // Chuyển arrayBuffer thành Buffer
        const filePath = `${folder}/${fileName}`;

        // Ghi file
        fs.writeFileSync(filePath, buffer);
        console.log('File downloaded and saved to:', filePath);
      } catch (error) {
        console.error('Error downloading the file:', error);
      }
    });

  });
  await browser.close();
};