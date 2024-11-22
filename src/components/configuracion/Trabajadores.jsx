import { Button, Flex, Table, notification, Input } from "antd";
import Search from "antd/es/input/Search";
import React, { useEffect, useState } from "react";
import ModalJefes from "./ModalJefes";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import ModalTrabajadores from "./ModalTrabajadores";

const Trabajadores = ({ setTitle }) => {
  const [trabajadores, setTrabajadores] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // Estado para la búsqueda
  const [modal, setModal] = useState(false);
  const [edit, setEdit] = useState(null);
  const [filteredData, setFilteredData] = useState(trabajadores);

  useEffect(() => {
    setTitle("Trabajadores");
    getTrabajadores();
  }, []);

  const getTrabajadores = async () => {
    const response = await fetch(`${process.env.REACT_APP_BASE}/trabajadores/all`);

    if (response.ok) {
      const info = await response.json();
      setTrabajadores(info); // Guardar los bienes en el estado si la respuesta es exitosa
      setFilteredData(info)
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
      title: "DNI",
      dataIndex: "dni",
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

        </Flex>
      ),
    },
  ];

  const handleEdit = (value) => {
    setEdit(value);
    setModal(true);
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    const filterData = trabajadores.filter(item =>
      item?.nombre?.toLowerCase()?.includes(value.toLowerCase()) ||
      item?.nombre?.toLowerCase()?.includes(value.toLowerCase())
    );
    setFilteredData(filterData);
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
      <section style={{ display: "flex", justifyContent: "space-between" }}>
        <Input style={{ width: "300px" }} placeholder="Buscar por nombre o dni" onChange={handleSearch} />
        <div style={{ display: "flex", justifyContent: "flex-start" }}>
          <Button onClick={() => setModal(true)}>Registrar</Button>
        </div>
      </section>
      <Table
        style={{ marginTop: "20px" }}
        columns={columns}
        dataSource={filteredData}
        className="custom-header-table"
      />

      {modal && (
        <ModalTrabajadores modal={modal} setModal={setModal} jefes={getTrabajadores} edit={edit} setEdit={setEdit} />
      )}
    </div>
  )
}

export default Trabajadores