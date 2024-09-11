const fs = require('fs');

function createFolder(folderPath) {
  if (!fs.existsSync(`${folderPath}/cookies`)) {
    fs.mkdirSync(`${folderPath}/cookies`);
  }
  if (!fs.existsSync(`${folderPath}/user-agent`)) {
    fs.mkdirSync(`${folderPath}/user-agent`);
  }
  if (!fs.existsSync(`${folderPath}/history`)) {
    fs.mkdirSync(`${folderPath}/history`);
  }
  if (!fs.existsSync(`${folderPath}/logger.txt`)) {
    fs.writeFileSync(`${folderPath}/logger.txt`, '');
  }
  if (!fs.existsSync(`${folderPath}/user-agent.txt`)) {
    fs.writeFileSync(`${folderPath}/user-agent.txt`, '');
  }
  if (!fs.existsSync(`${folderPath}/accounts.json`)) {
    fs.writeFileSync(`${folderPath}/accounts.json`, "[]");
  }
  if (!fs.existsSync(`${folderPath}/images`)) {
    fs.mkdirSync(`${folderPath}/images`);
  }
  if (!fs.existsSync(`${folderPath}/posts.json`)) {
    fs.writeFileSync(`${folderPath}/posts.json`, "[]");
  }

  // Save folderPath to config.txt
  fs.writeFileSync(`config.txt`, folderPath);
}

module.exports = {
  createFolder,
};
