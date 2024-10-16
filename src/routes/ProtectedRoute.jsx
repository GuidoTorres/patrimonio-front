import { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { InventarioContext } from "../context/InventarioContext";

export const ProtectedRoute = ({ children }) => {
  const { isLogged, setIsLogged } = useContext(InventarioContext);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   // Verificar si el token está guardado en electron-store
  //   if (window.electron && window.electron.sendTokenRequest) {
  //     window.electron.sendTokenRequest(); // Solicitar el token al proceso principal
  //     window.electron.onTokenData((token) => {
  //       if (token) {
  //         setIsLogged(true); // Token presente, usuario autenticado
  //       } else {
  //         setIsLogged(false); // No hay token, usuario no autenticado
  //       }
  //       setLoading(false); // Finalizar la carga
  //     });
  //   }
  // }, [setIsLogged]);

  // if (loading) {
  //   return <div>Cargando...</div>; // Mostrar un indicador de carga mientras se verifica el token
  // }

  return !localStorage.getItem("token") ? <Navigate to="/" replace /> : children;
};
