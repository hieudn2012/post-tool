import fs from 'node:fs';
import { getAllCategories, getRootPath } from './common.js';

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
    isValid: posts[category].length === images[category].length,
  }));
};

export {
  loadPostsByCategory,
}