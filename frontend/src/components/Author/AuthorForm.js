import React, { useEffect } from 'react';
import { Form, Input, Button, message } from 'antd';
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";

function AuthorForm() {
    const [form] = Form.useForm();
    const { _id } = useParams();
    const navigate = useNavigate();

    //Get Api call for selected author data
    useEffect(() => {
        const getAuthor = async () => {
            const response = await axios.get(`http://localhost:5000/authors/list/${_id}`);
            form.setFieldsValue({
                name: response.data.name,
                email: response.data.email,
                username: response.data.username,
                password: response.data.password
            });
        }
        if (_id) {
            getAuthor();
        }
    }, [form, _id]);

    //post api call for create a new author
    const createAuthor = async (values) => {
        const fieldsToSave = {
            name: values.name.trim(),
            email: values.email.trim(),
            username: values.username.trim(),
            password: values.password.trim()
        }
        try {
            await axios.post('http://localhost:5000/authors/create', fieldsToSave);
            navigate('/authors');
            message.success('Author created successfully');
        } catch (err) {
            message.error("This email is already exist!")
        }
    }

    //put api call for update a blog
    const updateAuthor = async (values) => {
        const fieldsToSave = {
            name: values.name.trim(),
            email: values.email.trim(),
            username: values.username.trim(),
            password: values.password.trim()
        }
        try {
            await axios.put(`http://localhost:5000/authors/update/${_id}`, fieldsToSave);
            navigate('/authors');
            message.success('Author Updated successfully');
        } catch (err) {
            message.error("This email is already exist!")
        }
    }
    return (
        <div>
            {_id ? <h1>Update Author</h1> : <h1>Add New Author</h1>}
            <Form layout="vertical" form={form} onFinish={_id ? updateAuthor : createAuthor}
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
                <Form.Item>
                    {_id ? <Button type="primary" htmlType="submit">Update Author</Button> :
                        <Button type="primary" htmlType="submit">Add Author</Button>
                    }
                </Form.Item>
            </Form>
        </div >
    );
}

export default AuthorForm;
