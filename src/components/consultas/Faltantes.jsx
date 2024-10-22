import React, { useEffect, useState } from "react";
import { Flex, Select, Button, Input, Table, Descriptions, Tag, notification } from "antd";

const Faltantes = ({ setTitle }) => {
  useEffect(() => {
    setTitle("Consulta Bienes Faltantes");
    getBienes();
    getSedes();
    getUbicaciones();
  }, []);

  const [bienes, setBienes] = useState([]);
  const [sedes, setSedes] = useState([]);
  const [ubicaciones, setUbicaciones] = useState([]);
  const [filters, setFilters] = useState([]);

  const getBienes = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_BASE}/bienes/faltantes`
    );

    if (response.ok) {
      const info = await response.json();
      setBienes(info.bien); // Guardar los bienes en el estado si la respuesta es exitosa
    }
  };

  const getSedes = async () => {
    const response = await fetch(`${process.env.REACT_APP_BASE}/sedes`);

    if (response.ok) {
      const info = await response.json();
      setSedes(info); // Guardar los bienes en el estado si la respuesta es exitosa
    }
  };
  const getUbicaciones = async () => {
    const response = await fetch(`${process.env.REACT_APP_BASE}/ubicaciones`);

    if (response.ok) {
      const info = await response.json();
      setUbicaciones(info); // Guardar los bienes en el estado si la respuesta es exitosa
    }
  };

  const columns = [
    {
      title: "COD. SBN",
      dataIndex: "sbn",
      align: "center",
    },
    {
      title: "DETALLES",
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
      title: "SERIE",
      dataIndex: "serie",
      align: "center",
    },
    {
      title: "SITUACIÓN",
      render: (_, record) =>
        record.situacion ? (
          <Tag color="blue">Uso</Tag>
        ) : (
          <Tag color="volcano">Desuso</Tag>
        ),
      align: "center",
    },
  ];
  const handleInputChange = (name, value) => {
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  // Construir la URL con los filtros dinámicos
  const buildQueryParams = () => {
    const query = new URLSearchParams();

    Object.keys(filters).forEach((key) => {
      if (filters[key]) {
        query.append(key, filters[key]);
      }
    });
    query.append("inventariado", false);

    return query.toString();
  };

  // Enviar la consulta a la API
  const handleSearch = async () => {
    const queryParams = buildQueryParams();
    const url = `${process.env.REACT_APP_BASE}/bienes/consulta?${queryParams}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      setBienes(data.bien);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const expandedRowRenderPrueba = (record) => {
    const items = [
      {
        key: "1",
        label: "Detalles",
        children: record.CARACTERISTICAS
          ? record.CARACTERISTICAS
          : "SIN DETALLES",
      },
      {
        key: "2",
        label: "Observaciones",
        children: record.observacion
          ? record.observacion
          : "SIN OBSERVACIONES",
      },
      {
        key: "3",
        label: "Cod. Ubicación",
        children:
          record?.ubicacione?.tipo_ubicac +
          "" +
          record?.ubicacione?.ubicac_fisica,
      },
      {
        key: "4",
        label: "Sede",
        children: record?.sede?.nombre,
      },
      {
        key: "5",
        label: "DNI",
        children: record?.dni,
      },
      {
        key: "5",
        label: "Responsable",
        children: record?.trabajadore?.nombre,
      },
    ];

    return <Descriptions title="Información Adicional" items={items} />;
  };

  const LimpiarBusqueda = async () => {
    setFilters([]);
    getBienes();
  };

  const registrarFaltantes = async () => {
    // Mapeas los bienes para obtener el array de sbn
    const faltantes = bienes.map((item) => item.sbn);

    // URL base desde las variables de entorno
    const url = `${process.env.REACT_APP_BASE}/bienes/faltantes`;

    // Configuras la solicitud POST
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json", // Indicamos que el cuerpo será JSON
      },
      body: JSON.stringify({ sbn: faltantes }), // Enviamos el array de sbn
    });

    // Manejo de la respuesta del servidor
    if (response.ok) {
      const data = await response.json();
      notification.success(data.msg)
      getBienes()
    } else {
      console.error("Error al actualizar los faltantes");
    }
  };

  return (
    <>
      <div style={{ backgroundColor: "white", borderRadius: "10px" }}>
        <Flex
          justify="flex-start"
          style={{
            padding: "15px",
            borderRadius: "10px",
            boxShadow: " rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;",
          }}
          gap={"10px"}
        >
          <Select
            placeholder="Sedes"
            style={{
              width: "33%",
            }}
            name="sede_id"
            value={filters.sede_id}
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            allowClear
            onChange={(e) => handleInputChange("sede_id", e)}
            options={sedes.map((item) => {
              return {
                label: item.nombre,
                value: item.id,
              };
            })}
          />
          <Select
            placeholder="Ubicaciones"
            style={{
              width: "33%",
            }}
            options={ubicaciones.map((item) => {
              return {
                label: item.nombre,
                value: item.id,
              };
            })}
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            allowClear
            name="ubicacion_id"
            value={filters.ubicacion_id}
            onChange={(e) => handleInputChange("ubicacion_id", e)}
          />
          <Input
            placeholder="Usuarios"
            style={{
              width: "33%",
            }}
            allowClear
            value={filters.dni}
            onChange={(e) => handleInputChange("dni", e.target.value)}
          />
        </Flex>
        <Flex justify="start" align="center">
          <Flex
            justify="start"
            style={{
              padding: "15px",
              borderRadius: "10px",
              boxShadow: " rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;",
              width: "50%",
            }}
            gap={"10px"}
          >
            <Input
              placeholder="Código SBN"
              style={{
                width: "50%",
              }}
              name="sbn"
              value={filters.sbn}
              onChange={(e) => handleInputChange("sbn", e.target.value)}
            />
            <Input
              placeholder="Serie"
              style={{
                width: "50%",
              }}
              name="serie"
              value={filters.serie}
              onChange={(e) => handleInputChange("serie", e.target.value)}
            />
          </Flex>
          {bienes?.length > 0 ? (
            <Tag
              style={{
                fontSize: "15px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              color="cyan"
            >
              Total: {bienes?.length}
            </Tag>
          ) : null}
          <Flex
            style={{
              width: "50%",
              padding: "15px",
            }}
            align="center"
            justify="end"
          >
            <Button
              style={{ backgroundColor: "#4DA362", color: "white" }}
              onClick={handleSearch}
            >
              {" "}
              Realizar Busqueda
            </Button>
            <Button
              style={{ backgroundColor: "#4DA362", color: "white" }}
              onClick={LimpiarBusqueda}
            >
              {" "}
              Limpiar Busqueda
            </Button>
            {/* <Button
              style={{ backgroundColor: "#4DA362", color: "white" }}
              onClick={registrarFaltantes}
            >
              Registrar Faltantes
            </Button> */}
          </Flex>
        </Flex>
      </div>
      <section
        style={{
          backgroundColor: "white",
          borderRadius: "10px",
          marginTop: "20px",
          padding: "15px",
        }}
      >
        <Table
          columns={columns}
          className="custom-header-table"
          dataSource={bienes?.map((item, index) => ({
            ...item,
            key: item.id || index,
          }))}
          expandable={{
            expandedRowRender: (record) => expandedRowRenderPrueba(record),
          }}
        />
      </section>
    </>
  );
};

export default Faltantes;
