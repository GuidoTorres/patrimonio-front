import React, { useEffect, useState } from "react";
import { Flex, Menu } from "antd";
import {
  SearchOutlined,
  ApartmentOutlined,
  AreaChartOutlined,
  SettingOutlined,
  ToolOutlined,
} from "@ant-design/icons";
import "./styles/sidebar.css";
import imagen from "../assets/autodema.png";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedKey, setSelectedKey] = useState("");
  const [permisos, setPermisos] = useState([]);

  // Obtener permisos de localStorage
  useEffect(() => {
    const permisosGuardados = localStorage.getItem("permisos");
    if (permisosGuardados) {
      // Convertir la cadena en un array
      setPermisos(permisosGuardados.split(","));
    }
  }, []);

  // Actualizar la clave seleccionada en función de la ruta actual
  useEffect(() => {
    const path = location.pathname;
    setSelectedKey(path);
  }, [location]);

  useEffect(() => {
    const path = location.pathname;

    if (path.startsWith("/inventario")) {
      setSelectedKey("/inventario");
    } else if (path.startsWith("/consulta")) {
      setSelectedKey("/consulta");
    } else if (path.startsWith("/configuracion")) {
      setSelectedKey("/configuracion");
    } else if (path.startsWith("/reportes")) {
      setSelectedKey("/reportes");
    } else {
      setSelectedKey(path);
    }
  }, [location]);

  const handleMenuClick = (e) => {
    const key = e.key;

    if (key === "/equipos" || key === "/actualizar/equipos") {
      setSelectedKey("/menu/equipos");
    } else {
      setSelectedKey(key);
    }

    navigate(key);
  };

  // Items del menú con filtrado basado en permisos
  const menuItems = [
    {
      key: "/inventario",
      icon: <SettingOutlined />,
      label: "Inventario",
      permiso: "inventario",
    },
    {
      key: "/consulta",
      icon: <SearchOutlined />,
      label: "Consultas",
      permiso: "consultas",
    },
    {
      key: "/configuracion",
      icon: <ToolOutlined />,
      label: "Configuración",
      permiso: "configuracion",
    },
    {
      key: "/reportes",
      icon: <AreaChartOutlined />,
      label: "Reportes",
      permiso: "reportes",
    },
  ];

  // Filtrar los items según los permisos
  const filteredMenuItems = menuItems.filter(item =>
    permisos.includes(item.permiso)
  );

  return (
    <>
      <Flex align="center" justify="center">
        <div className="logo">
          <img src={imagen} alt="autodema" width={"90%"} height={"90%"} />
        </div>
      </Flex>

      <Menu
        mode="inline"
        selectedKeys={[selectedKey]}
        className="menu-bar"
        items={filteredMenuItems}
        onClick={handleMenuClick}
      />
    </>
  );
};

export default Sidebar;
