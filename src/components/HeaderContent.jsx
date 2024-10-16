import {
  MessageOutlined,
  NotificationOutlined,
  UserOutlined,
  SolutionOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { Avatar, Flex, Popover, Typography } from "antd";
import React, { useContext, useState, useEffect } from "react";
import { InventarioContext } from "../context/InventarioContext";
import { useNavigate } from "react-router-dom";


const HeaderContent = ({ title }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const { setIsLogged, isLogged } = useContext(InventarioContext);

  const cerrarSesion = () => {
    setIsLogged(false);
    localStorage.removeItem("token");
    navigate("/");
  };

  const getData = () => {
    if (window.electron && window.electron.sendDataRequest) {
      window.electron.sendDataRequest(); // Solicitar los datos al proceso principal
      window.electron.onCompleteData((data) => {
        setUser(data?.nombre_usuario); // Asignar los datos recibidos al estado
      });
    } else {
      console.error('window.electron no está definido');
    }
  };

  useEffect(() => {
    getData(); // Solicitar los datos al montar el componente
  }, []);




  return (
    <Flex align="center" justify="space-between">
      <Flex
        align="center"
        justify="flex-start"
        style={{ width: "50%", marginLeft: "-15px" }}
      >
        <ArrowLeftOutlined
          style={{ fontSize: "20px" }}
          onClick={() => navigate(-1)}
        />
        <Typography.Title
          level={4}
          type="secondary"
          style={{
            marginTop: "8px",
            marginLeft: "16px",
            color: "243243",
          }}
        >
          {title}
        </Typography.Title>
      </Flex>
      <Flex align="center" gap="3rem">
        <Flex align="center" gap="10px">
          <Popover
            placement="bottomRight"
            title={user}
            content={
              <label style={{ cursor: "pointer" }} onClick={cerrarSesion}>
                Cerrar sesión
              </label>
            }
            trigger="click"
          >
            <Avatar size="default" icon={<UserOutlined />} />
          </Popover>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default HeaderContent;
