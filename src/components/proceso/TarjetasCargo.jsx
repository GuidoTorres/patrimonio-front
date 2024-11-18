import { Button, Flex, Input, Select, Typography } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { pdf } from "@react-pdf/renderer";

import CargoPDF from "./Pdfs/CargoPDF";
const TarjetasCargo = ({ setTitle }) => {
  const barcodeRef = useRef();

  useEffect(() => {
    setTitle("Tarjetas de Cargo");
  }, []);
  const [printTrigger, setPrintTrigger] = useState(false);
  const [ubicaciones, setUbicaciones] = useState([]);
  const [trabajadores, setTrabajadores] = useState([]);
  const [etiquetas, setEtiquetas] = useState([]);
  const [dni, setDni] = useState(null);
  const [sedes, setSedes] = useState([]);
  const [data, setData] = useState([]);
  const [dependencias, setDependencias] = useState([]);
  const [selectedSede, setSelectedSede] = useState(null);
  const [ids, setIds] = useState({
    sedeId: null,
    dependenciaId: null,
    ubicacionId: null,
  });
  const [selectedUbicacion, setSelectedUbicacion] = useState(null);
  const [selectedDependencia, setSelectedDependencia] = useState(null);
  const [ubicac, setUbicac] = useState(null);

  useEffect(() => {
    setSedes(data?.sedes); // Extraer las sedes del data
    setDependencias(data?.dependencias); // Extraer las sedes del data
    setUbicaciones(data?.ubicaciones); // Extraer las sedes del data
  }, [data]);
  const getTrabajador = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_BASE}/trabajadores/all`
    );

    if (response.ok) {
      const info = await response.json();
      setTrabajadores(info); // Guardar los bienes en el estado si la respuesta es exitosa
    } else {
      setTrabajadores([]);
    }
  };
  // Función para manejar el cambio de trabajador
  const handleTrabajadorChange = async () => {
    // Hacer una solicitud para obtener las sedes, dependencias y ubicaciones según el trabajador seleccionado
    console.log("prueba");
    const usuario = localStorage.getItem("usuario");
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE}/bienes/trabajadores/sedes?dni=${dni}&usuario=${usuario}`
      );
      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error("Error al obtener datos relacionados:", error);
    }
  };

  const handleSedeChange = (sedeId) => {
    if (!sedeId) {
      setSelectedDependencia(null);
      setSelectedUbicacion(null);
      setIds((values) => ({
        ...values,
        dependenciaId: null,
        ubicacionId: null,
      }));
    } else {
      setIds((value) => ({ ...value, sedeId: sedeId }));
      const filteredDependencias = dependencias?.filter(
        (item) => item.sede_id == sedeId
      );

      setSelectedDependencia(filteredDependencias); // Establecer las dependencias filtradas
      setIds((value) => ({ ...value, dependenciaId: null, ubicacionId: null }));
    }
  };

  const handleDependenciaChange = (dependenciaId) => {
    if (!dependenciaId) {
      setSelectedUbicacion(null);
      setIds((value) => ({ ...value, ubicacionId: null, dependenciaId: null }));

    } else {
      setIds((value) => ({ ...value, dependenciaId: dependenciaId }));

      // Filtrar las ubicaciones según la dependencia seleccionada
      const filteredUbicaciones = ubicaciones?.filter(
        (item) => item.dependencia_id === dependenciaId
      );

      setSelectedUbicacion(null);
      setSelectedUbicacion(filteredUbicaciones);
      setUbicac(filteredUbicaciones);
    }
  };

  const handleUbicacionChange = (ubicacionId) => {
    setIds((value) => ({ ...value, ubicacionId: ubicacionId }));

    getEtiquetas(ubicacionId);
  };

  useEffect(() => {
    if (dni?.length == 8) {
      handleTrabajadorChange();
    }
  }, [dni]);

  const getEtiquetas = async (ubicacion) => {
    const usuario = localStorage.getItem("usuario");

    let url = `${process.env.REACT_APP_BASE}/bienes/etiquetas?`; // URL base
    if (usuario) {
      url += `usuario=${usuario}&`;
    }
    if (dni) {
      url += `dni=${dni}&`;
    }
    if (ids.sedeId) {
      url += `sedeId=${ids.sedeId}&`;
    }
    if (ids.dependenciaId) {
      url += `dependenciaId=${ids.dependenciaId}&`;
    }
    if (ubicacion) {
      url += `ubicacionId=${ubicacion}&`;
    }

    // Eliminar el último `&` si existe
    url = url.slice(0, -1);

    const response = await fetch(url);

    if (response.ok) {
      const info = await response.json();
      setEtiquetas(info); // Guardar los bienes en el estado si la respuesta es exitosa
    } else {
      setEtiquetas([]);
    }
  };

  useEffect(() => {
    getTrabajador();
  }, []);
  const handlePrint = async () => {
    // Generar el PDF como un blob usando el componente CargoPDF
    const blob = await pdf(<CargoPDF registros={etiquetas} />).toBlob();

    // Crear una URL temporal para el blob
    const url = URL.createObjectURL(blob);

    // Abrir una nueva ventana para mostrar el PDF
    window.open(url);
  };
  const limpiarFiltros = () => {
    setSedes([]);
    setDependencias([]);
    setUbicaciones([]);
    setSelectedSede(null);
    setSelectedUbicacion(null);
    setSelectedDependencia(null);
    setIds({ sedeId: null, dependenciaId: null, ubicacionId: null });
    setDni(null);
    setEtiquetas([]);
  };

  return (
    <Flex
      justify="center"
      align="center"
      style={{ height: "100%", width: "100%" }}
    >
      <Flex
        justify="start"
        gap={"10px"}
        vertical
        style={{
          backgroundColor: "white",
          padding: "15px",
          borderRadius: "8px",
          width: "40%",
        }}
      >
        <Select
          placeholder="Trabajador"
          className="form-item-input"
          onChange={(e) => setDni(e)}
          showSearch
          optionFilterProp="children"
          filterOption={(input, option) =>
            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
          }
          allowClear
          options={trabajadores?.map((item) => {
            return { label: item.nombre, value: item.dni };
          })}
          value={dni}
        />
        <Select
          value={ids.sedeId}
          placeholder="Sedes"
          className="form-item-input"
          onChange={handleSedeChange}
          showSearch
          optionFilterProp="children"
          filterOption={(input, option) =>
            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
          }
          allowClear
          options={sedes?.map((item) => {
            return {
              value: item?.id,
              label: item?.nombre,
            };
          })}
        />
        <Select
          value={ids.dependenciaId}
          placeholder="Dependencias"
          className="form-item-input"
          onChange={handleDependenciaChange}
          showSearch
          optionFilterProp="children"
          filterOption={(input, option) =>
            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
          }
          allowClear
          options={selectedDependencia?.map((item) => {
            return {
              value: item?.id,
              label: item?.nombre,
            };
          })}
        />

        <Select
          placeholder="Ubicaciones"
          className="form-item-input"
          onChange={handleUbicacionChange}
          showSearch
          optionFilterProp="children"
          filterOption={(input, option) =>
            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
          }
          allowClear
          options={selectedUbicacion?.map((item) => {
            return {
              value: item?.id,
              label: item?.nombre,
            };
          })}
          value={ids.ubicacionId}
        />
        <Button
          style={{ backgroundColor: "#4DA362", color: "white" }}
          onClick={limpiarFiltros}
        >
          Limpiar Filtros
        </Button>
        {etiquetas.length > 0 ? (
          <Button
            style={{ backgroundColor: "#4DA362", color: "white" }}
            onClick={handlePrint}
          >
            Imprimir Tarjeta de Cargo
          </Button>
        ) : null}
      </Flex>
    </Flex>
  );
};

export default TarjetasCargo;
