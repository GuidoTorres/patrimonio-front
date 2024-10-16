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
import img from "../../../assets/autodema.png";
import img2 from "../../../assets/gobierno.png";

const styles = StyleSheet.create({
  page: {
    padding: 30,
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
  },
  tableCell: {
    margin: 5,
    textAlign: "center",
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
const chunkData = (data, size) => {
  const result = [];
  for (let i = 0; i < data.length; i += size) {
    result.push(data.slice(i, i + size));
  }
  return result;
};
const CargoPDF = ({ registros }) => {
  const registrosPorPagina = 25; // Número de registros por página
  const paginatedData = chunkData(registros, registrosPorPagina);

  console.log(registros);

  return (
    <Document>
      {paginatedData.map((pagina, pageIndex) => (
        <Page
          size="A4"
          style={styles.page}
          render={({ pageNumber, totalPages }) => (
            <>
              {/* Header */}
              <View
                style={{ display: "flex", flexDirection: "row", width: "100%" }}
              >
                <View style={{ flex: 2, alignItems: "flex-start" }}>
                  <Image src={img} style={{ height: "50px", width: "100px" }} />
                </View>
                <View
                  style={{ flex: 4, alignItems: "center", marginTop: "20px" }}
                >
                  <Text>Comisión de Inventario Bienes Muebles</Text>
                  <Text>{"Año" + " " + dayjs().format("YYYY")}</Text>
                </View>
                <View style={{ flex: 2, alignItems: "flex-end" }}>
                  <Image src={img2} style={{ height: "50px", width: "80px" }} />

                  <Text>{pageIndex + 1 + "/" + paginatedData.length}</Text>
                  <Text>{dayjs().format("DD/MM/YYYY")}</Text>
                </View>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  width: "100%",
                  justifyContent: "center",
                  marginTop: "10px",
                }}
              >
                <View style={{ flex: 4, alignItems: "center" }}>
                  <Text style={{ fontSize: "12px" }}>TARJETA DE CARGO</Text>
                  <Text>{"EJERCICIO" + " " + dayjs().format("YYYY")}</Text>
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
                  <Text>Usuario:{pagina[0]?.trabajadore?.nombre}</Text>
                  <Text>Dependencia: {pagina[0]?.dependencia?.nombre}</Text>
                  <Text>Ubicación: {pagina[0]?.ubicacione?.nombre}</Text>
                </View>
                <View style={{ flex: 1, alignItems: "flex-start" }}>
                  <Text>Sede: {pagina[0]?.sede?.nombre}</Text>
                  <Text>Jefe de Grupo: {pagina[0]?.usuario?.jefe?.nombre}</Text>
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
                        {pageIndex * registrosPorPagina + index + 1}
                      </Text>
                    </View>
                    <View style={{ width: "15%" }}>
                      <Text style={[styles.tableCell, { textAlign: "center" }]}>
                        {registro.sbn}
                      </Text>
                    </View>
                    <View style={{ width: "20%" }}>
                      <Text style={[styles.tableCell, { textAlign:"left" }]}>
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
                      <Text
                        style={[
                          styles.tableCell,
                          { textAlign: "center", marginTop: "0px" },
                        ]}
                      >
                        {registro.marca}
                      </Text>
                    </View>
                    <View style={{ width: "15%" }}>
                      <Text
                        style={[
                          styles.tableCell,
                          { textAlign: "center", marginTop: "0px" },
                        ]}
                      >
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
                    encuentran bajo responsabilidad...
                  </Text>
                  <Text style={{ fontSize: "6px", width: "100%" }}>
                    El usuario es responsable de la permanencia y conservación
                    de cada uno de los bienes muebles...
                  </Text>
                  <Text style={{ fontSize: "6px", width: "100%" }}>
                    Cualquier necesidad de traslado del bien mueble dentro o
                    fuera del local de la entidad...
                  </Text>
                </View>
              </View>
            </>
          )}
        />
      ))}
      {/* Segundo documento o sección diferente */}
      {paginatedData.map((pagina, pageIndex) => (
        <Page size={[841.89, 595.28]} style={styles.page}>
          <View style={{ width: "100%", marginTop: "20px" }}>
            <Text style={{ fontSize: 14, textAlign: "center" }}>
              FORMATO DE FICHA DE LEVANTAMIENTO DE INFORMACIÓN
            </Text>
            <Text style={{ fontSize: 14, textAlign: "center" }}>
              INVENTARIO PATRIMONIAL {dayjs().format("YYYY")}
            </Text>
          </View>

          <View
            style={{ marginTop: 10, display: "flex", flexDirection: "row" }}
          >
            <View style={{ flex: 1 }}>
              <Text>Autoridad Autonoma de Majes</Text>
            </View>
            <View style={{ flex: 1, alignItems: "flex-start" }}>
              <Text>{dayjs().format("DD/MM/YYYY")}</Text>
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
              <Text>PERSONAL INVETARIADOR:</Text>
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
              <Text>TIPO DE VERIFICACIÓN: Fisica</Text>
            </View>
          </View>

          <View style={{ width: "100%", marginTop: "20px", height: "50%" }}>
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
                  width: "25px",
                  display: "flex",
                  height: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRightWidth: "1px",
                }}
              >
                <Text style={[{ textAlign: "center", width: "100%" }]}>
                  N°
                </Text>
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
                      width: "8%",
                      height: "25px",
                      borderRightWidth: "1px",
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
                      width: "12%",
                      margin: "0",
                      borderRightWidth: "1px",
                    }}
                  >
                    <Text style={{ textAlign: "center", fontSize: "7px" }}>
                      DESCRIPCIÓN
                    </Text>
                  </View>
                  <View
                    style={{
                      width: "7%",
                      height: "25px",
                      borderRightWidth: "1px",
                    }}
                  >
                    <Text style={{ textAlign: "center", fontSize: "7px" }}>
                      MARCA
                    </Text>
                  </View>
                  <View
                    style={{
                      width: "7%",
                      height: "25px",
                      borderRightWidth: "1px",
                    }}
                  >
                    <Text style={{ textAlign: "center", fontSize: "7px" }}>
                      Modelo
                    </Text>
                  </View>
                  <View
                    style={{
                      width: "6%",
                      height: "25px",
                      borderRightWidth: "1px",
                    }}
                  >
                    <Text
                      style={{
                        textAlign: "center",
                        fontSize: "7px",
                        height: "100%",
                      }}
                    >
                      TIPO
                    </Text>
                  </View>
                  <View
                    style={{
                      width: "6%",
                      height: "25px",
                      borderRightWidth: "1px",
                    }}
                  >
                    <Text
                      style={{
                        textAlign: "center",
                        fontSize: "7px",
                        height: "100%",
                      }}
                    >
                      COLOR
                    </Text>
                  </View>
                  <View
                    style={{
                      width: "8%",
                      height: "25px",
                      borderRightWidth: "1px",
                    }}
                  >
                    <Text
                      style={{
                        textAlign: "center",
                        fontSize: "7px",
                        height: "100%",
                      }}
                    >
                      SERIE
                    </Text>
                  </View>
                  <View
                    style={{
                      width: "16%",
                      height: "25px",
                      borderRightWidth: "1px",
                    }}
                  >
                    <Text
                      style={{
                        textAlign: "center",
                        fontSize: "7px",
                        height: "100%",
                      }}
                    >
                      Detalles
                    </Text>
                  </View>

                  <View
                    style={{
                      width: "10%",
                      height: "25px",
                      borderRightWidth: "1px",
                    }}
                  >
                    <Text
                      style={{
                        textAlign: "center",
                        fontSize: "7px",
                        height: "100%",
                      }}
                    >
                      SITUACIÓN
                    </Text>
                  </View>
                  <View
                    style={{
                      width: "10%",
                      height: "25px",
                      borderRightWidth: "1px",
                    }}
                  >
                    <Text
                      style={{
                        textAlign: "center",
                        fontSize: "7px",
                        height: "100%",
                      }}
                    >
                      ESTADO DE CONSERVACIÓN
                    </Text>
                  </View>
                  <View style={{ width: "10%", height: "25px" }}>
                    <Text
                      style={{
                        textAlign: "center",
                        fontSize: "7px",
                        height: "100%",
                        borderWidth: "0",
                      }}
                    >
                      OBSERVACIÓN
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
                    width: "26px",
                    borderRightWidth: "1px",
                    borderBottomWidth: "1px",
                    borderLeftWidth: "1px",
                  }}
                >
                  <Text style={[styles.tableCell]}>
                    {pageIndex * registrosPorPagina + index + 1}
                  </Text>
                </View>
                <View
                  style={{
                    width: "8%",
                    borderRightWidth: "1px",
                    borderBottomWidth: "1px",
                  }}
                >
                  <Text style={[styles.tableCell]}>{registro?.sbn}</Text>
                </View>
                <View
                  style={{
                    width: "12%",
                    borderRightWidth: "1px",
                    borderBottomWidth: "1px",
                  }}
                >
                  <Text style={[styles.tableCell]}>
                    {registro?.descripcion}
                  </Text>
                </View>
                <View
                  style={{
                    width: "7%",
                    borderRightWidth: "1px",
                    borderBottomWidth: "1px",
                  }}
                >
                  <Text style={[styles.tableCell]}>{registro?.marca}</Text>
                </View>
                <View
                  style={{
                    width: "7%",
                    borderRightWidth: "1px",
                    borderBottomWidth: "1px",
                  }}
                >
                  <Text style={[styles.tableCell]}>{registro?.modelo}</Text>
                </View>
                <View
                  style={{
                    width: "6%",
                    borderRightWidth: "1px",
                    borderBottomWidth: "1px",
                  }}
                >
                  <Text style={[styles.tableCell]}>{registro?.tipo}</Text>
                </View>
                <View
                  style={{
                    width: "6%",
                    borderRightWidth: "1px",
                    borderBottomWidth: "1px",
                  }}
                >
                  <Text style={[styles.tableCell]}>{registro?.color}</Text>
                </View>
                <View
                  style={{
                    width: "8%",
                    borderRightWidth: "1px",
                    borderBottomWidth: "1px",
                  }}
                >
                  <Text style={[styles.tableCell]}>{registro?.serie}</Text>
                </View>
                <View
                  style={{
                    width: "16%",
                    borderRightWidth: "1px",
                    borderBottomWidth: "1px",
                  }}
                >
                  <Text style={[styles.tableCell]}>{registro?.detalles}</Text>
                </View>

                <View
                  style={{
                    width: "10%",
                    borderRightWidth: "1px",
                    borderBottomWidth: "1px",
                  }}
                >
                  <Text style={[styles.tableCell]}>
                    {registro.situacion ? "Uso" : "Desuso"}
                  </Text>
                </View>
                <View
                  style={{
                    width: "10%",
                    borderRightWidth: "1px",
                    borderBottomWidth: "1px",
                  }}
                >
                  <Text style={[styles.tableCell]}>
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
                <View
                  style={{
                    width: "10%",
                    borderRightWidth: "1px",
                    borderBottomWidth: "1px",
                  }}
                >
                  <Text style={[styles.tableCell]}>
                    {registro?.observacion}
                  </Text>
                </View>
              </View>
            ))}
          </View>
          <View>
            <Text>(1) Uso (U), Desuso (D)</Text>
            <Text>
              (2) Es estado es consignado en base a la siguiente escala: Bueno,
              Regular, Malo, Chatarra y RAEE. En caso de semovientes, utilizar
              escala de acuerdo a su naturalez.
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
              cada uno de los bienes muebles descritos, recomendándose tomar las
              precauciones del caso para evitar sutracciones, deterioros,etc.
            </Text>
            <Text style={{ marginBottom: "20px" }}>
              - Cualquier necesidad de traslado del bien mueble dentro o fuera
              del local de la Entidad u Organización de Entidad, es preciamente
              comunicado al encargado de la OCP.
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
        </Page>
      ))}
    </Document>
  );
};

export default CargoPDF;
