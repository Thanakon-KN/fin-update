const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('finApp', {
  getSession: () => ipcRenderer.invoke('auth:session'),
  signIn: () => ipcRenderer.invoke('auth:signin'),
  signOut: () => ipcRenderer.invoke('auth:signout'),
  getModels: () => ipcRenderer.invoke('ai:models'),
  update: (payload) => ipcRenderer.invoke('financial-highlights:update', payload)
});
