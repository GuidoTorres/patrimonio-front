const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
// require('dotenv').config({ path: path.join(__dirname, '.env') });
let mainWindow;

// Función para crear la ventana de la aplicación
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 900,
    webPreferences: {
      // preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // Verifica si estás en modo de desarrollo
  const startUrl = process.env.ELECTRON_START_URL || path.join(__dirname, 'build', 'index.html');

  // En desarrollo, cargar la URL de la aplicación React en el puerto 3000
  if (process.env.ELECTRON_START_URL) {
    mainWindow.loadURL(process.env.ELECTRON_START_URL);
  } else {
    mainWindow.loadFile(startUrl);
  }
}
// Función para cargar dinámicamente is-online y electron-store
async function loadModules() {
  // Cargar el módulo is-online dinámicamente
  const isOnlineModule = await import("is-online");
  isOnline = isOnlineModule.default;
}
console.log("JWT_SECRET:", process.env.JWT_SECRET);

// Verificar conexión a internet
async function checkOnlineStatus() {
  try {
    const onlineStatus = await isOnline();
    if (onlineStatus) {
      console.log('Conexión a internet disponible');
    } else {
      console.log('No hay conexión a internet');
    }
  } catch (error) {
    console.error('Error al verificar la conexión:', error);
  }
}
// Función para iniciar el servidor como un Child Process



app.whenReady().then(async () => {

  await checkOnlineStatus();

  // Crea la ventana principal
  createWindow();

  // Manejar la reactivación en macOS
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });

  const store = new Store();

  // Configurar los canales IPC
  ipcMain.on('save-token', (event, token) => {
    store.set('token', token);
    console.log('Token guardado:', token);
  });

  ipcMain.on('save-data', (event, data) => {
    store.set('data', data);
    console.log('Datos guardados:', data);
  });

  ipcMain.on('get-token', (event) => {
    const token = store.get('token');
    event.sender.send('token-data', token);
  });

  ipcMain.on('get-data', (event) => {
    const data = store.get('data');
    event.sender.send('data-complete', data);
  });
});

// Cerrar la aplicación cuando todas las ventanas estén cerradas, excepto en macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

