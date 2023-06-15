const path = require('path')
const os = require('os')
const fs = require('fs')
const resizeImg = require('resize-img')
const { app, BrowserWindow, Menu, ipcMain, shell } = require('electron')
const isMac = process.platform === 'darwin'
let mainWindow = null

function createMainWindow() {
    mainWindow = new BrowserWindow({
        title: 'Yukino Image Resizer',
        width: 600,
        height: 600,
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: true,
            preload: path.join(__dirname, 'preload.js')
        }
    })
    mainWindow.loadFile(path.join(__dirname, 'renderer/index.html'))
    // mainWindow.webContents.openDevTools()
}

function creatAboutWindow() {
    const aboutWindow = new BrowserWindow({
        title: 'About Yukino Image Resizer',
        width: 300,
        height: 300,
        icon: `${__dirname}/assets/icons/Icon_256x256.png`,
    })
    aboutWindow.loadFile(path.join(__dirname, 'renderer/about.html'))
}

app.whenReady().then(() => {
    createMainWindow()
    const mainMenu = Menu.buildFromTemplate(menu)
    Menu.setApplicationMenu(mainMenu)
    mainWindow.on('close', () => mainWindow = null)
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

// Respond to ipcRenderer resize
ipcMain.on('image:resize', (e, options) => {
    options.destination = path.join(os.homedir(), 'yukino-image-resizer')
    resizeImage(options)
})

async function resizeImage({ imagePath, width, height, destination }) {
    try {
        const resizedPath = await resizeImg(fs.readFileSync(imagePath), {
            width: +width,
            height: +height
        })
        const filename = path.basename(imagePath)
        if (!fs.existsSync(destination)) fs.mkdirSync(destination)
        fs.writeFileSync(path.join(destination, filename), resizedPath)
        mainWindow.webContents.send('image:done')
        shell.openPath(destination)
    } catch (error) { console.log(error) }
}

app.on('window-all-closed', () => {
    if (!isMac) app.quit()
})