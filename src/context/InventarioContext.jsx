import { createContext, useState } from "react";

export const InventarioContext = createContext();

export const InventarioProvider = ({ children }) => {
  const [isLogged, setIsLogged] = useState(false);

  const info = {
    isLogged,
    setIsLogged,
  };
  return <InventarioContext.Provider value={info}>{children}</InventarioContext.Provider>;
};
