const { contextBridge, ipcRenderer } = require('electron');

// Expose a limited API to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  onActionResult: (callback) => ipcRenderer.on('action-result', (event, result) => callback(result)),
  adminLogin: (account) => ipcRenderer.invoke('admin-login', account),
  listenAction: (data) => ipcRenderer.invoke('listen-action', data),
  getRunners: (token) => ipcRenderer.invoke('get-runners', token),
  test: (runner) => ipcRenderer.invoke('test', runner),
  saveCookies: (runner) => ipcRenderer.invoke('save-cookies', runner),
  stop: (runner) => ipcRenderer.invoke('stop', runner),
  getQRCode: (runner) => ipcRenderer.invoke('get-qr-code', runner),
  clearHistory: (runner) => ipcRenderer.invoke('clear-history', runner),
  instagramLogin: (runner) => ipcRenderer.invoke('instagram-login', runner),
  run: (runner) => ipcRenderer.invoke('run', runner),
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
