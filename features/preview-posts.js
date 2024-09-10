const fs = require('fs');

const previewPosts = (folderPath) => {
  // get post from folderPath on posts.json
  const postPath = `${folderPath}/posts.json`;
  const postString = fs.readFileSync(postPath, 'utf8');
  const posts = JSON.parse(postString);
  return posts;
}

module.exports = {
  previewPosts,
};