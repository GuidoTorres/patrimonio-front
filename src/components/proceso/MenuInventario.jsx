import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  EditOutlined,
  QrcodeOutlined,
  BarcodeOutlined,
  IdcardOutlined,
} from "@ant-design/icons";
const MenuInventario = ({ setTitle }) => {
  const navigate = useNavigate();
  useEffect(() => {
    setTitle("Menú Inventario");
  }, []);
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        gap: "20px",
      }}
    >
      <section
        style={{ height: "250px", cursor: "pointer" }}
        onClick={() => navigate("/inventario/registro")}
      >
        <div
          style={{
            borderRadius: "50%",
            boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
            height: "200px",
            width: "200px",
            backgroundColor: "white",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <EditOutlined style={{ fontSize: "80px" }} />
        </div>
        <p htmlFor="" style={{ marginTop: "10px", fontSize: "15px" }}>
          <strong>Registro de Bienes</strong>
        </p>
      </section>
      <section
        style={{ height: "250px", cursor: "pointer" }}
        onClick={() => navigate("/inventario/cargos")}
      >
        <div
          style={{
            borderRadius: "50%",
            boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
            height: "200px",
            width: "200px",
            backgroundColor: "white",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <IdcardOutlined style={{ fontSize: "80px" }} />
        </div>
        <p htmlFor="" style={{ marginTop: "10px", fontSize: "15px" }}>
          <strong>Tarjetas de Cargo</strong>
        </p>
      </section>
      <section
        style={{ height: "250px", cursor: "pointer" }}
        onClick={() => navigate("/inventario/etiquetas/bienes")}
      >
        <div
          style={{
            borderRadius: "50%",
            boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
            height: "200px",
            width: "200px",
            backgroundColor: "white",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <BarcodeOutlined style={{ fontSize: "80px" }} />
        </div>
        <p htmlFor="" style={{ marginTop: "10px", fontSize: "15px" }}>
          {" "}
          <strong>Etiqueta para Bienes</strong>
        </p>
      </section>
      {/* <section
        style={{ height: "250px", cursor: "pointer" }}
        onClick={() => navigate("/inventario/etiquetas")}
      >
        <div
          style={{
            borderRadius: "50%",
            boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
            height: "200px",
            width: "200px",
            backgroundColor: "white",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <QrcodeOutlined style={{ fontSize: "80px" }} />
        </div>
        <p htmlFor="" style={{ marginTop: "10px", fontSize: "15px" }}>
          {" "}
          <strong>Etiqueta para Ubicaciones</strong>
        </p>
      </section> */}
    </div>
  );
};

export default MenuInventario;
