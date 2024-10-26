import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.js";
import * as serviceWorker from './serviceWorker.js'; // Asegúrate de importar el serviceWorker

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


serviceWorker.unregister();
