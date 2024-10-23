const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const isOnline = require('is-online');
const Store = require('electron-store');
const { spawn } = require('child_process'); // Importar spawn de child_process
require('dotenv').config({ path: path.join(__dirname, '.env') });

let mainWindow;
let serverProcess;

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

// Iniciar el servidor Express como proceso hijo
function startServer() {
  serverProcess = spawn('node', ['server/index.js'], {
    cwd: path.join(__dirname),
    env: process.env,
    shell: true
  });

  serverProcess.stdout.on('data', (data) => {
    console.log(`Servidor: ${data}`);
  });

  serverProcess.stderr.on('data', (data) => {
    console.error(`Error del servidor: ${data}`);
  });

  serverProcess.on('close', (code) => {
    console.log(`El proceso del servidor finalizó con el código ${code}`);
  });
}

app.whenReady().then(async () => {
  console.log('JWT_SECRET:', process.env.JWT_SECRET);

  await checkOnlineStatus();

  // Inicia el servidor Express como proceso hijo
  startServer();

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

// Detener el servidor al salir de la aplicación
app.on('before-quit', () => {
  if (serverProcess) {
    serverProcess.kill();
  }
});
