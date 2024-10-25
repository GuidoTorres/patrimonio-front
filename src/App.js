import "./App.css";
import { InventarioProvider } from "./context/InventarioContext.jsx";
import Administrador from "./pages/Administrador.jsx";
import { BrowserRouter as Router } from "react-router-dom";

function App() {
  return (
    <InventarioProvider>
      <div className="App">
        <Router>
          <Administrador />
        </Router>
      </div>
    </InventarioProvider>
  );
}

export default App;
