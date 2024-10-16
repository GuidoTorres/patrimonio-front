import { Button, Flex, Input, Table, notification } from "antd";
import Search from "antd/es/input/Search";
import React, { useEffect, useState } from "react";
import ModalUsuarios from "./ModalUsuarios";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

const Usuarios = ({ setTitle }) => {
  const [usuarios, setUsuarios] = useState([]);
  const [modal, setModal] = useState(false);
  const [edit, setEdit] = useState(null);

  useEffect(() => {
    setTitle("Usuarios");
    getUsuarios();
  }, []);

  const getUsuarios = async () => {
    const response = await fetch(`${process.env.REACT_APP_BASE}/usuarios`);

    if (response.ok) {
      const info = await response.json();
      setUsuarios(info.data); // Guardar los bienes en el estado si la respuesta es exitosa
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      align: "center",
    },
    {
      title: "NOMBRE DE USUARIO",
      dataIndex: "nombre_usuario",
      align: "center",
    },
    {
      title: "ROL",
      render: (_, record) => record?.role?.nombre,
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
        getUsuarios(); // Actualiza la lista tras eliminar
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
        <div style={{ display: "flex", justifyContent: "flex-start" }}>

          <Button onClick={() => setModal(true)}>Registrar</Button>
        </div>
      </section>
      <Table
        style={{ marginTop: "20px" }}
        columns={columns}
        dataSource={usuarios}
        className="custom-header-table"
      />

      {modal && <ModalUsuarios modal={modal} setModal={setModal} usuarios={getUsuarios} edit={edit} setEdit={setEdit}/>}
    </div>
  );
};

export default Usuarios;
