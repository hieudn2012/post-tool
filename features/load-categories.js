import fs from 'node:fs';
import { getRootPath } from './common.js';

function loadCategories() {
  const path = getRootPath();
  const categories = fs.readdirSync(`${path}/categories`);
  return {
    categories,
  };
}

export {
  loadCategories,
};