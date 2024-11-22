import { Button, Flex, Input, Table, notification } from "antd";
import Search from "antd/es/input/Search";
import React, { useEffect, useState } from "react";
import ModalUsuarios from "./ModalUsuarios";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import ModalUbicaciones from "./ModalUbicaciones";

const Ubicaciones = ({ setTitle }) => {
  const [ubicaciones, setUbicaciones] = useState([]);
  const [modal, setModal] = useState(false);
  const [edit, setEdit] = useState(null);
  const [search, setSearch] = useState([]);

  useEffect(() => {
    setTitle("Ubicaciones");
    getUbicaciones();
  }, []);

  const getUbicaciones = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_BASE}/ubicaciones/editar`
    );

    if (response.ok) {
      const info = await response.json();
      setUbicaciones(info); // Guardar los bienes en el estado si la respuesta es exitosa
      setSearch(info)
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      align: "center",
    },
    {
      title: "SEDE",
      render: (_, record) => record?.sede_id + " - " + record?.nombre_sede,
      align: "center",
    },
    {
      title: "ÁREA",
      render: (_, record) =>
        record?.tipo_ubicac +
        "" +
        record?.ubicac_fisica +
        " - " +
        record?.nombre_dependencia,
      align: "center",
    },

    {
      title: "NOMBRE",
      render: (_, record) =>
        record?.tipo_ubicac +
        "" +
        record?.ubicac_fisica +
        " - " +
        record?.nombre,
      align: "center",
    },

    {
      title: "ACCIONES",
      align: "center",
      render: (_, record) => (
        <Flex justify="center" gap={"4px"}>
          <Button onClick={() => handleEdit(record)}>
            <EditOutlined />
          </Button>
          <Button onClick={() => handleDelete(record)}>
            <DeleteOutlined />
          </Button>{" "}
        </Flex>
      ),
    },
  ];

  const handleEdit = (value) => {
    setEdit(value);
    setModal(true);
  };

  const handleDelete = async (value) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE}/ubicaciones/${value.id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        notification.success({
          message: "Ubicación eliminada con éxito.",
        });
        getUbicaciones(); // Actualiza la lista tras eliminar
      } else {
        const error = await response.json();
        notification.error({
          message: "No se pudo eliminar",
          description: error.msg,
        });
      }
    } catch (error) {
      notification.error({
        message: "Error",
        description: error.message,
      });
    }
  };

  const handleSearch = (e) => {
    console.log(e);
    if (e.target.value) {
      const searchTerm = e.target.value?.toLowerCase(); // Convertir la búsqueda a minúsculas
  
      // Filtrar las ubicaciones
      const filterData = ubicaciones.filter((item) => {
        return (
          item.nombre_sede.toLowerCase().includes(searchTerm) ||
          item.nombre_dependencia.toLowerCase().includes(searchTerm) ||
          item.ubicacion.toLowerCase().includes(searchTerm)
        );
      });
  
      setSearch(filterData);
    } else {
      // Si no hay término de búsqueda, mostrar todas las ubicaciones
      setSearch(ubicaciones);
    }
  };
  

  return (
    <div
      style={{
        backgroundColor: "white",
        border: "1px solid lightgrey",
        padding: "15px",
        borderRadius: "8px",
        height: "100%",
      }}
    >
      <section>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Search
            style={{ width: "250px" }}
            placeholder="Ubicaciones"
            onChange={handleSearch}
            allowClear
          />
          <Button onClick={() => setModal(true)}>Registrar</Button>
        </div>
      </section>
      <Table
        style={{ marginTop: "20px" }}
        columns={columns}
        dataSource={search}
        className="custom-header-table"
      />

      {modal && (
        <ModalUbicaciones
          modal={modal}
          setModal={setModal}
          ubicaciones={getUbicaciones}
          edit={edit}
          setEdit={setEdit}
        />
      )}
    </div>
  );
};

export default Ubicaciones;
