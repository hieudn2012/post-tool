import { shell } from 'electron';
import moment from 'moment';
import fs from 'node:fs';

export const openRandomFolder = async (parentPath, event) => {
  // get child folders
  // filler without hidden folders
  const childFolders = fs.readdirSync(parentPath).filter((folder) => {
    return !folder.startsWith('.') && !folder.includes('--')
  });

  // get random
  const randomFolder = childFolders[Math.floor(Math.random() * childFolders.length)];
  const finalPath = `${parentPath}/${randomFolder}`;

  // rename folder with new name = finalPath - new Date()
  const currentDate = moment().format('MMMM Do YYYY, h-mm-ss a');
  const renamed = `${finalPath} -- ${currentDate}`;
  fs.renameSync(finalPath, renamed);
  shell.openPath(renamed);
};
