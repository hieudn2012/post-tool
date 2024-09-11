const fs = require('fs');
const { getRootPath } = require('./common');

function addCategory(category) {
  const path = getRootPath();


  // Create root folder if not exists
  if (!fs.existsSync(`${path}/categories`)) {
    fs.mkdirSync(`${path}/categories`);
  }

  // Create category folder
  fs.mkdirSync(`${path}/categories/${category}`);

  fs.writeFileSync(`${path}/categories/${category}/posts.json`, '[]');
  fs.mkdirSync(`${path}/categories/${category}/images`);
};

module.exports = {
  addCategory
};