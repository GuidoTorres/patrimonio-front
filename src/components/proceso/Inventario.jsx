import { Flex, Input, Image, Empty, message, Tag, Select, Button } from "antd";
import React, { useEffect, useRef, useState } from "react";
import FormularioBien from "./FormularioBien";
import "./styles/inventario.css";

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
};
const Inventario = ({ setTitle }) => {
  const searchInputRef = useRef(null);
  const [state, setState] = useState({
    bienes: null,
    buscar: "",
    isSobrante: false,
    sedes: [],
    dependencias: [],
    ubicaciones: [],
    trabajadores: [],
    sbnSobrante: null,
    mostrarBoton: false,
    filteredTrabajador: null,
  });

  const [ubicacionValues, setUbicacionValues] = useState({
    sede_id: null,
    dependencia_id: null,
    ubicacion_id: null,
  });

  // Computed values instead of using state
  const filteredDependencias = state.dependencias.filter(
    (item) => item.sede_id === ubicacionValues.sede_id
  );

  const filteredUbicaciones = state.ubicaciones.filter(
    (item) => item.dependencia_id === ubicacionValues.dependencia_id
  );

  // Initial setup
  useEffect(() => {
    loadStoredValues();
    setTitle("Registro de Bienes");
    fetchInitialData();

    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);
  const debouncedBuscar = useDebounce(state.buscar, 300);
  useEffect(() => {
    if (debouncedBuscar?.length >= 4) {  // Changed to >= 4
      getBienes();
    } else if (debouncedBuscar === '') {
      setState(prev => ({
        ...prev,
        bienes: null,
        isSobrante: false,
        sbnSobrante: null,
        mostrarBoton: false
      }));
    }
  }, [debouncedBuscar]);

  const fetchInitialData = async () => {
    try {
      const [sedesRes, dependenciasRes, ubicacionesRes, trabajadoresRes] =
        await Promise.all([
          fetch(`${process.env.REACT_APP_BASE}/sedes`),
          fetch(`${process.env.REACT_APP_BASE}/dependencias`),
          fetch(`${process.env.REACT_APP_BASE}/ubicaciones`),
          fetch(`${process.env.REACT_APP_BASE}/trabajadores/all`),
        ]);

      const [sedes, dependencias, ubicaciones, trabajadores] =
        await Promise.all([
          sedesRes.json(),
          dependenciasRes.json(),
          ubicacionesRes.json(),
          trabajadoresRes.json(),
        ]);

      setState((prev) => ({
        ...prev,
        sedes,
        dependencias,
        ubicaciones,
        trabajadores,
      }));
    } catch (error) {
      console.error("Error loading initial data:", error);
    }
  };

  const loadStoredValues = () => {
    const storedValues = {
      sede_id: localStorage.getItem("sede_id"),
      dependencia_id: localStorage.getItem("dependencia_id"),
      ubicacion_id: localStorage.getItem("ubicacion_id"),
      trabajador: localStorage.getItem("trabajador_id"),
    };

    if (
      storedValues.sede_id ||
      storedValues.dependencia_id ||
      storedValues.ubicacion_id
    ) {
      setUbicacionValues({
        sede_id: storedValues.sede_id ? Number(storedValues.sede_id) : null,
        dependencia_id: storedValues.dependencia_id
          ? Number(storedValues.dependencia_id)
          : null,
        ubicacion_id: storedValues.ubicacion_id
          ? Number(storedValues.ubicacion_id)
          : null,
      });
    }

    if (storedValues.trabajador) {
      setState((prev) => ({
        ...prev,
        filteredTrabajador: JSON.parse(storedValues.trabajador).dni,
      }));
    }
  };

  const getBienes = async () => {
    try {
      setState((prev) => ({
        ...prev,
        sbnSobrante: null,
        isSobrante: false,
      }));

      const response = await fetch(
        `${process.env.REACT_APP_BASE}/bienes/inventario?sbn=${state.buscar}`
      );

      const data = await response.json();
      if (response.ok) {
        handleSuccessfulBienesResponse(data);
      } else {
        handleFailedBienesResponse(response.status, data);
      }
    } catch (error) {
      console.error("Error fetching bienes:", error);
    }
  };

  const handleSuccessfulBienesResponse = (data) => {
    if (!data.info) {
      setState((prev) => ({ ...prev, isSobrante: true, bienes: null }));
    } else {
      setState((prev) => ({
        ...prev,
        isSobrante: data.info.tipo === "sobrante",
        bienes: data.info,
      }));
    }
  };

  const handleFailedBienesResponse = async (status, data) => {

    if (status === 403) {

      message.warning(data.msg);
    } else if (status === 404) {
      await handleSobranteRegistration();
    } else {
      message.warning(data.msg);
      setState((prev) => ({
        ...prev,
        isSobrante: false,
        mostrarBoton: true,
      }));
    }
  };

  const handleSobranteRegistration = async () => {
    setState((prev) => ({ ...prev, isSobrante: true, bienes: null }));
    message.warning("El bien no fue encontrado, es un sobrante.");

    const ubicacion = state.ubicaciones.find(
      (item) => item.id === Number(localStorage.getItem("ubicacion_id"))
    );

    if (ubicacion) {
      try {
        const response = await fetch(
          `${
            process.env.REACT_APP_BASE
          }/bienes/sobrante/sbn?id_usuario=${localStorage.getItem(
            "usuario"
          )}&id_sede=${localStorage.getItem("sede_id")}&id_ubicacion=${
            ubicacion.tipo_ubicac
          }${ubicacion.ubicac_fisica}`
        );

        const data = await response.json();
        setState((prev) => ({
          ...prev,
          sbnSobrante: response.ok ? data : null,
        }));
      } catch (error) {
        setState((prev) => ({ ...prev, sbnSobrante: null }));
      }
    }
  };

  const handleInputChange = (e) => {
    const hasRequiredFields =
      ubicacionValues.sede_id &&
      ubicacionValues.dependencia_id &&
      ubicacionValues.ubicacion_id &&
      state.filteredTrabajador;

    if (!hasRequiredFields) {
      console.warn(
        "Seleccione todos los campos de ubicación y el responsable."
      );
      return;
    }

    setState((prev) => ({
      ...prev,
      buscar: e?.target?.value || "",
    }));
  };

  const limpiarUbicaciones = () => {
    ["sede_id", "dependencia_id", "ubicacion_id", "trabajador_id"].forEach(
      (key) => localStorage.removeItem(key)
    );

    setUbicacionValues({
      sede_id: null,
      dependencia_id: null,
      ubicacion_id: null,
    });

    setState((prev) => ({
      ...prev,
      filteredTrabajador: null,
      buscar: null,
      bienes: null,
      isSobrante: false,
    }));
  };

  return (
    <>
      <Flex className="inventario-container" gap="10px">
        <Flex gap="5px" style={{ width: "100%" }}>
          <Select
            placeholder="Sedes"
            style={{ width: "25%" }}
            options={state.sedes.map((item) => ({
              label: item.nombre,
              value: item.id,
            }))}
            value={ubicacionValues.sede_id}
            showSearch
            allowClear
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            onChange={(value) => {
              if (value) {
                setUbicacionValues((prev) => ({ ...prev, sede_id: value }));
                localStorage.setItem("sede_id", value);
              } else {
                setUbicacionValues((prev) => ({
                  ...prev,
                  sede_id: null,
                  ubicacion_id: null,
                  dependencia_id: null,
                }));
                ["sede_id", "dependencia_id", "ubicacion_id"].forEach((key) =>
                  localStorage.removeItem(key)
                );
              }
            }}
            popupMatchSelectWidth={false}
          />

          <Select
            placeholder="Dependencias"
            style={{ width: "25%" }}
            options={filteredDependencias.map((item) => ({
              label: item.nombre,
              value: item.id,
            }))}
            value={ubicacionValues.dependencia_id}
            showSearch
            allowClear
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            onChange={(value) => {
              if (value) {
                setUbicacionValues((prev) => ({
                  ...prev,
                  dependencia_id: value,
                }));
                localStorage.setItem("dependencia_id", value);
                localStorage.setItem("dependencia_tipo_ubicac", value);
              } else {
                setUbicacionValues((prev) => ({
                  ...prev,
                  dependencia_id: null,
                  ubicacion_id: null,
                }));
                localStorage.removeItem("dependencia_id");
                localStorage.removeItem("ubicacion_id");
              }
            }}
            popupMatchSelectWidth={false}
          />

          <Select
            placeholder="Ubicaciones"
            style={{ width: "25%" }}
            options={filteredUbicaciones.map((item) => ({
              label: item.nombre,
              value: item.id,
            }))}
            value={ubicacionValues.ubicacion_id}
            showSearch
            allowClear
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            onChange={(value) => {
              if (value) {
                setUbicacionValues((prev) => ({
                  ...prev,
                  ubicacion_id: value,
                }));
                localStorage.setItem("ubicacion_id", value);
              } else {
                setUbicacionValues((prev) => ({
                  ...prev,
                  ubicacion_id: null,
                }));
                localStorage.removeItem("ubicacion_id");
              }
            }}
            popupMatchSelectWidth={false}
          />

          <Select
            placeholder="Responsable"
            style={{ width: "25%" }}
            options={state.trabajadores.map((item) => ({
              label: item.nombre,
              value: item.dni,
            }))}
            value={state.filteredTrabajador}
            showSearch
            allowClear
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            onChange={(value) => {
              if (value) {
                const selectedTrabajador = state.trabajadores.find(
                  (item) => item.dni === value
                );

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
                setState((prev) => ({
                  ...prev,
                  filteredTrabajador: value,
                }));
              } else {
                localStorage.removeItem("trabajador_id");
                setState((prev) => ({
                  ...prev,
                  filteredTrabajador: null,
                }));
              }
            }}
            popupMatchSelectWidth={false}
          />
        </Flex>
      </Flex>

      <Flex
        className="inventario-container"
        gap="10px"
        style={{ marginTop: "10px" }}
      >
        <Flex gap="5px" style={{ width: "100%" }}>
          <Input
            placeholder="Buscar Bien"
            style={{ width: "250px" }}
            onChange={handleInputChange}
            onClear={() => {
              setState((prev) => ({
                ...prev,
                mostrarBoton: false,
                bienes: null, // Clear bienes data
                isSobrante: false, // Reset sobrante status
                sbnSobrante: null, // Clear sobrante data
                buscar: "", // Clear search value
              }));
            }}
            allowClear
            ref={searchInputRef}
            value={state.buscar}
            onKeyDown={(e) => e.key === "Enter" && getBienes()}
          />

          {state.isSobrante ? (
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
          ) : state.bienes?.estado === "1" ? (
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
          ) : state.bienes?.estado === "2" ? (
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

        {/* {state.mostrarBoton && (
          <Button
            onClick={handleSobranteRegistration}
            style={{ backgroundColor: "#4DA362", color: "white" }}
          >
            Registrar Sobrante
          </Button>
        )} */}
      </Flex>

      <Flex justify="flex-start" className="inventario-content" gap="10px">
        {!Array.isArray(state.bienes) || state.bienes.length > 0 ? (
          state.bienes === null && state.isSobrante ? (
            <div
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: "white",
              }}
            >
              <FormularioBien
                data={state.bienes}
                setBienes={(bienes) =>
                  setState((prev) => ({ ...prev, bienes }))
                }
                sbn={state.buscar}
                sobrante={state.isSobrante}
                ubicacion={ubicacionValues}
                trabajador={state.filteredTrabajador}
                setBuscar={(buscar) =>
                  setState((prev) => ({ ...prev, buscar }))
                }
                searchInputRef={searchInputRef}
                sbnSobrante={state.sbnSobrante}
                setIsSobrante={(isSobrante) =>
                  setState((prev) => ({ ...prev, isSobrante }))
                }
              />
            </div>
          ) : state.bienes !== null ? (
            <FormularioBien
              data={state.bienes}
              setBienes={(bienes) => setState((prev) => ({ ...prev, bienes }))}
              sbn={state.buscar}
              sobrante={state.isSobrante}
              ubicacion={ubicacionValues}
              trabajador={state.filteredTrabajador}
              setBuscar={(buscar) => setState((prev) => ({ ...prev, buscar }))}
              searchInputRef={searchInputRef}
              sbnSobrante={state.sbnSobrante}
              setIsSobrante={(isSobrante) =>
                setState((prev) => ({ ...prev, isSobrante }))
              }
            />
          ) : null
        ) : null}
      </Flex>
    </>
  );
};

export default Inventario;
