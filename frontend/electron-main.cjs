const { app, BrowserWindow } = require('electron')
const path = require('path')
const isDev = require('electron-is-dev')

function createWindow(){
  const win = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: { nodeIntegration: false, contextIsolation: true }
  })
  if (isDev) {
    win.loadURL('http://localhost:5173')
  } else {
    win.loadFile(path.join(process.cwd(), 'dist', 'index.html'))
  }
}

app.whenReady().then(createWindow)
app.on('window-all-closed', ()=>{ if (process.platform !== 'darwin') app.quit() })
