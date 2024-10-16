import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ProfileOutlined,
  SearchOutlined, BarChartOutlined
} from "@ant-design/icons";
const MenuProceso = ({ setTitle }) => {
  const navigate = useNavigate();
  useEffect(() => {
    setTitle("Menu Procesos");
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
        style={{ height: "250px", cursor: "pointer", }}
        onClick={() => navigate("/proceso/inventario/menu")}
      >
        <div
          style={{
            borderRadius: "50%",
            boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
            height: "200px",
            width: "200px",
            backgroundColor: "white",
            display: "flex", justifyContent: "center", alignItems: "center"
          }}
        ><ProfileOutlined style={{ fontSize: "80px" }} />

        </div>
        <p htmlFor="" style={{ marginTop: "10px", fontSize: "15px" }}>
          <strong>Inventario</strong>
        </p>
      </section>

      <section
        style={{ height: "250px", cursor: "pointer" }}
        onClick={() => navigate("/proceso/consultas")}
      >
        <div
          style={{
            borderRadius: "50%",
            boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
            height: "200px",
            width: "200px",
            backgroundColor: "white", display: "flex", justifyContent: "center", alignItems: "center"
          }}
        >
          <SearchOutlined style={{ fontSize: "80px" }} />
        </div>
        <p htmlFor="" style={{ marginTop: "10px", fontSize: "15px" }}>
          {" "}
          <strong>Consultas</strong>
        </p>
      </section>
      <section
        style={{ height: "250px", cursor: "pointer" }}
        onClick={() => navigate("/proceso/reportes")}
      >
        <div
          style={{
            borderRadius: "50%",
            boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
            height: "200px",
            width: "200px",
            backgroundColor: "white",
            backgroundColor: "white", display: "flex", justifyContent: "center", alignItems: "center"

          }}
        >
          <BarChartOutlined style={{fontSize:"80px"}}/>
        </div>
        <p htmlFor="" style={{ marginTop: "10px", fontSize: "15px" }}>
          {" "}
          <strong>Reportes</strong>
        </p>
      </section>
    </div>
  );
};

export default MenuProceso;
