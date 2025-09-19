const { contextBridge, ipcRenderer } = require('electron');

// Definiert eine sichere Schnittstelle für die UI,
// um mit dem Backend (main.js) zu kommunizieren.
contextBridge.exposeInMainWorld('electronAPI', {
    openImageDialog: () => ipcRenderer.invoke('dialog:openImageDirectory'),
    openOutputDialog: () => ipcRenderer.invoke('dialog:openOutputDirectory'),
    startProcessing: (options) => ipcRenderer.send('start-processing', options),
    onUpdateProgress: (callback) => ipcRenderer.on('update-progress', (_event, value) => callback(value)),
    onProcessingDone: (callback) => ipcRenderer.on('processing-done', (_event, message) => callback(message)),
    onProcessingError: (callback) => ipcRenderer.on('processing-error', (_event, message) => callback(message)),
});