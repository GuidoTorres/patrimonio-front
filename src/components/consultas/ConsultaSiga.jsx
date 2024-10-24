import { Flex, Select, Button, Input, Table, Descriptions, Tag, notification, message } from "antd";
import React, { useEffect, useState } from "react";

const ConsultaSiga = ({ setTitle }) => {
  const [sedes, setSedes] = useState([]);
  const [ubicaciones, setUbicaciones] = useState([]);
  const [selectedSede, setSelectedSede] = useState(null);
  const [selectedUbicacion, setSelectedUbicacion] = useState(null);
  const [usuario, setUsuario] = useState("");
  const [codigoSBN, setCodigoSBN] = useState("");
  const [serie, setSerie] = useState("");
  const [bienes, setBienes] = useState([]);
  const [trabajadores, setTrabajadores] = useState([]);
  const [dni, setDni] = useState(null);

  useEffect(() => {
    setTitle("Consulta Siga");
    getSedes();
    getUbicaciones();
    getTrabajador();
  }, []);

  const columns = [
    {
      title: "SBN",
      dataIndex: "CODIGO_ACTIVO",
      align: "center",
    },
    {
      title: "DENOMINACIÓN",
      dataIndex: "DESCRIPCION",
      align: "center",
    },
    {
      title: "MARCA",
      dataIndex: "MARCA",
      align: "center",
    },
    {
      title: "MDOELO",
      dataIndex: "MODELO",
      align: "center",
    },
    {
      title: "COLOR",
      dataIndex: "COLOR",
      align: "center",
    },
    {
      title: "SERIE",
      render: (_, record) => (
        <>
          <p>{record.NRO_SERIE ? record.NRO_SERIE : "Sin Serie"}</p>
        </>
      ),
      align: "center",
    },
    {
      title: "ESTADO",
      render: (_, record) => (
        <>
          {record.ESTADO_CONSERV === "1" || record.ESTADO_CONSERV === "1" ? (
            <Tag color="green">Bueno</Tag>
          ) : record.ESTADO_CONSERV === "2" || record.ESTADO_CONSERV === "2" ? (
            <Tag color="blue">Regular</Tag>
          ) : record.ESTADO_CONSERV === "3" || record.ESTADO_CONSERV === "3" ? (
            <Tag color="volcano">Malo</Tag>
          ) : record.ESTADO_CONSERV === "4" || record.ESTADO_CONSERV === "4" ? (
            <Tag color="red">Muy Malo</Tag>
          ) : record.ESTADO_CONSERV === "5" || record.ESTADO_CONSERV === "5" ? (
            <Tag color="blue">Nuevo</Tag>
          ) : record.ESTADO_CONSERV === "6" || record.ESTADO_CONSERV === "6" ? (
            <Tag color="purple">Chatarra</Tag>
          ) : record.ESTADO_CONSERV === "7" || record.ESTADO_CONSERV === "7" ? (
            <Tag color="magenta">RAEE</Tag>
          ) : null}
        </>
      ),
      align: "center",
    },
  ];

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

  const realizarBusqueda = async () => {
    const queryParams = new URLSearchParams();
    if (selectedSede) queryParams.append("sede_id", selectedSede);
    if (selectedUbicacion)
      queryParams.append("ubicacion_id", selectedUbicacion);
    if (usuario) queryParams.append("dni", usuario);
    if (codigoSBN) queryParams.append("sbn", codigoSBN);
    if (serie) queryParams.append("serie", serie);

    const response = await fetch(
      `http://10.30.1.49/api/v1/bienes?${queryParams.toString()}`
    );
    const data = await response.json();
    if (response.ok) {
      setBienes(data.data);
    }else{
      message.error(data.msg)
    }
  };
  const LimpiarBusqueda = async () => {
    setBienes([]);
    setSerie("");
    setCodigoSBN("");
    setUsuario("");
    setSelectedSede(null);
    setSelectedUbicacion(null);
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
        children: record.observaciones
          ? record.observaciones
          : "SIN OBSERVACIONES",
      },
      {
        key: "3",
        label: "Cod. Ubicación",
        children: record?.TIPO_UBICAC + "" + record?.COD_UBICAC + " - " + record?.UBICAC_FISICA,
      },
      {
        key: "4",
        label: "Sede",
        children: record?.nombre_sede,
      },
      {
        key: "5",
        label: "Ubicación",
        children: record?.NOMBRE_DEPEND+" - "+record?.TIPO_UBICAC + "" + record?.COD_UBICAC +" - "+ record?.UBICAC_FISICA,
      },

      {
        key: "6",
        label: "DNI",
        children: record?.docum_ident,
      },
      {
        key: "7",
        label: "Responsable",
        children: record?.nombre_completo,
      },
    ];

    return <Descriptions title="Información Adicional" items={items} />;
  };

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

  return (
    <>
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "10px",
          border: "1px solid rgb(228, 228, 228)",
        }}
      >
        <Flex
          justify="flex-start"
          style={{
            padding: "15px",
            borderRadius: "10px",
            // boxShadow: " rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
          }}
          gap={"10px"}
        >
          <Select
            placeholder="Sedes"
            style={{
              width: "33%",
            }}
            value={selectedSede || undefined}
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            allowClear
            options={sedes.map((item) => {
              return {
                label: item.nombre,
                value: item.id,
              };
            })}
            onChange={setSelectedSede}
          />
          <Select
            placeholder="Ubicaciones"
            // value={selectedUbicacion || undefined}
            style={{
              width: "33%",
            }}
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            allowClear
            options={ubicaciones.map((item) => {
              return {
                label: item.nombre,
                value: item.tipo_ubicac + "" + item.ubicac_fisica,
              };
            })}
            onChange={(e) => setSelectedUbicacion(e)}
          />
          <Input
            placeholder="Dni Trabajador"
            style={{
              width: "33%",
            }}
            allowClear
            value={usuario || undefined}
            onChange={(e) => setUsuario(e.target.value?.trim())}
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
              allowClear
              onChange={(e) => setCodigoSBN(e.target.value?.trim())}
              value={codigoSBN || undefined}
            />
            <Input
              placeholder="Serie"
              style={{
                width: "50%",
              }}
              allowClear
              onChange={(e) => setSerie(e.target.value?.trim())}
              value={serie || undefined}
            />

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
          </Flex>
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
              onClick={realizarBusqueda}
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
          </Flex>
        </Flex>
      </div>
      <section
        style={{
          backgroundColor: "white",
          borderRadius: "10px",
          marginTop: "20px",
          padding: "15px",
          border: "1px solid rgb(228, 228, 228)",
        }}
      >
        <Table
          columns={columns}
          dataSource={bienes?.map((item, index) => ({
            ...item,
            key: item.id || index,
          }))}
          className="custom-header-table"
          expandable={{
            expandedRowRender: (record) => expandedRowRenderPrueba(record),
          }}
        />
      </section>
    </>
  );
};

export default ConsultaSiga;
