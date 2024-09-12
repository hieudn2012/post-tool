const { dialog } = require('electron');
const fs = require('fs');
const { getRootPath } = require('./common');

const importPosts = async (category) => {
  const folderPath = getRootPath();
  const { filePaths } = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [
      { name: 'Text', extensions: ['txt'] },
    ],
  });
  const path = filePaths[0];

  if (!path) {
    throw new Error('No file selected');
  }

  const content = fs.readFileSync(path, 'utf8');
  const lines = content.split('\n');

  const posts = lines.map((line, index) => {
    const [title, url] = line.split('|');
    return {
      id: index + 1,
      postId: `${category}-${index + 1}`,
      title: title.trim(),
      url: url.trim(),
      category,
    };
  });

  // write to posts.json
  const postPath = `${folderPath}/categories/${category}/posts.json`;
  // write new accounts
  fs.writeFileSync(postPath, JSON.stringify(posts, null, 2));
};

const importImages = async (category) => {
  const folderPath = getRootPath();
  // open dialog to select folder
  const { filePaths } = await dialog.showOpenDialog({
    properties: ['openDirectory'],
  });
  const path = filePaths[0];

  if (!path) {
    throw new Error('No folder selected');
  }
 
  // copy images to category folder
  const imagesPath = `${folderPath}/categories/${category}/images`;
  fs.mkdirSync(imagesPath, { recursive: true });
  fs.readdirSync(path).forEach(file => {
    // only png files png, jpg, jpeg, gif, webp, svg
    if (file.match(/\.(png|jpg|jpeg|gif|webp|svg)$/)) {
      fs.copyFileSync(`${path}/${file}`, `${imagesPath}/${file}`);
    }
  });
};

module.exports = {
  importPosts,
  importImages,
}