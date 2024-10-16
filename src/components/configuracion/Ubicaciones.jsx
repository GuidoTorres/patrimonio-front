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

  useEffect(() => {
    setTitle("Ubicaciones");
    getUbicaciones();
  }, []);

  const getUbicaciones = async () => {
    const response = await fetch(`${process.env.REACT_APP_BASE}/ubicaciones/editar`);

    if (response.ok) {
      const info = await response.json();
      setUbicaciones(info); // Guardar los bienes en el estado si la respuesta es exitosa
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
        dataIndex: "nombre_sede",
        align: "center",
      },
    {
      title: "ÁREA",
      dataIndex: "nombre_dependencia",
      align: "center",
    },

    {
      title: "NOMBRE",
      dataIndex: "ubicacion",
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
        `${process.env.REACT_APP_BASE}/usuarios/${value.id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        notification.success({
          message: "Jefe de grupo eliminado con éxito.",
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

          <Button onClick={() => setModal(true)}>Registrar</Button>
        </div>
      </section>
      <Table
        style={{ marginTop: "20px" }}
        columns={columns}
        dataSource={ubicaciones}
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
