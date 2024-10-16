import { Modal, Button, Form, Input, Select, Flex, notification } from "antd";
import React, { useEffect, useState } from "react";

const ModalUbicaciones = ({ modal, setModal, edit, setEdit, ubicaciones }) => {
  const [form] = Form.useForm();
  const [sedes, setSedes] = useState([]);
  const [dependencias, setDependencias] = useState([false]); // Estado para manejar si el rol es jefe
  const [formValues, setFormValues] = useState({});
  const [filteredDependencias, setFilteredDependencias] = useState([]);

  useEffect(() => {
    getSedes();
    getDependencias();
  }, []);
  useEffect(() => {
    if (edit) {
      form.setFieldsValue(edit);
      setFormValues((value) => ({ ...value, sede_id: edit?.sede_id }));
    }
  }, [edit]);

  const onClose = () => {
    setModal(false);
    setEdit(null);
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
      setDependencias(info);
    }
  };

  const onFinish = async (values) => {
    if (!edit) {
      const response = await fetch(
        `${process.env.REACT_APP_BASE}/ubicaciones`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values), // Enviar los valores del formulario
        }
      );
      const data = await response.json();

      if (response.ok) {
        notification.success({
          message: data.msg,
        });
        onClose();
        ubicaciones();
      } else {
        notification.error({
          message: data.msg,
        });
      }
    } else {
      const response = await fetch(
        `${process.env.REACT_APP_BASE}/ubicaciones/${edit.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values), // Enviar los valores del formulario
        }
      );
      const data = await response.json();

      if (response.ok) {
        notification.success({
          message: data.msg,
        });
        onClose();
        ubicaciones();
      } else {
        notification.error({
          message: data.msg,
        });
      }
    }
  };
  useEffect(() => {
    if (formValues.sede_id && dependencias.length > 0) {
      const filtered = dependencias.filter(
        (item) => item.sede_id === formValues.sede_id
      );
      setFilteredDependencias(filtered); // Actualiza las dependencias filtradas
    }
  }, [
    formValues.sede_id,
    formValues.dependencia_id,
    dependencias,
    ubicaciones,
  ]);

  return (
    <Modal
      title={edit ? "Editar ubicación" : "Registrar ubicación"}
      open={modal}
      //   onOk={handleOk}
      onCancel={onClose}
      footer={false}
    >
      <Form
        form={form}
        name="basic"
        layout="vertical"
        autoComplete="off"
        onFinish={onFinish}
      >
        <Form.Item
          label="Sede"
          name="sede_id"
          rules={[
            {
              required: true,
              message: "La sede es obligatoria",
            },
          ]}
          allowClear
        >
          <Select
            options={sedes.map((item) => {
              return {
                value: item.id,
                label: item.nombre,
              };
            })}
            onChange={(e) =>
              setFormValues((value) => ({ ...value, sede_id: e }))
            }
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            allowClear
          />
        </Form.Item>
        <Form.Item
          label="Área"
          name="dependencia_id"
          rules={[
            {
              required: true,
              message: "La dependencia es obligatoria!",
            },
          ]}
          allowClear
        >
          <Select
            options={filteredDependencias.map((item) => {
              return {
                value: item.id,
                label: item.nombre,
              };
            })}
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            allowClear
          />
        </Form.Item>

        <Form.Item
          label="Nombre Ubicación"
          name="nombre"
          rules={[
            {
              required: true,
              message: "El nombre es obligatorio!",
            },
          ]}
        >
          <Input allowClear />
        </Form.Item>

        <Form.Item>
          <Flex justify="end">
            <Button
              htmlType="submit"
              style={{ backgroundColor: " #4DA362 ", color: "white" }}
            >
              Guardar
            </Button>
          </Flex>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalUbicaciones;
