<<<<<<< HEAD
const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

let mainWindow;
let isOnline;

=======
import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import isOnline from 'is-online';
import Store from 'electron-store';
import { fileURLToPath } from 'url'; // Necesario para obtener __dirname en ESM

// Obtener __dirname en módulos ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;

// Función para crear la ventana de la aplicación
>>>>>>> 56eaed4 (fix: errores)
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 900,
    webPreferences: {
<<<<<<< HEAD
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  const startUrl = process.env.ELECTRON_START_URL || `file://${path.resolve(__dirname, 'build', 'index.html')}`;

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
=======
      preload: path.join(__dirname, 'preload.js'), // Aseguramos la ruta correcta
      nodeIntegration: false, // Seguridad: no integrar Node.js en el frontend
      contextIsolation: true, // Aislar el contexto para seguridad
    },
  });

  // Cargar la aplicación React desde localhost en desarrollo
  mainWindow.loadURL('http://localhost:3000');

  // Abrir herramientas de desarrollo solo en desarrollo
  mainWindow.webContents.openDevTools();
>>>>>>> 56eaed4 (fix: errores)
}

// Verificar conexión a internet
async function checkOnlineStatus() {
<<<<<<< HEAD
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
=======
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

app.whenReady().then(async () => {
  try {
    // Verificar el estado de la conexión a internet
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

    // Configurar los canales IPC para almacenar y obtener datos
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
  } catch (error) {
    console.error('Error al iniciar la aplicación:', error);
  }
>>>>>>> 56eaed4 (fix: errores)
});

// Cerrar la aplicación cuando todas las ventanas estén cerradas, excepto en macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
<<<<<<< HEAD

=======
>>>>>>> 56eaed4 (fix: errores)
