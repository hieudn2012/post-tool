const { contextBridge, ipcRenderer } = require('electron');

// Expose a limited API to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  getPosts: () => ipcRenderer.invoke('get-posts'),
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