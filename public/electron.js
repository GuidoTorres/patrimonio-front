const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const expressApp = require("./server");

let mainWindow;
let isOnline; // Definir isOnline globalmente

// Función para crear la ventana de la aplicación
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  const startURL =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000" // En desarrollo, cargamos desde localhost
      : `file://${path.join(__dirname, "build", "index.html")}`; // En producción, cargamos desde la carpeta build

  mainWindow.loadURL(startURL);
  mainWindow.webContents.openDevTools(); // Abrir DevTools para depuración
}

// Función para cargar dinámicamente is-online y electron-store
async function loadModules() {
  // Cargar el módulo is-online dinámicamente
  const isOnlineModule = await import("is-online");
  isOnline = isOnlineModule.default;
}

// Verificar conexión a internet
async function checkOnlineStatus() {
  const onlineStatus = await isOnline();
  if (onlineStatus) {
    console.log("Conexión a internet disponible");
  } else {
    console.log("No hay conexión a internet");
  }
}

app.whenReady().then(async () => {
  // No es necesario usar spawn, ya que el servidor se inicia directamente en 'server/index.js'
  await loadModules();
  await checkOnlineStatus(); // Verificar la conexión a internet

  // Crear la ventana principal
  createWindow();

  try {
    expressApp.listen(3006, () => {
      console.log("Servidor Express corriendo en el puerto 3006");
    });
  } catch (error) {
    console.error("Error al iniciar el servidor Express:", error);
  }

  // Manejar la reactivación en macOS
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });

  // Usar importación dinámica para cargar `electron-store`
  const StoreModule = await import("electron-store");
  const store = new StoreModule.default();

  // Guardar el token
  ipcMain.on("save-token", (event, token) => {
    store.set("token", token);
    console.log("Token guardado:", token);
  });

  // Guardar los datos
  ipcMain.on("save-data", (event, data) => {
    store.set("data", data);
    console.log("Datos guardados:", data);
  });

  // Obtener el token
  ipcMain.on("get-token", (event) => {
    const token = store.get("token");
    event.sender.send("token-data", token);
  });

  // Obtener los datos
  ipcMain.on("get-data", (event) => {
    const data = store.get("data");
    event.sender.send("data-complete", data); // Aquí se envían los datos
  });
});

// Cerrar la aplicación cuando todas las ventanas estén cerradas, excepto en macOS
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
