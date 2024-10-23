const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const isOnline = require('is-online');
const Store = require('electron-store');
require('dotenv').config({ path: path.join(__dirname, '.env') });

let mainWindow;

// Función para crear la ventana de la aplicación
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, 'build', 'index.html'));
  }
}

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

// Iniciar el servidor Express
function startExpressServer() {
  try {
    require('./server/server'); // Ajusta la ruta según tu estructura

  } catch (error) {
    console.error('Error al iniciar el servidor Express:', error);
  }
}

app.whenReady().then(async () => {
  console.log('JWT_SECRET:', process.env.JWT_SECRET);

  await checkOnlineStatus();

  // Inicia el servidor Express
  startExpressServer();

  // Crea la ventana principal
  createWindow();

  // Manejar la reactivación en macOS
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });

  const store = new Store();

  // Guardar el token
  ipcMain.on('save-token', (event, token) => {
    store.set('token', token);
    console.log('Token guardado:', token);
  });

  // Guardar los datos
  ipcMain.on('save-data', (event, data) => {
    store.set('data', data);
    console.log('Datos guardados:', data);
  });

  // Obtener el token
  ipcMain.on('get-token', (event) => {
    const token = store.get('token');
    event.sender.send('token-data', token);
  });

  // Obtener los datos
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
