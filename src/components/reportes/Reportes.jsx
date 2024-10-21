import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { Row, Col, Card, Statistic, Tabs, Typography, Flex } from "antd";
import Grafico from "./Grafico";

const socket = io("http://localhost:3006"); // Conectar a Socket.IO

const Reportes = ({ setTitle }) => {
  useEffect(() => {
    setTitle("Reportes");
  }, []);
  const [bienes, setBienes] = useState([]); // Estado para almacenar el número de bienes inventariados
  const [actualizacion, setActualizacion] = useState(null); // Estado para mostrar las actualizaciones en tiempo real
  const [estadisticas, setEstadisticas] = useState({});
  useEffect(() => {
    // Solicitar los bienes inventariados al montar el componente
    fetch(`${process.env.REACT_APP_BASE}/bienes/inventariador`)
      .then((response) => response.json())
      .then((data) => {
        setBienes(data.data); // Inicializar con el número de bienes inventariados
      })
      .catch((error) => console.error("Error fetching bienes:", error));

    // Escuchar cuando un bien ha sido registrado o actualizado
    socket.on("bien-actualizado", (data) => {
      console.log("Bien actualizado:", data);

      // Actualizar el contador con el valor más reciente del backend
      const updatedBienes = bienes.map((item) => {
        if (item.usuario?.id === data.bien.usuario_id) {
          return { ...item, total_bienes: item.total_bienes + 1 }; // Incrementar el conteo del inventariador
        }
        return item;
      });

      setBienes(updatedBienes); // Actualizar la lista de bienes con el nuevo conteo
      setActualizacion(data.bien); // Mostrar la última actualización
    });

    // Limpiar la conexión al desmontar el componente
    return () => {
      socket.disconnect();
    };
  }, []); // Asegúrate de que `bienes` esté en la lista de dependencias

  useEffect(() => {
    getEstadisticas();
  }, []);
  const getEstadisticas = async () => {
    // Usar Promise.all para ejecutar las consultas en paralelo
    const [
      responseTipo,
      responseUso,
      responseSede,
      responseEstado,
      responseContador,
    ] = await Promise.all([
      fetch(`${process.env.REACT_APP_BASE}/estadisticas/tipo`),
      fetch(`${process.env.REACT_APP_BASE}/estadisticas/uso`),
      fetch(`${process.env.REACT_APP_BASE}/estadisticas/sede`),
      fetch(`${process.env.REACT_APP_BASE}/estadisticas/estado`),
      fetch(`${process.env.REACT_APP_BASE}/bienes/estadisticas`),
    ]);

    // Asegurarse de que todas las respuestas sean exitosas
    if (
      !responseTipo.ok ||
      !responseUso.ok ||
      !responseSede.ok ||
      !responseEstado.ok ||
      !responseContador.ok
    ) {
      throw new Error("Error fetching one or more of the statistics data");
    }

    // Parsear las respuestas a JSON
    const [dataTipo, dataUso, dataSede, dataEstado, contadores] =
      await Promise.all([
        responseTipo.json(),
        responseUso.json(),
        responseSede.json(),
        responseEstado.json(),
        responseContador.json(),
      ]);

    // Combinar toda la información o devolverla por separado
    const data = {
      tipo: dataTipo,
      uso: dataUso,
      sede: dataSede,
      estado: dataEstado,
      contador: contadores,
    };

    setEstadisticas(data);

    // Puedes retornar esta información para usarla en tu aplicación
  };

  const items = [
    {
      key: "1",
      label: "Estadisticas",
      children: (
        <Flex gap={"10px"} vertical style={{ marginTop: "100px" }}>
          <Row gutter={16}>
            <Col span={12}>
              <Card bordered={false}>
                <Statistic
                  title="Total de Bienes"
                  value={estadisticas?.contador?.total}
                  valueStyle={{ color: "#3f8600" }}
                />
              </Card>
            </Col>
            <Col span={12}>
            <Card bordered={false}>
                <Statistic
                  title="Por inventariar"
                  value={estadisticas?.contador?.faltan}
                  valueStyle={{ color: "#3f8600" }}
                />
              </Card>

            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
            <Card bordered={false}>
                <Statistic
                  title="Inventariados"
                  value={estadisticas?.contador?.inventariados}
                  valueStyle={{ color: "#3f8600" }}
                />
              </Card>

            </Col>
            <Col span={12}>
            <Card bordered={false}>
                <Statistic
                  title="Activos"
                  value={estadisticas?.contador?.activos}
                  valueStyle={{ color: "#3f8600" }}
                />
              </Card>

            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Card bordered={false}>
                <Statistic
                  title="Sobrantes"
                  value={estadisticas?.contador?.sobrantes}
                  valueStyle={{ color: "#3f8600" }}
                />
              </Card>
            </Col>
            <Col span={12}>
              <Card bordered={false}>
                <Statistic
                  title="Faltantes"
                  value={estadisticas?.contador?.faltantes}
                  valueStyle={{ color: "#3f8600" }}
                />
              </Card>
            </Col>
          </Row>
        </Flex>
      ),
    },
    {
      key: "2",
      label: "Graficos",
      children: (
        <Row gutter={16}>
          <Col span={6}>
            <Card bordered={true}>
              <Typography.Title level={5}> Situación</Typography.Title>
              {estadisticas?.uso ? (
                <Grafico data={estadisticas?.uso?.chartData} />
              ) : (
                <p> Sin registros</p>
              )}
            </Card>
          </Col>
          <Col span={6}>
            <Card bordered={false}>
              <Typography.Title level={5}>Tipo</Typography.Title>
              {estadisticas?.tipo ? (
                <Grafico data={estadisticas?.tipo?.chartData} />
              ) : (
                <p> Sin registros</p>
              )}
            </Card>
          </Col>
          <Col span={6}>
            <Card bordered={false}>
              <Typography.Title level={5}> Sede</Typography.Title>

              {estadisticas?.sede ? (
                <Grafico data={estadisticas?.sede?.chartData} />
              ) : (
                <p> Sin registros</p>
              )}
            </Card>
          </Col>
          <Col span={6}>
            <Card bordered={false}>
              <Typography.Title level={5}>Estado</Typography.Title>

              {estadisticas?.estado ? (
                <Grafico data={estadisticas?.estado?.chartData} />
              ) : (
                <p> Sin registros</p>
              )}
            </Card>
          </Col>
        </Row>
      ),
    },
    {
      key: "3",
      label: "Inventariadores",
      children: (
        <Row gutter={16}>
          {bienes?.map((item) => (
            <Col
              span={12}
              key={item?.usuario?.id}
              style={{ marginTop: "10px" }}
            >
              <Card bordered={false}>
                <Statistic
                  title={`Bienes Inventariados por - ${item?.usuario?.nombre_usuario}`}
                  value={item?.total_bienes}
                  valueStyle={{
                    color: "#3f8600",
                  }}
                />
              </Card>
            </Col>
          ))}
        </Row>
      ),
    },
  ];
  return <Tabs defaultActiveKey="1" items={items} />;
};

export default Reportes;
