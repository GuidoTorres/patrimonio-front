import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  pdf,
  Image,
} from "@react-pdf/renderer";
import dayjs from "dayjs";
import { Table, TR, TH, TD } from "@ag-media/react-pdf-table";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 7,
    position: "relative",
  },
  page2: {
    padding: 10,
    fontSize: 7,
    position: "relative",
  },

  table: {
    display: "table",
    width: "100%",
    borderStyle: "solid",
    borderColor: "#bfbfbf",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
  },
  tableColHeader: {
    width: "10%",
    borderStyle: "solid",
    borderColor: "#bfbfbf",
    borderBottomColor: "#000",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCol: {
    width: "10%",
    borderStyle: "solid",
    borderColor: "#bfbfbf",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCellHeader: {
    fontWeight: "bold",
    margin: 5,
  },
  tableCell: {
    margin: 2,
    textAlign: "center",
  },
  tableCell2: {
    margin: 2,
    textAlign: "center",
    fontSize: "6px",
  },
  footer: {
    position: "absolute",
    bottom: 30, // Ajusta según el margen inferior que desees
    left: 30,
    right: 30,
  },
  signatureRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  signatureItem: {
    width: "30%",
    textAlign: "center",
  },
  footerText: {
    fontSize: 6,
    textAlign: "justify", // Asegura que el texto esté justificado
    width: "100%", // Asegura que el contenedor ocupe el 100% del ancho disponible
  },
});
const chunkData = (data, firstPageSize, subsequentPageSize) => {
  // Ordenar los datos por la descripción alfabéticamente
  const sortedData = data.sort((a, b) => {
    if (a.descripcion < b.descripcion) return -1;
    if (a.descripcion > b.descripcion) return 1;
    return 0;
  });

  const result = [];
  if (sortedData.length <= firstPageSize) {
    // Si los datos son menores o iguales al tamaño de la primera página
    result.push(sortedData);
  } else {
    // Primera página con firstPageSize elementos
    result.push(sortedData.slice(0, firstPageSize));

    // Páginas posteriores con subsequentPageSize elementos
    for (
      let i = firstPageSize;
      i < sortedData.length;
      i += subsequentPageSize
    ) {
      result.push(sortedData.slice(i, i + subsequentPageSize));
    }
  }
  return result;
};

const CargoPDF = ({ registros }) => {
  console.log();

  const registrosPorPagina1 = 20; // Número de registros por página para el primer formato
  const registrosPorPagina2 = 24; // Número de registros por página para el segundo formato

  // Paginación de los datos para cada formato
  const paginatedData1 = chunkData(
    registros,
    registrosPorPagina1,
    registrosPorPagina1
  );
  const paginatedData2 = chunkData(
    registros,
    registrosPorPagina2,
    registrosPorPagina2
  );
  return (
    <Document>
      {paginatedData1.map((pagina, pageIndex) => (
        <Page
          size="A4"
          style={styles.page}
          render={({ pageNumber, totalPages }) => (
            <>
              {/* Header */}
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  width: "100%",
                }}
              >
                <View style={{ flex: 2, alignItems: "flex-start" }}>
                  <Image
                    src={`${process.env.PUBLIC_URL}/assets/logo_autodema.png`}
                    style={{ height: "50px", width: "80px" }}
                  />
                </View>
                <View
                  style={{ flex: 4, alignItems: "center", marginTop: "20px" }}
                >
                  <Text style={{ fontSize: "12px" }}>
                    COMISIÓN DE INVENTARIO BIENES MUEBLES
                  </Text>
                </View>
                <View style={{ flex: 2, alignItems: "flex-end" }}>
                  <Image
                    src={`${process.env.PUBLIC_URL}/assets/gobierno.png`}
                    style={{ height: "50px", width: "80px" }}
                  />

                  <Text>{pageIndex + 1 + "/" + paginatedData1.length}</Text>
                  <Text>{dayjs().format("DD/MM/YYYY")}</Text>
                </View>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  width: "100%",
                  justifyContent: "center",
                  marginTop: "-25px",
                }}
              >
                <View style={{ flex: 4, alignItems: "center" }}>
                  <Text style={{ fontSize: "12px" }}>TARJETA DE CARGO</Text>
                  <Text style={{ fontSize: "11px", marginTop: "5px" }}>
                    {"EJERCICIO" + " " + dayjs().format("YYYY")}
                  </Text>
                </View>
              </View>

              {/* DATOS */}

              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  width: "100%",
                  justifyContent: "center",
                  marginTop: "10px",
                  gap: "5px",
                }}
              >
                <View style={{ flex: 1, alignItems: "flex-start" }}>
                  <Text>USUARIO:{pagina[0]?.trabajadore?.nombre}</Text>
                  <Text>DEPENDENCIA: {pagina[0]?.dependencia?.nombre}</Text>
                  <Text>UBICACIÓN: {pagina[0]?.ubicacione?.nombre}</Text>
                </View>
                <View style={{ flex: 1, alignItems: "flex-start" }}>
                  <Text>SEDE: {pagina[0]?.sede?.nombre}</Text>
                  <Text>JEFE DE GRUPO: {pagina[0]?.usuario?.jefe?.nombre}</Text>
                </View>
              </View>

              {/* Tabla */}
              <View
                style={{
                  width: "100%",
                  marginTop: "20px",
                  borderBottomWidth: "1px",
                  height: "70%",
                }}
              >
                {/* Cabecera de la tabla */}
                <View
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "row",
                    borderBottomWidth: "1px",
                    borderTopWidth: "1px",
                  }}
                >
                  <View style={{ width: "5%" }}>
                    <Text
                      style={[styles.tableCellHeader, { textAlign: "center" }]}
                    >
                      N°
                    </Text>
                  </View>
                  <View style={{ width: "15%" }}>
                    <Text
                      style={[styles.tableCellHeader, { textAlign: "center" }]}
                    >
                      Código
                    </Text>
                  </View>
                  <View style={{ width: "20%" }}>
                    <Text
                      style={[styles.tableCellHeader, { textAlign: "center" }]}
                    >
                      Descripción
                    </Text>
                  </View>
                  <View style={{ width: "15%" }}>
                    <Text
                      style={[styles.tableCellHeader, { textAlign: "center" }]}
                    >
                      Marca
                    </Text>
                  </View>
                  <View style={{ width: "15%" }}>
                    <Text
                      style={[styles.tableCellHeader, { textAlign: "center" }]}
                    >
                      Modelo
                    </Text>
                  </View>
                  <View style={{ width: "10%" }}>
                    <Text
                      style={[styles.tableCellHeader, { textAlign: "center" }]}
                    >
                      Color
                    </Text>
                  </View>
                  <View style={{ width: "15%" }}>
                    <Text
                      style={[styles.tableCellHeader, { textAlign: "center" }]}
                    >
                      Serie
                    </Text>
                  </View>
                  <View style={{ width: "5%" }}>
                    <Text
                      style={[styles.tableCellHeader, { textAlign: "center" }]}
                    >
                      E
                    </Text>
                  </View>
                </View>

                {pagina.map((registro, index) => (
                  <View
                    style={{
                      width: "100%",
                      display: "flex",
                      flexDirection: "row",
                    }}
                    key={index}
                  >
                    <View style={{ width: "5%" }}>
                      <Text style={[styles.tableCell, { textAlign: "center" }]}>
                        {pageIndex * registrosPorPagina1 + index + 1}
                      </Text>
                    </View>
                    <View style={{ width: "15%" }}>
                      <Text style={[styles.tableCell, { textAlign: "center" }]}>
                        {registro.sbn}
                      </Text>
                    </View>
                    <View style={{ width: "20%" }}>
                      <Text style={[styles.tableCell, { textAlign: "left" }]}>
                        {registro.descripcion}
                      </Text>
                      {/* <Text style={{ textAlign: "left", marginTop: "0px" }}>
                        Situación:{registro?.situacion ? "uso" : "desuso"}
                      </Text>
                      <Text style={{ textAlign: "left", marginTop: "0px" }}>
                        Observación:{registro?.observacion}
                      </Text>
                      <Text style={{ textAlign: "left", marginTop: "0px" }}>
                        Detalles:{registro?.detalles}
                      </Text> */}
                    </View>
                    <View style={{ width: "15%" }}>
                      <Text style={[styles.tableCell, { textAlign: "center" }]}>
                        {registro.marca}
                      </Text>
                    </View>
                    <View style={{ width: "15%" }}>
                      <Text style={[styles.tableCell, { textAlign: "center" }]}>
                        {registro.modelo}
                      </Text>
                    </View>
                    <View style={{ width: "10%" }}>
                      <Text style={[styles.tableCell, { textAlign: "center" }]}>
                        {registro.color}
                      </Text>
                    </View>
                    <View style={{ width: "15%" }}>
                      <Text style={[styles.tableCell, { textAlign: "center" }]}>
                        {registro.serie}
                      </Text>
                    </View>
                    <View style={{ width: "5%" }}>
                      <Text style={[styles.tableCell, { textAlign: "center" }]}>
                        {registro?.estado_patrimonial === "1"
                          ? "B"
                          : registro?.estado_patrimonial === "2"
                          ? "R"
                          : registro?.estado_patrimonial === "3"
                          ? "M"
                          : registro?.estado_patrimonial === "7"
                          ? "X"
                          : registro?.estado_patrimonial === "6"
                          ? "Y"
                          : registro?.estado_patrimonial === "5"
                          ? "N"
                          : ""}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
              <View>
                <Text style={{ fontSize: "6px" }}>
                  Leyenda: N=Nuevo B=Bueno R=Regular M=Malo X=RAEE Y=Chatarra
                </Text>
              </View>

              {/* Footer - Firmas */}
              <View style={styles.footer}>
                <View style={styles.signatureRow}>
                  <View
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text>__________________________________</Text>
                    <Text>Presidente Comisión de Inv 2024</Text>
                  </View>
                  <View
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text>_________________________</Text>
                    <Text>V.B Control Patrimonial</Text>
                  </View>
                  <View
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text>__________________</Text>
                    <Text>Usuario Final</Text>
                  </View>
                </View>

                <View style={styles.footerText}>
                  <Text style={{ fontSize: "6px", width: "100%" }}>
                    El usuario declara haber mostrado todos los bienes que se
                    encuentran bajo responsabilidad y no contar con mas bienes
                    materia de inventario.
                  </Text>
                  <Text style={{ fontSize: "6px", width: "100%" }}>
                    El usuario es responsable de la permanencia y conservación
                    de cada uno de los bienes muebles descritos, recomendando
                    tomar las precauciones del caso para evitar, sustracciones,
                    deterioro,etc.
                  </Text>
                  <Text style={{ fontSize: "6px", width: "100%" }}>
                    Cualquier necesidad de traslado del bien mueble dentro o
                    fuera del local de la entidad, es previamente comunicado
                    oportunamente al encargado de la Oficina de Control
                    Patrimonial bajo responsabilidad; de conformidad con la
                    DIRECTIVA, Directiva N° 0006-2021-EF/54.01, aprobada con
                    RESOLUCIÓN DIRECTORAL N° 0015-2021-EF/54.01 "Directiva para
                    la gestión de bienes muebles patrimoniales en el marco del
                    Sistema Nacional de Abastecimiento".
                  </Text>
                </View>
              </View>
            </>
          )}
        />
      ))}
      {/* Segundo documento o sección diferente */}
      {paginatedData2.map((pagina, pageIndex) => (
        <Page style={styles.page2}>
          <View style={{ width: "100%", marginTop: "20px" }}>
            <Text style={{ fontSize: 14, textAlign: "center" }}>
              FICHA DE LEVANTAMIENTO DE INFORMACIÓN
            </Text>
            <Text style={{ fontSize: 14, textAlign: "center" }}>
              INVENTARIO PATRIMONIAL {dayjs().format("YYYY")}
            </Text>
          </View>

          <View
            style={{ marginTop: 10, display: "flex", flexDirection: "row" }}
          >
            <View style={{ flex: 1 }}>
              <Text>AUTORIDAD AUTONOMA DE MAJES</Text>
            </View>
            <View style={{ flex: 1, alignItems: "center" }}>
              <Text>{dayjs().format("DD/MM/YYYY")}</Text>
            </View>

            <View style={{ flex: 1, alignItems: "center" }}>
              <Text>Página: {pageIndex + 1 + "/" + paginatedData2.length}</Text>
            </View>
          </View>

          <View
            style={{ marginTop: 10, display: "flex", flexDirection: "row" }}
          >
            <View style={{ flex: 1 }}>
              <Text>USUARIO:</Text>
              <View>
                <Text>{pagina[0]?.trabajadore?.nombre}</Text>
                <Text>{pagina[0]?.dependencia?.nombre}</Text>
                <Text>{pagina[0]?.ubicacione?.nombre}</Text>
              </View>
            </View>
            <View style={{ flex: 1, alignItems: "flex-start" }}>
              <Text>PERSONAL INVENTARIADOR:</Text>
              <View>
                <Text>{pagina[0]?.usuario?.inventariadore?.nombre}</Text>
                <Text>{pagina[0]?.usuario?.jefe?.grupo?.nombre}</Text>
              </View>
            </View>
          </View>

          <View
            style={{ marginTop: 10, display: "flex", flexDirection: "row" }}
          >
            <View style={{ flex: 1 }}>
              <Text>TIPO DE VERIFICACIÓN: FISICA</Text>
            </View>
          </View>

          <View style={{ width: "100%", marginTop: "20px", height: "80%" }}>
            {/* Cabecera de la tabla */}
            <View
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                borderBottomWidth: "1px",
                borderTopWidth: "1px",
                borderLeftWidth: "1px",
                backgroundColor: "#D3D3D3",
              }}
            >
              <View
                style={{
                  width: "20px",
                  display: "flex",
                  height: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRightWidth: "1px",
                }}
              >
                <Text style={[{ textAlign: "center", width: "100%" }]}>N°</Text>
              </View>
              <View
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  borderRightWidth: "1px",
                }}
              >
                <View
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    height: "20px",
                  }}
                >
                  <Text
                    style={{
                      textAlign: "center",
                      borderRightWidth: "0",
                      width: "100%",
                    }}
                  >
                    DESCRIPCIÓN
                  </Text>
                </View>
                <View
                  style={{
                    width: "100%",
                    display: "flex",

                    flexDirection: "row",
                    height: "25px",
                    borderTopWidth: "1px",
                  }}
                >
                  <View
                    style={{
                      width: "10%",
                      borderRightWidth: "1px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        textAlign: "center",
                        fontSize: "7px",
                      }}
                    >
                      CÓDIGO
                    </Text>
                  </View>
                  <View
                    style={{
                      width: "22%",
                      borderRightWidth: "1px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        textAlign: "center",
                        fontSize: "7px",
                      }}
                    >
                      DESCRIPCIÓN
                    </Text>
                  </View>
                  <View
                    style={{
                      width: "9%",
                      borderRightWidth: "1px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ textAlign: "center", fontSize: "7px" }}>
                      MARCA
                    </Text>
                  </View>
                  <View
                    style={{
                      width: "12%",
                      borderRightWidth: "1px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ textAlign: "center", fontSize: "7px" }}>
                      MODELO
                    </Text>
                  </View>

                  <View
                    style={{
                      width: "8%",
                      borderRightWidth: "1px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        textAlign: "center",
                        fontSize: "7px",
                      }}
                    >
                      COLOR
                    </Text>
                  </View>
                  <View
                    style={{
                      width: "11%",
                      borderRightWidth: "1px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        textAlign: "center",
                        fontSize: "7px",
                      }}
                    >
                      SERIE
                    </Text>
                  </View>
                  <View
                    style={{
                      width: "15%",
                      borderRightWidth: "1px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        textAlign: "center",
                        fontSize: "7px",
                      }}
                    >
                      DETALLES
                    </Text>
                  </View>

                  <View
                    style={{
                      width: "7%",
                      borderRightWidth: "1px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        textAlign: "center",
                        fontSize: "7px",
                      }}
                    >
                      SITUACIÓN
                    </Text>
                  </View>
                  <View
                    style={{
                      width: "6%",
                      borderRightWidth: "1px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        textAlign: "center",
                        fontSize: "7px",
                      }}
                    >
                      ESTADO
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {pagina.map((registro, index) => (
              <View
                style={{ width: "100%", display: "flex", flexDirection: "row" }}
                key={index}
              >
                <View
                  style={{
                    width: "21px",
                    borderRightWidth: "1px",
                    borderBottomWidth: "1px",
                    borderLeftWidth: "1px",
                    height: "auto",
                    minHeight: "20px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={[styles.tableCell2]}>
                    {pageIndex * registrosPorPagina2 + index + 1}
                  </Text>
                </View>
                <View
                  style={{
                    width: "10%",
                    borderRightWidth: "1px",
                    borderBottomWidth: "1px",
                    height: "auto",
                    minHeight: "20px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={[styles.tableCell2, { flexWrap: "wrap" }]}>
                    {registro?.sbn}
                  </Text>
                </View>
                <View
                  style={{
                    width: "22%",
                    borderRightWidth: "1px",
                    borderBottomWidth: "1px",
                    height: "auto",
                    minHeight: "20px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={[styles.tableCell2, { flexWrap: "wrap" }]}>
                    {registro?.descripcion}
                  </Text>
                </View>
                <View
                  style={{
                    width: "9%",
                    borderRightWidth: "1px",
                    borderBottomWidth: "1px",
                    height: "auto",
                    minHeight: "20px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={[styles.tableCell2, { flexWrap: "wrap" }]}>
                    {registro?.marca}
                  </Text>
                </View>
                <View
                  style={{
                    width: "12%",
                    borderRightWidth: "1px",
                    borderBottomWidth: "1px",
                    height: "auto", // Permitir altura dinámica
                    minHeight: "20px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    overflow: "hidden",
                  }}
                >
                  <Text
                    style={[
                      styles.tableCell2,
                      {
                        width: "100%",
                        fontSize: "6px",
                        height: "auto",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      },
                    ]}
                  >
                    {registro?.modelo}
                  </Text>
                </View>
                <View
                  style={{
                    width: "8%",
                    borderRightWidth: "1px",
                    borderBottomWidth: "1px",
                    height: "auto", // Permitir altura dinámica
                    minHeight: "20px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    overflow: "hidden",
                  }}
                >
                  <Text
                    style={[
                      styles.tableCell2,
                      {
                        width: "100%",
                        fontSize: "6px",
                        height: "auto",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      },
                    ]}
                  >
                    {registro?.color}
                  </Text>
                </View>
                <View
                  style={{
                    width: "11%",
                    borderRightWidth: "1px",
                    borderBottomWidth: "1px",
                    height: "auto", // Permitir altura dinámica
                    minHeight: "20px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    overflow: "hidden",
                  }}
                >
                  <Text
                    style={[
                      styles.tableCell2,
                      {
                        width: "100%",
                        fontSize: "6px",
                        height: "auto",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      },
                    ]}
                  >
                    {registro?.serie}
                  </Text>
                </View>
                <View
                  style={{
                    width: "15%",
                    borderRightWidth: "1px",
                    borderBottomWidth: "1px",
                    height: "auto",
                    minHeight: "20px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={[styles.tableCell2, { flexWrap: "wrap" }]}>
                    {registro?.detalles}
                  </Text>
                </View>

                <View
                  style={{
                    width: "7%",
                    borderRightWidth: "1px",
                    borderBottomWidth: "1px",
                    height: "auto",
                    minHeight: "20px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={[styles.tableCell2, { flexWrap: "wrap" }]}>
                    {registro.situacion ? "Uso" : "Desuso"}
                  </Text>
                </View>
                <View
                  style={{
                    width: "6%",
                    borderRightWidth: "1px",
                    borderBottomWidth: "1px",
                    height: "auto",
                    minHeight: "20px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={[styles.tableCell2, { flexWrap: "wrap" }]}>
                    {" "}
                    {registro?.estado_patrimonial == "1"
                      ? "B"
                      : registro?.estado_patrimonial == "2"
                      ? "R"
                      : registro?.estado_patrimonial == "3"
                      ? "M"
                      : registro?.estado_patrimonial == "7"
                      ? "X"
                      : registro?.estado_patrimonial == "6"
                      ? "Y"
                      : registro?.estado_patrimonial == "5"
                      ? "N"
                      : ""}
                  </Text>
                </View>
                {/* <View
                  style={{
                    width: "8%",
                    borderRightWidth: "1px",
                    borderBottomWidth: "1px",
                    height: "auto",
                    minHeight: "20px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={[styles.tableCell2, { flexWrap: "wrap" }]}>
                    {registro?.observacion}
                  </Text>
                </View> */}
              </View>
            ))}
            <View style={{ marginTop: "5px" }}>
              <Text>
                (1) N=Nuevo B=Bueno R=Regular M=Malo X=RAEE Y=Chatarra
              </Text>
              <Text>
                (2) Es estado es consignado en base a la siguiente escala:
                Bueno, Regular, Malo, Chatarra y RAEE. En caso de semovientes,
                utilizar escala de acuerdo a su naturalez.
              </Text>

              <Text
                style={{
                  textDecoration: "underline",
                  fontSize: "10px",
                  marginTop: "4px",
                }}
              >
                Consideraciones:
              </Text>
              <Text style={{ marginTop: "2px" }}>
                - El usuario declara haber mostrado todos los bienes muebles que
                se encuentran bajo su responsabilidad y no contar con más bienes
                muebles materia de inventario.
              </Text>
              <Text>
                - El usuario es responsable de la permanencia y conservación de
                cada uno de los bienes muebles descritos, recomendándose tomar
                las precauciones del caso para evitar sutracciones,
                deterioros,etc.
              </Text>
              <Text style={{ marginBottom: "20px" }}>
                - Cualquier necesidad de traslado del bien mueble dentro o fuera
                del local de la Entidad u Organización de Entidad, es
                preciamente comunicado al encargado de la OCP.
              </Text>

              <View
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  flexDirection: "row",
                  marginTop: "20px",
                }}
              >
                <View
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text>______________</Text>
                  <Text> Usuario</Text>
                </View>
                <View
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text>_____________________________</Text>
                  <Text> Personal Inventariador</Text>
                </View>
              </View>
            </View>
          </View>
        </Page>
      ))}
    </Document>
  );
};

export default CargoPDF;
