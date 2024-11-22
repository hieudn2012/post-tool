import { shell } from 'electron';
import fs from 'node:fs';

export const openRandomFolder = (path) => {
  // get child folders
  // filler without hidden folders
  const childFolders = fs.readdirSync(path).filter((folder) => !folder.startsWith('.'));

  // get random
  const randomFolder = childFolders[Math.floor(Math.random() * childFolders.length)];

  // open folder with window size = 1600x860
  shell.openPath(`${path}/${randomFolder}`);
};