import React, { useEffect } from 'react';
import { Form, Input, Button, Select, message } from 'antd';
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";

const { Option } = Select;

function AdminForm() {
    const [form] = Form.useForm();
    const { _id } = useParams();
    const navigate = useNavigate();

    //Get Api call for selected admin data
    useEffect(() => {
        const getAdmin = async () => {
            const response = await axios.get(`http://localhost:5000/admins/list/${_id}`);
            form.setFieldsValue({
                name: response.data.name,
                email: response.data.email,
                username: response.data.username,
                password: response.data.password,
                role: response.data.role
            });
        }
        if (_id) {
            getAdmin();
        }
    }, [form, _id]);

    //post api call for create a new admin
    const createAdmin = async (values) => {
        const fieldsToSave = {
            name: values.name.trim(),
            email: values.email.trim(),
            username: values.username.trim(),
            password: values.password.trim(),
            role: values.role
        }
        try {
            await axios.post('http://localhost:5000/admins/create', fieldsToSave);
            navigate('/admins');
            message.success('Admin created successfully');
        } catch (err) {
            message.error("This email is already exist!")
        }
    }

    //put api call for update a admin
    const updateAdmin = async (values) => {
        const fieldsToSave = {
            name: values.name.trim(),
            email: values.email.trim(),
            username: values.username.trim(),
            password: values.password.trim(),
            role: values.role
        }
        try {
            await axios.put(`http://localhost:5000/admins/update/${_id}`, fieldsToSave);
            navigate('/admins');
            message.success('Admin updated successfully');
        } catch (err) {
            message.error("This email is already exist!")
        }
    }

    return (
        <div>
            {_id ? <h1>Update Admin</h1> : <h1>Add New Admin</h1>}
            <Form layout="vertical" form={form} onFinish={_id ? updateAdmin : createAdmin}
                style={{
                    padding: 10,
                    display: 'inline-block',
                    justifyContent: 'center',
                    width: 300,
                }}
                autoComplete="off"
            >
                <Form.Item
                    label="Name"
                    name="name"
                    rules={[
                        {
                            required: true,
                            message: ""
                        },
                        {
                            validator: (_, value) => {
                                if (value.length < 3) {
                                    return Promise.reject(new Error('Name length should be grater than 3'));
                                }
                                else if (value.length > 20) {
                                    return Promise.reject(new Error('Name length should be less than 20'));
                                }
                                else if (value !== value.trim()) {
                                    return Promise.reject(new Error("spacearound is not allowed"));
                                }
                                else {
                                    return Promise.resolve()
                                }
                            }
                        }
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        {
                            message: 'The input is not valid E-mail!',
                            pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i,
                        },
                        {
                            required: true,
                            message: 'Please enter email',
                        }
                    ]}
                    normalize={(value, prevVal, prevVals) => value.trim()}
                >
                    <Input onInput={e => e.target.value = e.target.value.toLowerCase()}/>
                </Form.Item>
                <Form.Item
                    label="Username"
                    name="username"
                    rules={[
                        {
                            required: true,
                            message: ""
                        },
                        {
                            validator: (_, value) => {
                                if (value.length < 5) {
                                    return Promise.reject(new Error('Username length should be grater than 5'));
                                }
                                else if (value.length > 20) {
                                    return Promise.reject(new Error('Username length should be less than 20'));
                                }
                                else if (value !== value.replace(/ +/g, "")) {
                                    return Promise.reject(new Error("Whitespace is not allowed in username"));
                                }
                                else {
                                    return Promise.resolve()
                                }
                            }
                        }
                    ]}
                    normalize={(value, prevVal, prevVals) => value.trim()}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Password"
                    name="password"
                    rules={_id ? [
                        {
                            required: true,
                            message: 'Please input your password!',
                        }
                    ] : [
                        {
                            required: true,
                            message: 'Please input your password!',
                        },
                        { min: 6 },
                        { max: 20 }
                    ]
                    }
                    normalize={(value, prevVal, prevVals) => value.trim()}
                >
                    {_id ? <Input.Password disabled /> : <Input.Password />}
                </Form.Item>
                <Form.Item
                    label="Select Admin Role"
                    name="role"
                    rules={[{ required: true, message: 'Please Select Role For Admin ' }]}
                >
                    <Select
                        placeholder="Select a option and change input text above"
                        allowClear
                    >
                        <Option value="masterAdmin">Master_Admin</Option>
                        <Option value="admin">Admin</Option>
                    </Select>
                </Form.Item>
                <Form.Item>
                    {_id ? <Button type="primary" htmlType="submit">Update Admin</Button> :
                        <Button type="primary" htmlType="submit">Add Admin</Button>
                    }
                </Form.Item>
            </Form>
        </div >
    );
}

export default AdminForm;
