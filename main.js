const { app, BrowserWindow, ipcMain, Tray, Menu } = require("electron");

let win;
let tray = null;
let store;

/* =========================
   SINGLE INSTANCE LOCK
========================= */
const gotLock = app.requestSingleInstanceLock();

if (!gotLock) {
  app.quit();
} else {
  app.on("second-instance", () => {
    if (win) {
      if (win.isMinimized()) win.restore();
      win.show();
      win.focus();
    }
  });
}

/* =========================
   CREATE WINDOW
========================= */
async function createWindow() {

  const Store = (await import("electron-store")).default;
  store = new Store();

  const savedBounds = store.get("windowBounds");

  win = new BrowserWindow({
    width: savedBounds?.width || 300,
    height: savedBounds?.height || 460,
    x: savedBounds?.x,
    y: savedBounds?.y,

    minWidth: 280,
    minHeight: 230,

    frame: false,
    alwaysOnTop: true,
    transparent: true,
    resizable: true,

    show: false,

    skipTaskbar: true,

    icon: require("path").join(__dirname, "icon10.ico"),

    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.loadFile("index.html");

  win.once("ready-to-show", () => {
    win.show();
  });

  const saveBounds = () => {
    store.set("windowBounds", win.getBounds());
  };

  win.on("resize", saveBounds);
  win.on("move", saveBounds);

  win.on("close", (e) => {
    if (!app.isQuiting) {
      e.preventDefault();
      win.hide();
    }
    saveBounds();
  });

  win.on("minimize", (e) => {
    e.preventDefault();
    win.hide();
  });
}

/* =========================
   MINIMIZE FROM UI BUTTON
========================= */
ipcMain.on("minimize-window", () => {
  if (win) win.hide();
});

/* =========================
   APP START
========================= */
app.whenReady().then(async () => {

  const Store = (await import("electron-store")).default;
  store = new Store();

  /* =========================
     ⭐ AUTO START DEFAULT TRUE (FIRST TIME ONLY)
  ========================= */
  let autoStart = store.get("autoStart");

  if (autoStart === undefined) {
    autoStart = true; // FIRST TIME DEFAULT ON
    store.set("autoStart", true);
  }

  function setAutoStart(value) {
    autoStart = value;

    store.set("autoStart", value);

    app.setLoginItemSettings({
      openAtLogin: value,
      path: process.execPath,
      args: [],
    });
  }

  // apply saved state on startup
  app.setLoginItemSettings({
    openAtLogin: autoStart,
    path: process.execPath,
    args: [],
  });

  createWindow();

  /* =========================
     SYSTEM TRAY
  ========================= */
  const path = require("path");

  tray = new Tray(path.join(__dirname, "icon10.ico"));

  function buildMenu() {
    return Menu.buildFromTemplate([
      {
        label: "Show",
        click: () => win.show(),
      },
      {
        label: "Hide",
        click: () => win.hide(),
      },

      {
        type: "separator",
      },

      // ⭐ START WITH WINDOWS TOGGLE
      {
        label: "Start with Windows",
        type: "checkbox",
        checked: autoStart,
        click: (item) => {
          setAutoStart(item.checked);
        },
      },

      {
        type: "separator",
      },

      {
        label: "Uninstall Clock",
        click: () => {
          app.isQuiting = true;
          app.quit();
        },
      },
    ]);
  }

  tray.setToolTip("JbTrader Clock");
  tray.setContextMenu(buildMenu());

  tray.on("click", () => {
    if (win.isVisible()) {
      win.hide();
    } else {
      win.show();
    }
  });
});

/* =========================
   SAFE EXIT
========================= */
app.on("before-quit", () => {
  app.isQuiting = true;
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});



app.on("browser-window-created", (_, window) => {
  window.webContents.on("context-menu", (e, params) => {
    const menu = Menu.buildFromTemplate([
      {
        label: "Copy",
        role: "copy"
      },
      {
        type: "separator"
      },
      {
        label: "Select All",
        role: "selectAll"
      }
    ]);

    menu.popup();
  });
});