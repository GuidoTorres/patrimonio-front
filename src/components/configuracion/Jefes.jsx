import { Button, Flex, Table, notification } from "antd";
import Search from "antd/es/input/Search";
import React, { useEffect, useState } from "react";
import ModalJefes from "./ModalJefes";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
const Jefes = ({ setTitle }) => {
  const [jefes, setJefes] = useState([]);
  const [modal, setModal] = useState(false);
  const [edit, setEdit] = useState(null);

  useEffect(() => {
    setTitle("Jefes de Grupo");
    getJefes();
  }, []);

  const getJefes = async () => {
    const response = await fetch(`${process.env.REACT_APP_BASE}/jefes`);

    if (response.ok) {
      const info = await response.json();
      setJefes(info); // Guardar los bienes en el estado si la respuesta es exitosa
    }
  };
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      align: "center",
    },
    {
      title: "NOMBRE",
      dataIndex: "nombre",
      align: "center",
    },
    {
      title: "Grupo",
      render: (_, record) => record?.grupo?.nombre,
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
          <Button onClick={() =>handleDelete(record)}>
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
        `${process.env.REACT_APP_BASE}/jefes/${value.id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        notification.success({
          message: "Jefe de grupo eliminado con éxito.",
        });
        getJefes(); // Actualiza la lista tras eliminar
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
          {/* <Search
            placeholder="input search text"
            style={{
              width: 200,
            }}
            allowClear
          /> */}
          <Button onClick={() => setModal(true)}>Registrar</Button>
        </div>
      </section>
      <Table
        style={{ marginTop: "20px" }}
        columns={columns}
        dataSource={jefes}
        className="custom-header-table"
      />

      {modal && (
        <ModalJefes modal={modal} setModal={setModal} jefes={getJefes} edit={edit} setEdit={setEdit}/>
      )}
    </div>
  );
};

export default Jefes;
