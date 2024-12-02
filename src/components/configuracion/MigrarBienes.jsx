import {
  Button,
  Flex,
  Input,
  Select,
  Typography,
  Table,
  Transfer,
  message,
} from "antd";
import React, { useEffect, useRef, useState } from "react";

const MigrarBienes = ({ setTitle }) => {
  useEffect(() => {
    setTitle("Migrar Bienes");
  }, []);

  // Estados para origen y destino
  const [trabajadores, setTrabajadores] = useState([]);
  const [sedes, setSedes] = useState([]);
  const [dependencias, setDependencias] = useState([]);
  const [ubicaciones, setUbicaciones] = useState([]);
  const [etiquetas, setEtiquetas] = useState([]);
  const [targetKeys, setTargetKeys] = useState([]);

  const [origin, setOrigin] = useState({
    dni: null,
    sedeId: null,
    dependenciaId: null,
    ubicacionId: null,
  });

  const [destination, setDestination] = useState({
    dni: null,
    sedeId: null,
    dependenciaId: null,
    ubicacionId: null,
  });

  const [selectedData, setSelectedData] = useState([]);

  // Obtener trabajadores
  const getTrabajadores = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_BASE}/trabajadores/all`
    );
    if (response.ok) {
      const data = await response.json();
      setTrabajadores(data);
    }
  };

  // Obtener etiquetas por ubicación de origen
  const getEtiquetas = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_BASE}/bienes/etiquetas?ubicacionId=${origin.ubicacionId}`
    );
    if (response.ok) {
      const data = await response.json();
      setEtiquetas(data);
    }
  };

  const handleOriginChange = (key, value) => {
    setOrigin((prev) => ({ ...prev, [key]: value }));
    if (key === "ubicacionId") {
      getEtiquetas();
    }
  };

  const handleDestinationChange = (key, value) => {
    setDestination((prev) => ({ ...prev, [key]: value }));
  };

  const handleTransferChange = (nextTargetKeys) => {
    // Actualiza los bienes transferidos y agrega la información de destino
    const selectedItems = etiquetas.filter((item) =>
      nextTargetKeys.includes(item.id)
    );

    const enrichedData = selectedItems.map((item) => ({
      ...item,
      trabajadorDestino:
        trabajadores.find((t) => t.dni === destination.dni)?.nombre || "",
      sedeDestino: sedes.find((s) => s.id === destination.sedeId)?.nombre || "",
      dependenciaDestino:
        dependencias.find((d) => d.id === destination.dependenciaId)?.nombre ||
        "",
      ubicacionDestino:
        ubicaciones.find((u) => u.id === destination.ubicacionId)?.nombre || "",
    }));

    setSelectedData(enrichedData);
    setTargetKeys(nextTargetKeys);
  };

  const handleSave = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE}/bienes/migrar`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bienes: selectedData }),
        }
      );

      if (response.ok) {
        message.success("Bienes migrados correctamente.");
      } else {
        message.error("Error al migrar bienes.");
      }
    } catch (error) {
      console.error(error);
      message.error("Error en la conexión.");
    }
  };

  useEffect(() => {
    getTrabajadores();
  }, []);

  const formattedEtiquetas = etiquetas.map((item) => ({
    key: item.id,
    title: item.descripcion,
    ...item,
  }));

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Descripción", dataIndex: "descripcion", key: "descripcion" },
    { title: "SBN", dataIndex: "sbn", key: "sbn" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <h3>Origen</h3>
          <Select
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            allowClear
            placeholder="Trabajador Origen"
            style={{ width: "250px", marginBottom: "10px" }}
            onChange={(value) => handleOriginChange("dni", value)}
            options={trabajadores.map((t) => ({
              label: t.nombre,
              value: t.dni,
            }))}
          />
          <Select
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            allowClear
            placeholder="Sede Origen"
            style={{ width: "250px", marginBottom: "10px" }}
            onChange={(value) => handleOriginChange("sedeId", value)}
            options={sedes.map((s) => ({ label: s.nombre, value: s.id }))}
          />
          <Select
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            allowClear
            placeholder="Dependencia Origen"
            style={{ width: "250px", marginBottom: "10px" }}
            onChange={(value) => handleOriginChange("dependenciaId", value)}
            options={dependencias.map((d) => ({
              label: d.nombre,
              value: d.id,
            }))}
          />
          <Select
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            allowClear
            placeholder="Ubicación Origen"
            style={{ width: "250px", marginBottom: "10px" }}
            onChange={(value) => handleOriginChange("ubicacionId", value)}
            options={ubicaciones.map((u) => ({ label: u.nombre, value: u.id }))}
          />
        </div>
        <div>
          <h3>Destino</h3>
          <Select
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            allowClear
            placeholder="Trabajador Destino"
            style={{ width: "250px", marginBottom: "10px" }}
            onChange={(value) => handleDestinationChange("dni", value)}
            options={trabajadores.map((t) => ({
              label: t.nombre,
              value: t.dni,
            }))}
          />
          <Select
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            allowClear
            placeholder="Sede Destino"
            style={{ width: "250px", marginBottom: "10px" }}
            onChange={(value) => handleDestinationChange("sedeId", value)}
            options={sedes.map((s) => ({ label: s.nombre, value: s.id }))}
          />
          <Select
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            allowClear
            placeholder="Dependencia Destino"
            style={{ width: "250px", marginBottom: "10px" }}
            onChange={(value) =>
              handleDestinationChange("dependenciaId", value)
            }
            options={dependencias.map((d) => ({
              label: d.nombre,
              value: d.id,
            }))}
          />
          <Select
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            allowClear
            placeholder="Ubicación Destino"
            style={{ width: "250px", marginBottom: "10px" }}
            onChange={(value) => handleDestinationChange("ubicacionId", value)}
            options={ubicaciones.map((u) => ({ label: u.nombre, value: u.id }))}
          />
        </div>
      </div>
      <Transfer
        dataSource={formattedEtiquetas}
        targetKeys={targetKeys}
        onChange={handleTransferChange}
        render={(item) => item.descripcion}
        titles={["Disponibles", "Seleccionados"]}
      >
        {({
          direction,
          filteredItems,
          onItemSelect,
          onItemSelectAll,
          selectedKeys: listSelectedKeys,
        }) => {
          const rowSelection = {
            onChange: (selectedRowKeys) =>
              onItemSelectAll(selectedRowKeys, "replace"),
            selectedRowKeys: listSelectedKeys,
          };

          return (
            <Table
              rowSelection={rowSelection}
              columns={columns}
              dataSource={filteredItems}
              size="small"
              pagination={false}
              onRow={(record) => ({
                onClick: () =>
                  onItemSelect(
                    record.key,
                    !listSelectedKeys.includes(record.key)
                  ),
              })}
            />
          );
        }}
      </Transfer>
      <Button type="primary" onClick={handleSave}>
        Guardar Migración
      </Button>
    </div>
  );
};

export default MigrarBienes;
