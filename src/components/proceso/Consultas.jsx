import React, { useEffect, useState } from "react";
import {
  Flex,
  Select,
  Button,
  Input,
  Table,
  Descriptions,
  Tag,
  Image,
  message,
  Popconfirm,
} from "antd";
import { EditOutlined, CloseOutlined } from "@ant-design/icons";
import ModalEditarBien from "../consultas/ModalEditarBien";
const Consultas = ({ setTitle }) => {
  useEffect(() => {
    setTitle("Consulta Bienes Inventariados");
    getBienes();
    getSedes();
    getUbicaciones();
    getTrabajador();
    getDependencias()
  }, []);

  const [bienes, setBienes] = useState([]);
  const [sedes, setSedes] = useState([]);
  const [dependencias, setDependencias] = useState([]);

  const [ubicaciones, setUbicaciones] = useState([]);
  const [filters, setFilters] = useState([]);
  const [trabajadores, setTrabajadores] = useState([]);
  const [dni, setDni] = useState(null);
  const [usuario, setUsuario] = useState("");
  const [edit, setEdit] = useState(null);
  const [modal, setModal] = useState(false);
  const getBienes = async () => {
    const usuario = localStorage.getItem("usuario");

    const response = await fetch(
      `${process.env.REACT_APP_BASE}/bienes/inventariados?usuario_id=${usuario}`
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
  const getDependencias = async () => {
    const response = await fetch(`${process.env.REACT_APP_BASE}/dependencias`);

    if (response.ok) {
      const info = await response.json();
      setDependencias(info); // Guardar los bienes en el estado si la respuesta es exitosa
    }
  };
  const getUbicaciones = async () => {
    const response = await fetch(`${process.env.REACT_APP_BASE}/ubicaciones`);

    if (response.ok) {
      const info = await response.json();
      setUbicaciones(info); // Guardar los bienes en el estado si la respuesta es exitosa
    }
  };

  const downloadExcelInventariados = async () => {
    const usuario = localStorage.getItem("usuario");
    const queryParams = buildQueryParams();
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE}/bienes/inventariados/excel?${queryParams}&usuario_id=${usuario}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        // Convierte la respuesta en un Blob para manejar el archivo
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        // Crear un enlace para descargar el archivo
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "Bienes.xlsx"); // El nombre del archivo que se descargará
        document.body.appendChild(link);
        link.click();

        // Limpia el enlace después de la descarga
        link.parentNode.removeChild(link);
      } else {
        const errorMsg = await response.json();
        message.error("Error al generar Excel");
      }
    } catch (error) {
      message.error("Error");
      console.error("Error downloading Excel:", error);
    }
  };

  const columns = [
    {
      title: "COD. SBN",
      render: (_, record) => (
        <Flex justify="left" align="center" gap={"2px"}>
          <Image
            dataSource={record.foto}
            style={{ width: "20px", heigth: "20px" }}
          />
          <p>{record?.sbn}</p>
        </Flex>
      ),
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
      title: "TIPO",
      render: (_, record) =>
        record.tipo === "activo" ? (
          <Tag color="blue">Activo</Tag>
        ) : record.tipo === "sobrante" ? (
          <Tag color="gold">Sobrante</Tag>
        ) : (
          <Tag color="volcano">Faltante</Tag>
        ),
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
    {
      title: "ACCIONES",
      render: (_, record) => (
        <Flex gap={"2px"} justify="center" align="center">
          <Button onClick={() => handleEditar(record)}>
            <EditOutlined />
          </Button>

          <Popconfirm
            title="Eliminar Bien"
            description=""
            okText="Si"
            cancelText="No"
            onConfirm={() => handleDelete(record)}

          >
            <Button>
              <CloseOutlined />
            </Button>
          </Popconfirm>
        </Flex>
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

  const handleDelete = async (value) => {
    const id = value.id;
    const response = await fetch(
      `${process.env.REACT_APP_BASE}/bienes/eliminar?id=${id}`
    );

    if (response.ok) {
      const info = await response.json();
      getBienes();
      message.success(info.msg);
    }
  };

  const handleEditar = (record) => {
    setEdit(record);
    setModal(true);
  };

  // Construir la URL con los filtros dinámicos
  const buildQueryParams = () => {
    const query = new URLSearchParams();

    Object.keys(filters).forEach((key) => {
      if (filters[key]) {
        query.append(key, filters[key]);
      }
    });
    query.append("inventariado", true);

    return query.toString();
  };

  const handleSearch = async () => {
    const usuario = localStorage.getItem("usuario");

    // Construir los parámetros de la consulta
    const queryParams = buildQueryParams();

    // Añadir usuario_id al queryParams
    const url = `${process.env.REACT_APP_BASE}/bienes/consulta?${queryParams}&usuario_id=${usuario}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log(data);

      setBienes(data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const expandedRowRenderPrueba = (record) => {
    const items = [
      {
        key: "1",
        label: "Detalles",
        children: record.detalles ? record.detalles : "SIN DETALLES",
      },
      {
        key: "2",
        label: "Observaciones",
        children: record.observacion ? record.observacion : "SIN OBSERVACIONES",
      },
      {
        key: "3",
        label: "Cod. Ubicación",
        children:
          record?.ubicacione?.tipo_ubicac +
          "" +
          record?.ubicacione?.ubicac_fisica +
          "-" +
          record?.ubicacione?.nombre,
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
              width: "25%",
            }}
            name="sede_id"
            value={filters.sede_id}
            showSearch
            popupMatchSelectWidth={false}
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
          {/* <Select
            style={{
              width: "25%",
            }}
            placeholder="Dependencias"
            className="form-item-input"
            onChange={(e) => handleInputChange("depedencia_id", e)}
            showSearch
            popupMatchSelectWidth={false}
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            allowClear
            options={dependencias?.map((item) => {
              return {
                value: item?.id,
                label: item?.nombre,
              };
            })}
          /> */}
          <Select
            placeholder="Ubicaciones"
            style={{
              width: "25%",
            }}
            options={ubicaciones.map((item) => {
              return {
                label: item.nombre,
                value: item.id,
              };
            })}
            showSearch
            optionFilterProp="children"
            popupMatchSelectWidth={false}
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            allowClear
            name="ubicacion_id"
            value={filters.ubicacion_id}
            onChange={(e) => handleInputChange("ubicacion_id", e)}
          />
          <Select
            placeholder="Trabajador"
            className="form-item-input"
            onChange={(e) => handleInputChange("dni", e)}
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            allowClear
            options={trabajadores?.map((item) => {
              return { label: item.nombre, value: item.dni };
            })}
            value={filters.dni}
            style={{
              width: "25%",
            }}
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
              onChange={(e) => handleInputChange("sbn", e.target.value?.trim())}
            />
            <Input
              placeholder="Serie"
              style={{
                width: "50%",
              }}
              name="serie"
              value={filters.serie}
              onChange={(e) =>
                handleInputChange("serie", e.target.value?.trim())
              }
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
              onClick={downloadExcelInventariados}
            >
              {" "}
              Excel
            </Button>
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
      {modal && (
        <ModalEditarBien
          modal={modal}
          setModal={setModal}
          edit={edit}
          setEdit={setEdit}
          getBienes={getBienes}
        />
      )}
    </>
  );
};

export default Consultas;
