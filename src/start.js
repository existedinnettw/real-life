const electron = require('electron')
const app = electron.app
const path = require('path')
const fs = require('fs')
const isDev = require('electron-is-dev')
require('electron-reload')
const BrowserWindow = electron.BrowserWindow

let mainWindow

function createWindow() {
  //https://www.electronjs.org/docs/api/browser-window
  mainWindow = new BrowserWindow({
    width: 800,
    minWidth:200,
    height: 600,
    minHeight: 50,
    //alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: true,
    },
  })

  mainWindow.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`,
  )

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  //mainWindow.setAlwaysOnTop(true, 'screen');
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
