const electron = require('electron')
const path = require('path')
const url = require('url')
const app = electron.app
const BrowserWindow = electron.BrowserWindow

require('electron-debug')({showDevTools: false});

let mainWindow

function createWindow() {
    mainWindow = new BrowserWindow({
        'minWidth': 200,
        'minHeight': 300,
        width: 400,
        height: 600,
        transparent: true,
        frame: false,
        title:'LobsTTER',
        'icon':'./logo/1x/logo_color_white.png.ico'
    })
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }))

    mainWindow.on('closed', () => {
        mainWindow = null
    })
}

app.on('ready', () => {
    createWindow();
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('browser-window-created', (e, window) => {
    window.setMenu(null);
    window.setResizable(true)
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow()
    }
});
