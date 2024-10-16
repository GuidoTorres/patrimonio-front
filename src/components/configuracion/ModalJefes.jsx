import { Modal, Button, Form, Input, Select, Flex, notification } from "antd";
import React, { useEffect, useState } from "react";

const ModalJefes = ({ modal, setModal, edit, jefes, setEdit }) => {
  const [form] = Form.useForm();
  const [grupos, setGrupos] = useState([]);

  const onClose = () => {
    setModal(false);
    setEdit(null)
  };

  useEffect(() => {
    getGrupos();
  }, []);

  useEffect(() => {
    form.setFieldsValue(edit)
  }, [edit]);
  console.log(edit);
  const onFinish = async (values) => {

    if(!edit){
    const response = await fetch(`${process.env.REACT_APP_BASE}/jefes`, {
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
      jefes();
    } else {
      notification.error({
        message: data.msg,
      });
    }
    }else{
      
      const response = await fetch(`${process.env.REACT_APP_BASE}/jefes/${edit.id}`, {
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
        jefes();
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
            allowClear
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

export default ModalJefes;
