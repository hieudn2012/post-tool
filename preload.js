const { contextBridge, ipcRenderer } = require('electron');

// Expose a limited API to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  getAccounts: () => ipcRenderer.invoke('get-accounts'),
  adminLogin: (data) => ipcRenderer.invoke('admin-login', data),
  run: (account) => ipcRenderer.invoke('run', account),
  runAll: (accounts) => ipcRenderer.invoke('run-all', accounts),
  stop: (account) => ipcRenderer.invoke('stop', account),
  onActionResult: (callback) => ipcRenderer.on('action-result', (event, result) => callback(result)),

  // get images in root
  getImages: () => ipcRenderer.invoke('get-images'), 
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
