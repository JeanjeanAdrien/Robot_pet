/* =====================
* preload.js (bridge main <-> renderer)
* ===================== */
/* =====================
* preload.js (bridge main <-> renderer)
* ===================== */


// Create this file as preload.js
const { contextBridge, ipcRenderer } = require('electron');


contextBridge.exposeInMainWorld('petAPI', {
    onEnvUpdate: (cb) => {
        ipcRenderer.on('env-update', (_event, data) => cb(data));
    },
    setIgnoreMouseEvents: (ignore, options) => {
        ipcRenderer.send('set-ignore-mouse-events', ignore, options);
    }
});