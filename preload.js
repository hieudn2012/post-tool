const { contextBridge, ipcRenderer } = require('electron');

// Expose a limited API to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  getProfiles: () => ipcRenderer.invoke('get-profiles'),
  run: (userId) => ipcRenderer.invoke('run', userId),
  openRandomFolder: (path) => ipcRenderer.invoke('open-random-folder', path),
  copyRandomCaption: () => ipcRenderer.invoke('copy-random-caption'),
  createEmptyFolder: (path) => ipcRenderer.invoke('create-empty-folder', path),
  deleteEmptyFolder: (path) => ipcRenderer.invoke('delete-empty-folder', path),
  openEmptyFolder: (path) => ipcRenderer.invoke('open-empty-folder', path),
  assignRandomIdToPost: (url) => ipcRenderer.invoke('assign-random-id-to-post', url),
  onActionResult: (callback) => ipcRenderer.on('action-result', (event, result) => callback(result)),
  crawlData: () => ipcRenderer.invoke('crawl-data'),
  openWorkingFolder: () => ipcRenderer.invoke('change-working-folder'),
  saveConfig: (config) => ipcRenderer.invoke('save-config', config),
  loadConfig: () => ipcRenderer.invoke('load-config'),
  changeFolderSaveFiles: () => ipcRenderer.invoke('change-folder-save-files'),
});

window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }
})
