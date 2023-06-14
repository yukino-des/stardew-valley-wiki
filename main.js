const path = require('path')
const { app, BrowserWindow } = require('electron')
const isDev = process.env.NODE_ENV !== 'development'

function createMainWindow() {
    const mainWindow = new BrowserWindow({
        title: 'Yukino Image Resizer',
        width: isDev ? 1000 : 500,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })
    mainWindow.loadFile(path.join(__dirname, 'renderer/index.html'))
    // open devtools
    if (isDev) mainWindow.webContents.openDevTools()
}

app.whenReady().then(() => {
    createMainWindow()

    app.on('activate', () => {
        if (!BrowserWindow.getAllWindows().length === 0) createMainWindow()
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})