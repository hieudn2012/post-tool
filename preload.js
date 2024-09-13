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
  importPosts: (category) => ipcRenderer.invoke('import-posts', category),
  importImages: (category) => ipcRenderer.invoke('import-images', category),
  previewPosts: (folderPath) => ipcRenderer.invoke('preview-posts', folderPath),
  loadDefault: () => ipcRenderer.invoke('load-default'),
  clearHistories: (account) => ipcRenderer.invoke('clear-histories', account),
  loadCategories: () => ipcRenderer.invoke('load-categories'),
  addCategory: (category) => ipcRenderer.invoke('add-category', category),
  openModal: () => ipcRenderer.invoke('open-modal'),
  loadPostsByCategory: () => ipcRenderer.invoke('load-posts-by-category'),
  saveAccountConfig: (account) => ipcRenderer.invoke('save-account-config', account),
  getDefaultCategory: (account) => ipcRenderer.invoke('get-default-category', account),
  getAccountConfig: (account) => ipcRenderer.invoke('get-account-config', account),
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
