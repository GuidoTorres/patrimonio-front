const { contextBridge, ipcRenderer } = require("electron");

// Exponer funciones seguras para el frontend
contextBridge.exposeInMainWorld("electron", {
  saveToken: (token) => ipcRenderer.send("save-token", token), // Guardar el token
  saveData: (data) => ipcRenderer.send("save-data", data), // Guardar los datos

  sendTokenRequest: () => ipcRenderer.send("get-token"), // Solicitar el token
  sendDataRequest: () => ipcRenderer.send("get-data"), // Solicitar los datos

  // Escuchar la respuesta del token
  onTokenData: (callback) =>
    ipcRenderer.on("token-data", (event, token) => callback(token)),

  // Escuchar la respuesta de los datos
  onCompleteData: (callback) =>
    ipcRenderer.on("data-complete", (event, data) => callback(data)),
});
