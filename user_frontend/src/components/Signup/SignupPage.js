import './SignupPage.css'
import React from 'react';
import { Form, Input, Button, message, Typography } from 'antd';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const SignupPage = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();

    //post api call for create a new enduser
    const createUser = async (values) => {
        const fieldsToSave = {
            name: values.name.trim(),
            email: values.email.trim(),
            username: values.username.trim(),
            password: values.password.trim()
        }
        try {
            await axios.post('http://localhost:5000/users/create', fieldsToSave);
            navigate('/endUser/login');
            message.success('Account created successfully');
        } catch (error) {
            if (error.response.status === 400) {
                message.error("This email is already exist!")
            }
        }
    }

    return (
        <>
            <Form layout="vertical" form={form} onFinish={createUser}
                className="signup-form"
                autoComplete="off"
            >
                <Typography.Title level={3} style={{ textAlign: "center" }}>Signup Form</Typography.Title>
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
                    <Input placeholder='John Doe' />
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
                    <Input onInput={e => e.target.value = e.target.value.toLowerCase()} placeholder='john@gmail.com' />
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
                    <Input placeholder='johndoe#123' />
                </Form.Item>
                <Form.Item
                    label="Password"
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your password!',
                        },
                        { min: 6 },
                        { max: 20 }
                    ]}
                    normalize={(value, prevVal, prevVals) => value.trim()}
                >
                    <Input.Password placeholder='Enter password between 6-20 character' />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" className="signup-form-button">Submit</Button>
                </Form.Item>
            </Form>
        </ >
    );
}

export default SignupPage;