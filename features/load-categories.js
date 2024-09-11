const fs = require('fs');
const { getRootPath } = require('./common');

function loadCategories() {
  const path = getRootPath();
  const categories = fs.readdirSync(`${path}/categories`);
  return {
    categories,
  };
}

module.exports = {
  loadCategories,
};