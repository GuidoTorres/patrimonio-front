import { Button, Flex, Input, Select, Table, Typography } from "antd";
import Item from "antd/es/list/Item";
import React, { useEffect, useRef, useState } from "react";
import CodigoBarras from "./Etiquetas/CodigoBarras";
import { useReactToPrint } from "react-to-print";

const EtiquetasBienes = ({ setTitle }) => {
  const barcodeRef = useRef();

  useEffect(() => {
    setTitle("Etiquetas para bienes");
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
  const [selectedBarras, setSelectedBarras] = useState([]); // Estado para almacenar los valores de CodigoBarras
  const [ids, setIds] = useState({
    sedeId: null,
    dependenciaId: null,
    ubicacionId: null,
  });

  const [selectedUbicacion, setSelectedUbicacion] = useState(null);
  const [selectedDependencia, setSelectedDependencia] = useState(null);

  useEffect(() => {
    getTrabajador();
  }, []);

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
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE}/bienes/trabajadores/sedes?dni=${dni}`
      );
      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error("Error al obtener datos relacionados:", error);
    }
  };

  const handleSedeChange = (sedeId) => {
    setIds((value) => ({ ...value, sedeId: sedeId }));
    const filteredDependencias = dependencias?.filter(
      (item) => item.sede_id == sedeId
    );

    setSelectedDependencia(filteredDependencias); // Establecer las dependencias filtradas
    setIds((value) => ({ ...value, dependenciaId: null, ubicacionId: null }));
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

      setSelectedUbicacion(filteredUbicaciones);
    }
  };

  const handleUbicacionChange = (ubicacionId) => {
    setIds((value) => ({ ...value, ubicacionId: ubicacionId }));

    getEtiquetas(ubicacionId);
  };

  useEffect(() => {
    if (dni?.length === 8) {
      handleTrabajadorChange();
    }
  }, [dni]);

  const getEtiquetas = async (ubicacion) => {
    let url = `${process.env.REACT_APP_BASE}/bienes/etiquetas?`; // URL base

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

  const handlePrint = useReactToPrint({
    content: () => barcodeRef.current,
  });

  const handleBarcodePrint = (item) => {
    console.log(item);
    setSelectedBarras([item]); // Pasar solo el valor del item a CodigoBarras
    setPrintTrigger(true) // Ejecutar la impresión
  };

  // Imprimir todos los registros
  const handlePrintAll = () => {
    setSelectedBarras(etiquetas); // Pasar todos los valores a CodigoBarras
    setPrintTrigger(true) // Ejecutar la impresión
  };
  useEffect(() => {
    if (printTrigger) {
      handlePrint(); // Ejecutamos la impresión solo cuando el trigger es true
      setPrintTrigger(false); // Reiniciamos el trigger después de imprimir
    }
  }, [printTrigger, selectedBarras]); 

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

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      align: "center",
    },
    {
      title: "SBN",
      dataIndex: "sbn",
      align: "center",
    },
    {
      title: "DESCRIPCIÓN",
      dataIndex: "descripcion",
      align: "center",
    },
    {
      title: "MARCA",
      dataIndex: "marca",
      align: "center",
    },
    {
      title: "MODELO",
      dataIndex: "modelo",
      align: "center",
    },
    {
      title: "COLOR",
      dataIndex: "color",
      align: "center",
    },
    {
      title: "USUARIO",
      render: (_, record) => <p>{record?.usuario?.nombre_usuario}</p>,
      align: "center",
    },
    {
      title: "ACCIONES",
      render: (_, record) => (
        <Button onClick={() => handleBarcodePrint(record)}>Imprimir</Button>
      ),
      align: "center",
    },
  ];


  return (
    <>
      <style>
        {`
      @media print {
        @page {
          size: 5cm 2.4cm; /* Tamaño de la etiqueta */
          margin: 0; /* Sin márgenes en la página */
        }

        div {
          page-break-inside: avoid; /* Evitar que una etiqueta se corte entre páginas */
          break-inside: avoid-column;
        }

        /* Asegurarse de que las etiquetas ocupen el tamaño adecuado */
        .etiqueta {
          width: 5cm;
          height: 2.5cm;
          padding: 5px;
          box-sizing: border-box; /* Asegura que padding esté incluido en el tamaño total */
        }
        .custom-header-table, button {
          display: none !important;
        }

        /* Mostrar solo el contenido de barcodeRef durante la impresión */
        .barcode-print {
          display: block !important;
        }
      }

      /* Ocultar el contenido de barcodeRef en la pantalla */
      .barcode-print {
        display: none;
      }

      }
    `}
      </style>
      <Flex
        justify="start"
        gap={"10px"}
        style={{
          backgroundColor: "white",
          padding: "15px",
          borderRadius: "8px",
          border: "1px solid lightgrey",
        }}
        wrap="wrap"
      >
        <Select
          placeholder="Trabajador"
          style={{
            flexBasis: "200px", // Definir un tamaño flexible mínimo
            maxWidth: "250px", // Limitar el ancho máximo para que no ocupe toda la línea
            flexGrow: 1, // Permitir que crezca si hay espacio disponible
          }}
          onChange={(e) => setDni(e)}
          showSearch
          optionFilterProp="children"
          filterOption={(input, option) =>
            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
          }
          popupMatchSelectWidth={true}
          allowClear
          options={trabajadores?.map((item) => {
            return { label: item.nombre, value: item.dni };
          })}
          value={dni}
        />
        <Select
          value={ids.sedeId}
          placeholder="Sedes"
          style={{
            flexBasis: "200px", // Definir un tamaño flexible mínimo
            maxWidth: "250px", // Limitar el ancho máximo para que no ocupe toda la línea
            flexGrow: 1, // Permitir que crezca si hay espacio disponible
          }}
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
          style={{
            flexBasis: "200px", // Definir un tamaño flexible mínimo
            maxWidth: "250px", // Limitar el ancho máximo para que no ocupe toda la línea
            flexGrow: 1, // Permitir que crezca si hay espacio disponible
          }}          onChange={handleDependenciaChange}
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
          style={{
            flexBasis: "200px", // Definir un tamaño flexible mínimo
            maxWidth: "250px", // Limitar el ancho máximo para que no ocupe toda la línea
            flexGrow: 1, // Permitir que crezca si hay espacio disponible
          }}          onChange={handleUbicacionChange}
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
          onClick={() => limpiarFiltros()}
        >
          Limpiar Filtros
        </Button>
        {etiquetas.length > 0 ? (
          <Flex justify="end" align="center">
            <Button
              style={{ backgroundColor: "#4DA362", color: "white" }}
              onClick={() => handlePrintAll()}
            >
              Imprimir Etiquetas
            </Button>
          </Flex>
        ) : null}
      </Flex>
      <div
        style={{
          height: "90%",
          border: "1px solid lightgrey",
          marginTop: "10px",
          borderRadius: "8px",
          padding: "1px",
          backgroundColor: "white",
        }}
      >
        <div ref={barcodeRef} 
        className="barcode-print"
        >
          <CodigoBarras values={selectedBarras} className="etiqueta" />
        </div>
        <div style={{ padding: "15px" }}>
          <Table
            columns={columns}
            dataSource={etiquetas}
            className="custom-header-table"
          />
        </div>
      </div>
    </>
  );
};

export default EtiquetasBienes;
