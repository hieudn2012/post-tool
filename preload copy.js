const { contextBridge, ipcRenderer } = require('electron');

// Expose a limited API to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  getAccounts: (status) => ipcRenderer.invoke('get-accounts', status),
  adminLogin: (data) => ipcRenderer.invoke('admin-login', data),
  run: (account) => ipcRenderer.invoke('run', account),
  stop: (account) => ipcRenderer.invoke('stop', account),
  onActionResult: (callback) => ipcRenderer.on('action-result', (event, result) => callback(result)),
  relaunch: () => ipcRenderer.invoke('relaunch'),
  openNewPage: (account) => ipcRenderer.invoke('open-new-page', account),
  threadsLogin: (account) => ipcRenderer.invoke('threads-login', account),
  saveCookies: (account) => ipcRenderer.invoke('save-cookies', account),
  getStatuses: () => ipcRenderer.invoke('get-statuses'),
  instagramLogin: (account) => ipcRenderer.invoke('instagram-login', account),
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
