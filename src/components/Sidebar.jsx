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
//prueba
  // Usar un string que corresponda a la 'key' del ítem del menú
  const [selectedKey, setSelectedKey] = useState("");

  // Actualizar la clave seleccionada en función de la ruta actual
  useEffect(() => {
    const path = location.pathname;
    setSelectedKey(path);
  }, [location]);
  useEffect(() => {
    const path = location.pathname;

    // Verificar si la ruta actual pertenece a una sección específica
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
    // Maneja la selección del menú aquí
    const key = e.key;

    // Si tienes varias rutas que deberían seleccionar el mismo ítem
    if (key === "/equipos" || key === "/actualizar/equipos") {
      setSelectedKey("/menu/equipos");
    } else {
      setSelectedKey(key);
    }

    // Navega a la ruta seleccionada
    navigate(key);
  };

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
        items={[
          {
            key: "/inventario",
            icon: <SettingOutlined />,
            label: "Inventario",
          },
          { key: "/consulta", icon: <SearchOutlined />, label: "Consultas" },
          // {
          //   key: "/configuracion",
          //   icon: <ToolOutlined />,
          //   label: "Configuración",
          // },
          { key: "/reportes", icon: <AreaChartOutlined />, label: "Reportes" },
          // { key: "/sistema", icon: <AreaChartOutlined />, label: "Sistema" },
        ]}
        onClick={handleMenuClick}
      />
    </>
  );
};

export default Sidebar;
