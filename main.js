const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

let mainWindow;
let isOnline;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 900,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  const startUrl = process.env.ELECTRON_START_URL || `file://${path.join(__dirname, 'build', 'index.html')}`;

  if (process.env.ELECTRON_START_URL) {
    // En desarrollo, cargar la URL del servidor de React
    mainWindow.loadURL(process.env.ELECTRON_START_URL);
  } else {
    // En producción, cargar el archivo index.html del build generado
    mainWindow.loadURL(startUrl);
  }

  mainWindow.webContents.openDevTools(); // Solo en desarrollo
}

// Función para cargar dinámicamente is-online y electron-store
async function loadModules() {
  const isOnlineModule = await import("is-online");
  isOnline = isOnlineModule.default;
}

// Verificar conexión a internet
async function checkOnlineStatus() {
  const onlineStatus = await isOnline();
  console.log(onlineStatus ? "Conexión a internet disponible" : "No hay conexión a internet");
}

app.whenReady().then(async () => {
  await loadModules();
  await checkOnlineStatus();

  await checkOnlineStatus();

  // Crea la ventana principal
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });

  // Cargar electron-store dinámicamente
  const StoreModule = await import("electron-store");
  const store = new StoreModule.default();

  ipcMain.on("save-token", (event, token) => {
    store.set("token", token);
    console.log("Token guardado:", token);
  });

  ipcMain.on("save-data", (event, data) => {
    store.set("data", data);
    console.log("Datos guardados:", data);
  });

  ipcMain.on("get-token", (event) => {
    const token = store.get("token");
    event.sender.send("token-data", token);
  });

  ipcMain.on("get-data", (event) => {
    const data = store.get("data");
    event.sender.send("data-complete", data);
  });
});

// Cerrar la aplicación cuando todas las ventanas estén cerradas, excepto en macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

