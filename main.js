const { app, BrowserWindow } = require("electron");

function createWindow () {
  const win = new BrowserWindow({
    width: 400,
    height: 600,
    frame: false,
    alwaysOnTop: true,
    transparent: true,
    resizable: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  win.loadFile("index.html");
}

app.whenReady().then(() => {

  // ✅ AUTO START FIX (WORKING)
  app.setLoginItemSettings({
    openAtLogin: true,
    path: process.execPath,
    args: []
  });

  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});