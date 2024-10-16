import { Modal, Button, Form, Input, Select, Flex, notification } from "antd";
import React, { useEffect, useState } from "react";

const ModalInvetariador = ({ modal, setModal, inventariadores, edit, setEdit }) => {
  const [form] = Form.useForm();
  const [grupos, setGrupos] = useState([]);
  const [jefes, setJefes] = useState([])

  const onClose = () => {
    setModal(false);
    setEdit(null)
  };

  useEffect(() => {
    getGrupos();
    getJefes()
  }, []);

  useEffect(() => {
    form.setFieldsValue(edit);
  }, [edit]);

  const onFinish = async (values) => {

    if(!edit){
    const response = await fetch(`${process.env.REACT_APP_BASE}/inventariadores`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values), // Enviar los valores del formulario
    });
    const data = await response.json();

    if (response.ok) {
      notification.success({
        message: data.msg,
      });
      onClose();
      inventariadores();
    } else {
      notification.error({
        message: data.msg,
      });
    }
    }else{
      
      const response = await fetch(`${process.env.REACT_APP_BASE}/inventariadores/${edit.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values), // Enviar los valores del formulario
      });
      const data = await response.json();
  
      if (response.ok) {
        notification.success({
          message: data.msg,
        });
        onClose();
        inventariadores();
      } else {
        notification.error({
          message: data.msg,
        });
      }
    }

  };

  const getGrupos = async () => {
    const response = await fetch(`${process.env.REACT_APP_BASE}/grupos`);

    if (response.ok) {
      const info = await response.json();
      setGrupos(info); // Guardar los bienes en el estado si la respuesta es exitosa
    }
  };
  const getJefes = async () => {
    const response = await fetch(`${process.env.REACT_APP_BASE}/jefes`);

    if (response.ok) {
      const info = await response.json();
      setJefes(info); // Guardar los bienes en el estado si la respuesta es exitosa
    }
  };
  return (
    <Modal
      title={edit ? "Editar Jefe de Grupo" : "Registrar Jefe de Grupo"}
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
          label="Nombre"
          name="nombre"
          rules={[
            {
              required: true,
              message: "El nombre es obligatorio",
            },
          ]}
        >
          <Input className="form-item-input" allowClear />
        </Form.Item>

        <Form.Item
          label="Grupo"
          name="grupo_id"
          rules={[
            {
              required: true,
              message: "El grupo es obligatorio!",
            },
          ]}
        >
          <Select
            options={[
              {
                label: "Grupo 1",
                value: 1,
              },
              {
                label: "Grupo 2",
                value: 2,
              },
            ]}
          />
        </Form.Item>

        <Form.Item
          label="Jefe"
          name="jefe_id"
          rules={[
            {
              required: true,
              message: "El jefe es obligatorio!",
            },
          ]}
        >
          <Select
            options={jefes.map(item =>{
                return{
                    value: item.id,
                    label: item.nombre
                }
            })}
          />
        </Form.Item>

        <Form.Item>
          <Flex justify="end">
            <Button
              htmlType="submit"
              style={{ backgroundColor: " #4DA362 ", color: "white" }}
            >
              {edit ? "Editar" : "Registrar"}
            </Button>
          </Flex>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalInvetariador;
