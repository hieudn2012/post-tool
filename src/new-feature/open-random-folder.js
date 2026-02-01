import { shell } from 'electron';
import fs from 'node:fs';
import { addTxtHistory, getTxtHistory, sendEvent } from './common.js';

export const openRandomFolder = async (parentPath, event) => {
  const history = getTxtHistory();
  // get child folders
  // filler without hidden folders
  const childFolders = fs.readdirSync(parentPath).filter((folder) => {
    return !folder.startsWith('.') && !history.includes(`${parentPath}/${folder}`)
  });

  // get random
  const randomFolder = childFolders[Math.floor(Math.random() * childFolders.length)];

  if (!randomFolder) {
    return;
  }

  if (childFolders.length > 0) {
    sendEvent({
      event,
      action: "action-result",
      eventMessage: `Tổng folder còn lại: ${childFolders.length - 1}`,
      type: 'TOTAL_FOLDER_NOT_YET_OPEN'
    });
  }

  const finalPath = `${parentPath}/${randomFolder}`;

  // add to history
  addTxtHistory(finalPath);

  shell.openPath(finalPath);
};
