import { ipcMain } from 'electron';
import fs from 'node:fs';
import { getRootPath } from '../common.js';

ipcMain.handle('get-posts', async (event) => {
  const path = getRootPath();

  // get all posts from categories
  const categories = fs.readdirSync(`${path}/categories`);
  const data = categories.reduce((acc, category) => {
    const posts = fs.readFileSync(`${path}/categories/${category}/posts.json`, 'utf8');
    return acc.concat(JSON.parse(posts));
  }, []);

  return data;
});

export {
  previewPosts,
};