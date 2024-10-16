import { Flex, Input, Image, Empty, message, Tag, Select, Button } from "antd";
import React, { useEffect, useRef, useState } from "react";
import FormularioBien from "./FormularioBien";
import "./styles/inventario.css";

const { Search } = Input;
const Inventario = ({ setTitle }) => {
  const searchInputRef = useRef(null); // Crear una referencia

  useEffect(() => {
    // Asignar el foco al input cuando el componente se monte
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);
  const [bienes, setBienes] = useState(null);
  const [buscar, setBuscar] = useState("");
  const [isSobrante, setIsSobrante] = useState(false);
  const [sedes, setSedes] = useState([]);
  const [dependencias, setDependencias] = useState([]);
  const [ubicaciones, setUbicaciones] = useState([]);
  const [ubicacionValues, setUbicacionValues] = useState({
    sede_id: null,
    dependencia_id: null,
    ubicacion_id: null,
  });
  const [filteredDependencias, setFilteredDependencias] = useState([]);
  const [filteredUbicaciones, setFilteredUbicaciones] = useState([]);
  const [trabajadores, setTrabajadores] = useState([]);
  const [filteredTrabajador, setFilteredTrabajador] = useState(null);
  useEffect(() => {
    const storedSede = localStorage.getItem("sede_id");
    const storedDependencia = localStorage.getItem("dependencia_id");
    const storedUbicacion = localStorage.getItem("ubicacion_id");
    const storedTrabajador = localStorage.getItem("trabajador_id");
    if (storedSede) {
      setUbicacionValues((value) => ({
        ...value,
        sede_id: Number(storedSede),
      }));
    }

    if (storedDependencia) {
      setUbicacionValues((value) => ({
        ...value,
        dependencia_id: Number(storedDependencia),
      }));
    }

    if (storedUbicacion) {
      setUbicacionValues((value) => ({
        ...value,
        ubicacion_id: Number(storedUbicacion),
      }));
    }

    if (storedTrabajador) {
      let trabajador = JSON.parse(storedTrabajador);
      setFilteredTrabajador(trabajador.dni);
    }
  }, []);
  useEffect(() => {
    setTitle("Registro de Bienes");
  }, []);

  useEffect(() => {
    getSedes();
    getDependencias();
    getUbicaciones();
    getTrabajador();
  }, []);

  useEffect(() => {
    if (buscar !== "") {
      getBienes();
    } else {
      limpiarData();
    }
  }, [buscar]);

  const getBienes = async () => {
    if (buscar !== "" && buscar?.length === 12) {
      const response = await fetch(
        `${process.env.REACT_APP_BASE}/bienes/inventario?sbn=${buscar}`
      );

      const info = await response.json(); // Asegúrate de obtener la data

      if (response.ok) {
        // Si no hay bienes en la respuesta, entonces es sobrante
        if (!info.info) {
          setIsSobrante(true);
          setBienes(null);
        } else {
          setIsSobrante(false);
          setBienes(info.info); // Guardar los bienes en el estado si se encuentran
        }
      } else {
        // Manejo de otros errores, como el 404 o el 403
        if (response.status === 403) {
          message.warning("El bien ya ha sido inventariado.");
        } else if (response.status === 404) {
          // Aquí lo tratamos como un sobrante
          setIsSobrante(true);
          setBienes(null);
          message.warning("El bien no fue encontrado, es un sobrante.");
        } else {
          setIsSobrante(false);
          message.error("Hubo un error al buscar el bien.");
        }
      }
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

  useEffect(() => {
    if (ubicacionValues.sede_id && dependencias.length > 0) {
      const filtered = dependencias.filter(
        (item) => item.sede_id === ubicacionValues.sede_id
      );
      setFilteredDependencias(filtered); // Actualiza las dependencias filtradas
    }

    if (ubicacionValues.dependencia_id && ubicaciones.length > 0) {
      const filtered = ubicaciones.filter(
        (item) => item.dependencia_id === ubicacionValues.dependencia_id
      );
      setFilteredUbicaciones(filtered); // Actualiza las ubicaciones filtradas
    }
  }, [
    ubicacionValues.sede_id,
    ubicacionValues.dependencia_id,
    dependencias,
    ubicaciones,
  ]);

  const limpiarData = async () => {
    setBienes(null);
  };

  const handleInputChange = (e) => {
    if (
      ubicacionValues.sede_id !== "" &&
      ubicacionValues.dependencia_id !== "" &&
      ubicacionValues.ubicacion_id
    ) {
      const newValue = e.target.value;
      setBuscar(newValue);
    } else {
      message.warning("Seleccione todos los campos de ubicación.");
    }

    if (e === "") {
      setBuscar("");
    }
  };

  const limpiarUbicaciones = () => {
    localStorage.removeItem("sede_id"); // Eliminar del localStorage
    localStorage.removeItem("dependencia_id"); // Eliminar del localStorage
    localStorage.removeItem("ubicacion_id"); // Eliminar del localStorage
    localStorage.removeItem("trabajador_id"); // Eliminar del localStorage

    setUbicacionValues({
      sede_id: null,
      dependencia_id: null,
      ubicacion_id: null,
    });
    setFilteredTrabajador(null);
    setBuscar(null);
    setBienes(null);
    setIsSobrante(false);
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
  const registrarSobrante = () => {
    setBienes([]);
    setIsSobrante(true);
  };
  return (
    <>
      <Flex className="inventario-container" gap={"10px"}>
        <Flex gap={"5px"} style={{ width: "100%" }}>
          <Select
            placeholder="Sedes"
            style={{ width: "20%" }}
            options={sedes.map((item) => {
              return {
                label: item.nombre,
                value: item.id,
              };
            })}
            value={ubicacionValues?.sede_id || undefined}
            showSearch
            allowClear
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            onChange={(e) => {
              setUbicacionValues((value) => ({ ...value, sede_id: e }));
              localStorage.setItem("sede_id", e); // Guardar en localStorage
            }}
            popupMatchSelectWidth={false}
          />
          <Select
            placeholder="Dependencias"
            style={{ width: "20%" }}
            options={filteredDependencias.map((item) => {
              return {
                label: item.nombre,
                value: item.id,
              };
            })}
            popupMatchSelectWidth={false}
            allowClear
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            onChange={(e) => {
              setUbicacionValues((value) => ({ ...value, dependencia_id: e }));
              localStorage.setItem("dependencia_id", e); // Guardar en localStorage
            }}
            value={ubicacionValues?.dependencia_id || undefined}
          />
          <Select
            placeholder="Ubicaciones"
            style={{ width: "20%" }}
            options={filteredUbicaciones.map((item) => {
              return {
                label: item.nombre,
                value: item.id,
              };
            })}
            popupMatchSelectWidth={false}
            allowClear
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            onChange={(e) => {
              setUbicacionValues((value) => ({ ...value, ubicacion_id: e }));
              localStorage.setItem("ubicacion_id", e); // Guardar en localStorage
            }}
            value={ubicacionValues?.ubicacion_id || undefined}
          />
          <Select
            placeholder="Trabajador"
            style={{ width: "20%" }}
            options={trabajadores.map((item) => {
              return {
                label: item.nombre,
                value: item.dni,
              };
            })}
            popupMatchSelectWidth={false}
            allowClear
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            onChange={(value) => {
              // Asegurarnos de que el valor no sea nulo o indefinido
              if (value) {
                // Buscar el trabajador seleccionado para obtener el nombre
                const selectedTrabajador = trabajadores.find(
                  (item) => item.dni === value
                );

                // Guardar tanto el nombre como el DNI en localStorage
                if (selectedTrabajador) {
                  localStorage.setItem(
                    "trabajador_id",
                    JSON.stringify({
                      dni: selectedTrabajador.dni,
                      nombre: selectedTrabajador.nombre,
                      id: selectedTrabajador.id,
                    })
                  );
                }

                // Actualizar el estado con el DNI seleccionado
                setFilteredTrabajador(value);
              }
            }}
            value={filteredTrabajador}
          />
        </Flex>
      </Flex>

      <Flex
        className="inventario-container"
        gap={"10px"}
        style={{ marginTop: "10px" }}
      >
        <Flex gap={"5px"} style={{ width: "100%" }}>
          <Search
            placeholder="Buscar Bien"
            style={{ width: "20%" }}
            onChange={handleInputChange}
            allowClear
            ref={searchInputRef}
            value={buscar}
          />
          {isSobrante ? (
            <Tag
              style={{
                fontSize: "15px",
                padding: "5px",
                height: "auto",
              }}
              color="gold"
            >
              Sobrante
            </Tag>
          ) : bienes?.estado === "1" ? (
            <Tag
              style={{
                fontSize: "18px",
                padding: "5px",
                height: "auto",
              }}
              color="green"
            >
              Activo
            </Tag>
          ) : bienes?.estado === "2" ? (
            <Tag
              style={{
                fontSize: "18px",
                padding: "5px",
                height: "auto",
              }}
              color="volcano"
            >
              Baja
            </Tag>
          ) : null}
        </Flex>
        <Button
          onClick={limpiarUbicaciones}
          style={{ backgroundColor: "#4DA362", color: "white" }}
        >
          Limpiar Filtros
        </Button>
        <Button
          onClick={registrarSobrante}
          style={{ backgroundColor: "#4DA362", color: "white" }}
        >
          Registrar Sobrante
        </Button>
      </Flex>

      <Flex justify="flex-start" className="inventario-content" gap={"10px"}>
        {bienes === null || isSobrante ? (
          <div
            style={{ width: "100%", height: "100%", backgroundColor: "white" }}
          >
            {isSobrante ? (
              <FormularioBien
                data={{}}
                setBienes={setBienes}
                sbn={buscar}
                sobrante={isSobrante}
              /> // Mostrar el formulario vacío
            ) : null}
          </div>
        ) : (
          <>
            <FormularioBien
              data={bienes}
              setBienes={setBienes}
              sbn={buscar}
              sobrante={isSobrante}
              ubicacion={ubicacionValues}
              trabajador={filteredTrabajador}
              setBuscar={setBuscar}
              searchInputRef={searchInputRef}
            />
          </>
        )}
      </Flex>
    </>
  );
};

export default Inventario;
