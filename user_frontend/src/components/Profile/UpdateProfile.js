import React, { useEffect } from 'react';
import { Form, Input, Button, message, Typography } from 'antd';
import { useNavigate, useParams } from "react-router-dom";
import axios from 'axios';

const UpdateProfile = () => {
    const [form] = Form.useForm();
    const { _id } = useParams();
    const navigate = useNavigate();

    //Get Api call for selected enduser data
    useEffect(() => {
        const getUser = async () => {
            const response = await axios.get(`http://localhost:5000/users/list/${_id}`);
            form.setFieldsValue({
                name: response.data.name,
                email: response.data.email,
                username: response.data.username,
                password: response.data.password
            });
        }
        if (_id) {
            getUser();
        }
    }, [form, _id]);

    const updateUser = async (values) => {
        const fieldsToSave = {
            name: values.name.trim(),
            email: values.email.trim(),
            username: values.username.trim(),
            password: values.password.trim()
        }
        try {
            await axios.put(`http://localhost:5000/users/update/${_id}`, fieldsToSave);
            navigate(`/users/list/${_id}`);
            message.success('User updated successfully');
        } catch (error) {
            if (error.response.status === 400) {
                message.error(error.response.data.message);
            }
        }
    }

    return (
        <div>
            <Form layout="vertical" form={form} onFinish={updateUser}
                className="login-form"
                autoComplete="off"
            >
                {_id && <Typography.Title level={3} style={{ textAlign: 'center' }}>Update User</Typography.Title>}
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
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Password"
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your password!',
                            min: 6
                        }
                    ]}
                >
                    {_id ? <Input.Password disabled /> : <Input.Password />}

                </Form.Item>
                <Form.Item>
                    {_id ? <Button type="primary" htmlType="submit">Update User</Button> :
                        <Button type="primary" htmlType="submit">Add User</Button>
                    }
                </Form.Item>
            </Form>
        </div>);
}

export default UpdateProfile;