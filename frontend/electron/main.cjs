const { app, BrowserWindow, ipcMain, shell } = require('electron')
const path = require('node:path')

const isDev = process.env.NODE_ENV === 'development'
const PROD_URL = process.env.ELECTRON_APP_URL || 'https://flowmeet.kr'

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  win.loadURL(isDev ? 'http://localhost:3000' : PROD_URL)

  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })
}

app.whenReady().then(() => {
  ipcMain.handle('app:getVersion', () => app.getVersion())

  createWindow()
})