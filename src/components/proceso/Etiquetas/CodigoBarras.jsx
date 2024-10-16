import React from "react";
import Barcode from "react-barcode";
import image from "../../../assets/logo_autodema.png";
import image1 from "../../../assets/gobierno.png";
import { Flex } from "antd";
const CodigoBarras = ({ values }) => {
  return (
    <>
      {values?.map((value, index) => (
        <div
          key={index}
          className="etiqueta" // Agrega la clase para aplicar el tamaño fijo
          style={{
            width: "5.5cm",
            height: "2.4cm",
            textAlign: "center",
            margin: "0",
            padding: "10px",
            backgroundColor: "white",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "2px",
            }}
          >
            <div style={{ flex: 1 }}>
              <img
                src={image1}
                alt="Custom Logo"
                style={{ height: "15px", imageRendering: "crisp-edges" }}
              />
            </div>
            <div
              style={{
                fontSize: "8px",
                fontFamily: "Helvetica",
                lineHeight: "1",
                flex: 8,
                textAlign: "center",
              }}
            >
              <p
                style={{
                  margin: 0,
                  width: "100%",
                  letterSpacing: "0.4px",
                  textRendering: "optimizeLegibility",
                }}
              >
                "PEIMS - AUTODEMA - INV 2024"
              </p>
              <div
                style={{
                  border: "0.2px solid black",
                  marginTop: "2px",
                  borderTop: 0,
                }}
              ></div>
              {/* <p style={{ margin: 0, width:"100%" }}>AUTODEMA - PATRIMONIO</p> */}
            </div>
            <div style={{ flex: 1 }}>
              <img
                src={image}
                alt="Custom Logo"
                style={{ height: "15px", imageRendering: "crisp-edges" }}
              />
            </div>
          </div>

          <Flex justify="space-between" align="center">
            <div
              style={{
                transform: "rotate(-90deg)",
                fontSize: "6px",
                marginLeft: "-4px",
                paddingLeft: "5px",
                width: "40px",
                textAlign:"left"
              }}
            >
              <strong>
                <label>
                  {value?.ubicacione?.tipo_ubicac +
                    " - " +
                    value?.ubicacione?.ubicac_fisica}
                </label>
              </strong>
            </div>

            <Barcode
              value={value.sbn}
              width={1.28}
              height={20}
              fontSize={12}
              marginTop={5}
              marginBottom={5}
            />

            <div>
              <p
                style={{
                  transform: "rotate(-90deg)",
                  fontSize: "7px",
                  paddingRight: "5px",
                }}
              >
                <strong>{value.secuencia}</strong>
              </p>
            </div>
          </Flex>
          <p
            style={{
              overflow: "hidden",
              fontFamily: "Helvetica",
              fontSize: "8px",
              margin: 0,
              textRendering: "optimizeLegibility",
              height: "19.5px",
            }}
          >
            {value?.descripcion}
          </p>
        </div>
      ))}
    </>
  );
};

export default CodigoBarras;
