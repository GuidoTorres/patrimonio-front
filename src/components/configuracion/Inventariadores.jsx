import { Button, Input, Table, notification } from "antd";
import Search from "antd/es/input/Search";
import React, { useEffect, useState } from "react";
import ModalInvetariador from "./ModalInvetariador";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
const Inventariadores = ({ setTitle }) => {
  const [inventariadores, setInventariadores] = useState([]);
  const [modal, setModal] = useState(false);
  const [edit, setEdit] = useState(null);

  useEffect(() => {
    setTitle("Inventariadores");
    getInventariadores();
  }, []);

  const getInventariadores = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_BASE}/inventariadores`
    );

    if (response.ok) {
      const info = await response.json();
      setInventariadores(info); // Guardar los bienes en el estado si la respuesta es exitosa
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
        <>
          <Button onClick={() =>handleEdit(record)}>
            <EditOutlined />
          </Button>
          <Button onClick={()=>handleDelete(record)}>
            <DeleteOutlined />
          </Button>
        </>
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
        `${process.env.REACT_APP_BASE}/inventariadores/${value.id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        notification.success({
          message: "Inventariador eliminado con éxito.",
        });
        getInventariadores(); // Actualiza la lista tras eliminar
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
        dataSource={inventariadores}
        className="custom-header-table"
      />

      {modal && (
        <ModalInvetariador
          modal={modal}
          setModal={setModal}
          edit={edit}
          inventariadores={getInventariadores}
          setEdit={setEdit}
        />
      )}
    </div>
  );
};

export default Inventariadores;
