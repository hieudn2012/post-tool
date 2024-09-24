import fs from 'node:fs';
import request from '../utils/request.js';

export const getImages = async () => {
  const path = `/Users/admin/Downloads/US CelebHunter oscar test/images`;


  const images = fs.readdirSync(path);
  const imagesName = images.map((image) => image.split('.')[0]);

  await request.post(`/users/add-note`, { note: JSON.stringify(imagesName) });
}