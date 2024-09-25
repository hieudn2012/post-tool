import { dialog } from 'electron'
import store from '../store.js';
import fs from 'node:fs';
import request from './request.js';

export const importContents = async () => {
  const token = store.get('token');
  const { filePaths } = await dialog.showOpenDialog({
    properties: ['openDirectory']
  });
  const folderPath = filePaths[0];
  if (!folderPath) return;

  const category = folderPath.split('/').pop();
  const images = fs.readdirSync(`${folderPath}/images`);
  const contentsFile = fs.readFileSync(`${folderPath}/contents.txt`, 'utf8').trim().split('\n');

  const { data } = await request.post('/categories', { category });
  const categoryId = data._id;

  const contents = contentsFile.map(content => {
    const [title, link] = content.split('|');
    return { title, link, category: categoryId };
  });

  const { data: posts } = await request.post('/contents/bulk', contents);

  // get images name from the folder images
  const imageNames = images.map(image => {
    const [name] = image.split('.');
    // if Numner(name) is NaN, return name
    return isNaN(Number(name)) ? name : Number(name);
  });
  // sort the images name
  imageNames.sort();

  // change image name to postId
  posts.forEach((post, index) => {
    // change image name to postId
    const from = `${folderPath}/images/${imageNames[index]}.png`;
    const to = `${folderPath}/images/${post._id}.png`;
    fs.renameSync(from, to);
  });
}