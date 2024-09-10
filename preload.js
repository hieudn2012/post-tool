const { contextBridge, ipcRenderer } = require('electron');

// Expose a limited API to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  login: (account) => ipcRenderer.invoke('login', account),
  test: (account) => ipcRenderer.invoke('test', account),
  setup: (account) => ipcRenderer.invoke('setup', account),
  run: (account) => ipcRenderer.invoke('run', account),
  stop: (account) => ipcRenderer.invoke('stop', account),
  loadAccount: (account) => ipcRenderer.invoke('load-account', account),
  saveCookies: (account) => ipcRenderer.invoke('save-cookies', account),
  updateStatus: (account) => ipcRenderer.invoke('update-status', account),
  onActionResult: (callback) => ipcRenderer.on('action-result', (event, result) => callback(result)),
  selectFolder: () => ipcRenderer.invoke('select-folder'),
  importAccounts: () => ipcRenderer.invoke('import-accounts'),
  importPosts: () => ipcRenderer.invoke('import-posts'),
  previewPosts: (folderPath) => ipcRenderer.invoke('preview-posts', folderPath),
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