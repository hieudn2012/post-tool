import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { shell } from 'electron';

export const copyRandomCaption = (event) => {
  const captions = [
    `🌸 Just a small girl with a big dream and an even bigger smile.`,
    `✨ Sweet as honey, cute as a bunny.`,
    `🦋 Smiles are contagious, so here’s one for you!`,
    `🍑 Sugar, spice, and everything nice—that’s me!`,
    `🔥 Not perfect, but always myself.`,
    `🌟 Beauty begins the moment you decide to be yourself.`,
    `💎 Shine like the whole universe is yours.`,
    `🌈 No filter, just vibes.`,
    `💕 You must be tired because you’ve been running through my mind all day.`,
    `😘 Too glam to give a damn.`,
  ];
  
  const randomCaption = captions[Math.floor(Math.random() * captions.length)];
  execSync(`echo "${randomCaption}" | pbcopy`);
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

export const assignRandomIdToPost = (url, event) => {
  const postId = Math.random().toString(36).substring(2, 22);
  const newUrl = `${url}/?${postId}`;
  // copy to clipboard
  execSync(`echo "${newUrl}" | pbcopy`);
  sendEvent({ event, action: "action-result", eventMessage: newUrl });
};

export const sendEvent = ({ event, action = "action-result", ...props }) => {
  return event.sender.send(action, { ...props });
}
