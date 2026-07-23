const { app, BrowserWindow } = require("electron");

function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    backgroundColor: "#020617",
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  win.loadFile("index.html");

  // Debug (keep for now)
  win.webContents.openDevTools();
}

app.whenReady().then(createWindow);
