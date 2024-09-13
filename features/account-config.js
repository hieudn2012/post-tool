import fs from 'node:fs';
import { getAllCategories, getRootPath } from './common.js';

function saveAccountConfig(account) {
  const path = getRootPath();
  const category = account.category;
  const timePost = account.timePost;

  // check file exists in path/configs/account.accont.json if not create it
  if (!fs.existsSync(`${path}/configs/${account.account}.json`)) {
    fs.writeFileSync(`${path}/configs/${account.account}.json`, JSON.stringify({
      category,
    }));
    return;
  }

  const data = fs.readFileSync(`${path}/configs/${account.account}.json`, 'utf8');
  const config = JSON.parse(data);
  config.category = category || config.category;
  config.timePost = typeof timePost === 'number' ? timePost : config.timePost;

  fs.writeFileSync(`${path}/configs/${account.account}.json`, JSON.stringify(config));
}

const loadPostsByCategory = async () => {
  const path = getRootPath();

  // get all categories name
  const categories = getAllCategories();

  // get all posts by category
  const posts = {};
  for (const category of categories) {
    const postsPath = `${path}/categories/${category}/posts.json`;
    const data = fs.readFileSync(postsPath, 'utf8');
    posts[category] = JSON.parse(data);
  }

  // get all images name in folder path/categories/category/images
  const images = {};
  for (const category of categories) {
    const imagesPath = `${path}/categories/${category}/images`;
    if (fs.existsSync(imagesPath)) {
      images[category] = fs.readdirSync(imagesPath);
    }
  }

  return categories.map(category => ({
    category,
    posts: posts[category].length,
    images: images[category].length,
    isValid: posts[category].length === images[category].length && posts[category].length > 0,
  }));
};


const getAccountConfig = (account) => {
  const path = getRootPath();
  const data = fs.readFileSync(`${path}/configs/${account.account}.json`, 'utf8');
  return JSON.parse(data);
};

export {
  saveAccountConfig,
  loadPostsByCategory,
  getAccountConfig,
};