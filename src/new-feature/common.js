import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { shell, dialog, app } from 'electron';
import clipboard from 'clipboardy';

export const copyRandomCaption = (event) => {
  const captions = getConfig().captions.trim().split('\n');
  const randomCaption = captions[Math.floor(Math.random() * captions.length)];
  clipboard.writeSync(randomCaption);
  sendEvent({ event, action: "action-result", eventMessage: randomCaption });
};

export const createEmptyFolder = (path) => {
  // random folder name 20 characters long
  const folderName = Math.random().toString(36).substring(2, 22);
  const folderPath = `${path}/${folderName}`;
  fs.mkdirSync(folderPath);
};

export const deleteEmptyFolder = (path) => {
  const folders = fs.readdirSync(path).filter((folder) => !folder.startsWith('.'));
  // delete all empty folders
  folders.forEach((folder) => {
    const folderPath = `${path}/${folder}`;
    try {
      fs.rmdirSync(folderPath);
    } catch (error) {
      console.error(error);
    }
  });
};

export const openEmptyFolder = (dirPath) => {
  const folders = fs.readdirSync(dirPath, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => path.join(dirPath, dirent.name));

  const emptyFolders = [];

  folders.forEach(folder => {
    const filesInFolder = fs.readdirSync(folder);
    if (filesInFolder.length === 0) {
      emptyFolders.push(folder);
    }
  });

  // open first empty folder
  if (emptyFolders.length > 0) {
    shell.openPath(emptyFolders[0]);
  }
};

export const assignRandomIdToPost = ({ url, total }, event) => {

  const urls = [];
  for (let i = 0; i < total; i++) {
    const postId = Math.random().toString(36).substring(2, 22);
    urls.push(`${url}/?${postId}`);
  }
  const newUrl = urls.join('\n');

  // copy to clipboard
  clipboard.writeSync(newUrl);
  sendEvent({ event, action: "action-result", eventMessage: `Đã tạo ${total} links` });
};

export const sendEvent = ({ event, action = "action-result", ...props }) => {
  return event.sender.send(action, { ...props });
}

export const changeWorkingFolder = async (variable, event) => {
  const folderPath = dialog.showOpenDialogSync({
    properties: ['openDirectory'],
  });
  const config = getConfig();
  saveConfig({ ...config, [variable]: folderPath }, event);
  loadConfig(event);
};

export const getRandomComment = (links, event) => {
  const commentTemplate = `${getConfig().commentTemplate}`;
  
  const list = links.split('\n');
  const firstLink = list[0];
  const newLinks = list.slice(1).join('\n');

  const comment = commentTemplate.replace(`{{value}}`, firstLink);
  clipboard.writeSync(comment);
  sendEvent({ event, action: "action-result", eventMessage: comment, type: 'CHANGE_LINKS', links: newLinks });
};

export const loadConfig = (event) => {
  const configDir = app.getPath('userData');
  const configFile = path.join(configDir, 'config.json');

  if (!fs.existsSync(configFile)) {
    fs.writeFileSync(configFile, JSON.stringify({
      workingFolder: '',
      commentFolder: '',
      postLink: '',
      threads: '',
      saveFolder: '',
      commentTemplate: '',
      links: '',
      captions: '',
    }));
  } else {
    const config = fs.readFileSync(configFile, 'utf-8');
    const parsedConfig = JSON.parse(config);
    sendEvent({ event, action: "action-result", eventMessage: 'Loaded', ...parsedConfig, type: 'LOAD_CONFIG' });
  }
};

export const saveConfig = (config, event) => {
  const configDir = app.getPath('userData');
  const configFile = path.join(configDir, 'config.json');
  fs.writeFileSync(configFile, JSON.stringify(config));
  sendEvent({ event, action: "action-result", eventMessage: 'Đã lưu' });
};

export const getConfig = () => {
  const configDir = app.getPath('userData');
  const configFile = path.join(configDir, 'config.json');
  const config = fs.readFileSync(configFile, 'utf-8');
  return JSON.parse(config);
};
