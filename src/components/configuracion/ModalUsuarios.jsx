import { Modal, Button, Form, Input, Select, Flex, notification } from "antd";
import React, { useEffect, useState } from "react";

const ModalUsuarios = ({ modal, setModal, edit, usuarios, setEdit }) => {
  const [form] = Form.useForm();
  const [roles, setRoles] = useState([]);
  const [isJefe, setIsJefe] = useState(false); // Estado para manejar si el rol es jefe
  const [isInventariador, setIsInventariador] = useState(false); // Estado para manejar si el rol es inventariador
  const [jefes, setJefes] = useState([]);
  const [inventariadores, setInventariadores] = useState([]);

  useEffect(() => {
    getRoles();
    getJefes();
    getInventariadores();
  }, []);
  useEffect(() => {
    form.setFieldsValue(edit);
  }, [edit]);

  const onClose = () => {
    setModal(false);
    setEdit(null)
  };
  const getRoles = async () => {
    const response = await fetch(`${process.env.REACT_APP_BASE}/roles`);

    if (response.ok) {
      const info = await response.json();
      setRoles(info); // Guardar los bienes en el estado si la respuesta es exitosa
    }
  };
  const getJefes = async () => {
    const response = await fetch(`${process.env.REACT_APP_BASE}/jefes`);
    if (response.ok) {
      const info = await response.json();
      setJefes(info);
    }
  };

  const getInventariadores = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_BASE}/inventariadores`
    );
    if (response.ok) {
      const info = await response.json();
      setInventariadores(info);
    }
  };
  const onFinish = async (values) => {
    if (!edit) {
      const response = await fetch(`${process.env.REACT_APP_BASE}/usuarios`, {
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
        usuarios();
      } else {
        notification.error({
          message: data.msg,
        });
      }
    } else {
      const response = await fetch(
        `${process.env.REACT_APP_BASE}/usuarios/${edit.id}`,
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
        usuarios();
      } else {
        notification.error({
          message: data.msg,
        });
      }
    }
  };

  const handleRoleChange = (value) => {
    // Cambiar el estado según el rol seleccionado
    const selectedRole = roles.find((role) => role.id === value);
    if (selectedRole.nombre === "Jefe") {
      setIsJefe(true);
      setIsInventariador(false);
    } else if (selectedRole.nombre === "Inventariador") {
      setIsJefe(false);
      setIsInventariador(true);
    } else {
      setIsJefe(false);
      setIsInventariador(false);
    }
  };
  return (
    <Modal
      title={edit ? "Editar usuario" : "Registrar usuario"}
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
          label="Nombre de usuario"
          name="nombre_usuario"
          rules={[
            {
              required: true,
              message: "El nombre de usuario es obligatorio",
            },
          ]}
          allowClear
        >
          <Input className="form-item-input" allowClear />
        </Form.Item>

        {!edit && (
          <Form.Item
            label="Contraseña"
            name="contrasenia"
            rules={[
              {
                required: true,
                message: "La contraseña es obligatoria!",
              },
            ]}
            allowClear
          >
            <Input.Password className="form-item-input" />
          </Form.Item>
        )}
        <Form.Item
          label="Rol"
          name="rol_id"
          rules={[
            {
              required: true,
              message: "El rol es obligatorio!",
            },
          ]}
        >
          <Select
            options={roles.map((item) => {
              return {
                value: item.id,
                label: item.nombre,
              };
            })}
            onChange={handleRoleChange}
          />
        </Form.Item>
        {isJefe && (
          <Form.Item
            label="Jefe de Grupo"
            name="jefe_id"
            rules={[
              {
                required: isJefe ? true : false,
                message: "Es obligatorio seleccionar el trabajador!",
              },
            ]}
          >
            <Select
              options={jefes.map((item) => {
                return {
                  value: item.id,
                  label: item.nombre,
                };
              })}
              allowClear
            />
          </Form.Item>
        )}
        {isInventariador && (
          <Form.Item
            label="Inventariador"
            name="inventariador_id"
            rules={[
              {
                required: isInventariador ? true : false,
                message: "Es obligatorio seleccionar el trabajador!",
              },
            ]}
          >
            <Select
              options={inventariadores.map((item) => {
                return {
                  value: item.id,
                  label: item.nombre,
                };
              })}
              allowClear
            />
          </Form.Item>
        )}
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

export default ModalUsuarios;
