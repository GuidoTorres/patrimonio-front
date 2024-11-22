import { Modal, Button, Form, Input, Select, Flex, notification } from "antd";
import React, { useEffect, useState } from "react";

const ModalTrabajadores = ({ modal, setModal, edit, jefes, setEdit }) => {
    const [form] = Form.useForm();

    const onClose = () => {
        setModal(false);
        setEdit(null)
    };

    useEffect(() => {
        form.setFieldsValue(edit)
    }, [edit]);

    const onFinish = async (values) => {

        if (!edit) {
            const response = await fetch(`${process.env.REACT_APP_BASE}/trabajadores`, {
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
        } else {
            const response = await fetch(`${process.env.REACT_APP_BASE}/trabajadores/${edit.id}`, {
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

    return (
        <Modal
            title={edit ? "Editar Trabajador" : "Registrar Trabajador"}
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
                    label="DNI"
                    name="dni"
                    rules={[
                        {
                            required: true,
                            message: "El dni es obligatorio!",
                        },
                    ]}
                >
                    <Input className="form-item-input" allowClear />

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
    )
}

export default ModalTrabajadores