const path = require('path')
const { app, BrowserWindow, Menu } = require('electron')
const isDev = process.env.NODE_ENV !== 'development'
const isMac = process.platform === 'darwin'

function createMainWindow() {
    const mainWindow = new BrowserWindow({
        title: 'Yukino Image Resizer',
        width: isDev ? 1000 : 500,
        height: 600
    })
    mainWindow.loadFile(path.join(__dirname, 'renderer/index.html'))
    if (isDev) mainWindow.webContents.openDevTools()
}

function creatAboutWindow() {
    const aboutWindow = new BrowserWindow({
        title: 'About Yukino Image Resizer',
        width: 300,
        height: 300
    })
    aboutWindow.loadFile(path.join(__dirname, 'renderer/about.html'))
}

app.whenReady().then(() => {
    createMainWindow()
    const mainMenu = Menu.buildFromTemplate(menu)
    Menu.setApplicationMenu(mainMenu)
    app.on('activate', () => {
        if (!BrowserWindow.getAllWindows().length === 0) createMainWindow()
    })
})

const menu = [
    ...(isMac ? [{
        label: app.name,
        submenu: [{
            label: 'About',
            click: creatAboutWindow
        }]
    }] : [{
        label: 'Help',
        submenu: [{
            lable: 'About',
            click: creatAboutWindow
        }]
    }]),
    { role: 'fileMenu' },
]

app.on('window-all-closed', () => {
    if (!isMac) app.quit()
})