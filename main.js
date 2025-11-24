// Create this file as main.js
const { app, BrowserWindow, ipcMain, screen } = require('electron');
const path = require('path');


let petWindow;


function createPetWindow() {
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;

    petWindow = new BrowserWindow({
        width: width,
        height: height,
        x: 0,
        y: 0,
        frame: false,
        transparent: true,
        alwaysOnTop: true,
        resizable: false,
        hasShadow: false,
        skipTaskbar: true, // Hide from taskbar
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false
        }
    });


    petWindow.setIgnoreMouseEvents(true, { forward: true }); // Default to click-through
    petWindow.loadFile('index.html');


    petWindow.on('closed', () => {
        petWindow = null;
    });
}


app.whenReady().then(() => {
    createPetWindow();


    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createPetWindow();
    });
});


app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

// IPC for click-through
ipcMain.on('set-ignore-mouse-events', (event, ignore, options) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    win.setIgnoreMouseEvents(ignore, options);
});


// Exemple très simple d'"événements d'environnement" (heure locale)
setInterval(() => {
    if (!petWindow) return;
    const hour = new Date().getHours();
    let envState = 'day';
    if (hour >= 22 || hour < 6) envState = 'night';
    else if (hour >= 18) envState = 'evening';


    petWindow.webContents.send('env-update', { hour, envState });
}, 10000);