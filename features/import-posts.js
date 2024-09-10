const { dialog } = require('electron');
const fs = require('fs');

const importPosts = async (folderPath) => {
  const { filePaths } = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [
      { name: 'Text', extensions: ['txt'] },
    ],
  });
  const path = filePaths[0];

  if (!path) {
    return;
  }

  const content = fs.readFileSync(path, 'utf8');
  const lines = content.split('\n');

  const posts = lines.map((line, index) => {
    const [title, url] = line.split('|');
    return {
      id: index + 1,
      title: title.trim(),
      url: url.trim(),
    };
  });

  // write to posts.json
  const postPath = `${folderPath}/posts.json`;
  // clear file
  fs.writeFileSync(postPath, '[]');
  // write new accounts
  fs.writeFileSync(postPath, JSON.stringify(posts, null, 2));
};

module.exports = {
  importPosts,
}