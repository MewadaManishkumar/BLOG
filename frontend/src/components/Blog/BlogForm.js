import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Select, Upload, Image, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import AuthService from '../../services/auth-service';

function BlogForm() {
    const { _id } = useParams();
    const navigate = useNavigate();
    const [blogForm] = Form.useForm();
    const userRole = AuthService.getCurrentUser();

    const [avatar, setAvatar] = useState('');
    const [authorData, setAuthorData] = useState([]);
    const [categoryData, setCategoryData] = useState([]);

    //Get Api call for selected blog data
    useEffect(() => {
        const getBlog = async () => {
            const response = await axios.get(`http://localhost:5000/blogs/list/${_id}`);
            blogForm.setFieldsValue({
                title: response.data.title,
                content: response.data.content,
                user: response.data.user_id._id,
                category: response.data.category_id.map((category) => category._id)
            });
            setAvatar(response.data.avatar)
        }
        if (_id) {
            getBlog();
        }
    }, [blogForm, _id]);

    //Get Api call for authorData
    const getAuthors = async () => {
        const authors = await axios.get('http://localhost:5000/authors/list');
        (!authors) ? setAuthorData([]) : setAuthorData(authors.data);
    }
    useEffect(() => {
        getAuthors();
    }, []);

    //Get Api call for categoryData
    const getCategories = async () => {
        const categories = await axios.get('http://localhost:5000/categories/list');
        (!categories) ? setCategoryData([]) : setCategoryData(categories.data);
    }
    useEffect(() => {
        getCategories();
    }, [])

    //Post api call for create a new blog
    const createBlog = async (values) => {
        blogForm.validateFields().then(async () => {
            const data = new FormData();
            data.append('title', values?.title);
            data.append('content', values?.content);
            data.append('user', values?.user);

            if (values?.category) {
                if (Array.isArray(values.category)) {
                    values.category.forEach((category) => {
                        data.append('category', category);
                    });
                } else {
                    data.append('category', values?.category);
                }
            }
            if (values?.avatar?.file?.status === "error") {
                message.error("One or more form field has error")
                return false;
            }
            if (values?.avatar?.file?.originFileObj && values?.avatar?.file?.status !== "removed") {
                data.append('avatar', values?.avatar?.file?.originFileObj);
            }
            try {
                await axios.post('http://localhost:5000/blogs/create', data, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
                );
                navigate('/')
                message.success('Blog created successfully');
            } catch (err) {
                if (err.response.status === 500) {
                    message.error("Internal Server Error")
                }
            }
        }).catch((err) => {
            message.error(err)
        });
    }

    const allowedFileTypes = ["image/jpeg", "image/jpg", "image/png"];
    const dummyRequest = ({ file, onError, onSuccess }) => {
        if (!allowedFileTypes.includes(file.type)) {
            onError(message.error("You can only upload JPG, JPEG or PNG files!"))
            return false;
        } else {
            setTimeout(() => {
                onSuccess("ok");
            }, 0);
        }

    };

    //put api call for create a new blog
    const updateBlog = async (values) => {
        blogForm.validateFields().then(async () => {
            const data = new FormData();
            data.append('title', values?.title);
            data.append('content', values?.content);
            data.append('user', values?.user);

            if (Array.isArray(values.category)) {
                values.category.forEach((category) => {
                    data.append('category', category);
                });
            } else {
                data.append('category', values?.category);
            }
            if (values?.avatar?.file?.status === "error") {
                message.error("One or more form field has error")
                return false;
            }
            if (values?.avatar?.file?.originFileObj && values?.avatar?.file?.status !== "removed") {
                data.append('avatar', values?.avatar?.file?.originFileObj);
            }
            try {
                await axios.put(`http://localhost:5000/blogs/update/${_id}`, data);
                navigate('/')
                message.success('Blog updated successfully');
            } catch (err) {
                if (err.response.status === 500) {
                    message.error("Internal Server Error")
                }
            }
        }).catch((err) => {
            message.error(err)
        })
    }

    //Options for Select Dropdown
    const author = authorData?.map((d) => (
        <Select.Option key={d._id} value={d._id} >{d.name}</Select.Option>
    ));

    const category = categoryData?.map((d) => (
        <Select.Option key={d._id} value={d._id}>{d.name}</Select.Option>
    ));

    return (
        <>
            {_id ? <h1>Update Blog</h1> : <h1>Add New Blog</h1>}
            <Form layout="vertical"
                form={blogForm}
                onFinish={_id ? updateBlog : createBlog}
                onFinishFailed={(error) => {
                    // message.error("Submit failed!")
                }}
                encType="multipart/form-data"
                style={{
                    padding: 10,
                    display: 'inline-block',
                    justifyContent: 'center',
                    width: 400,
                }}
                scrollToFirstError
            >
                <Form.Item
                    label="Blog Title"
                    name="title"
                    rules={[{ required: true, message: 'Please enter a title' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Content"
                    name="content"
                    rules={[{ required: true, message: 'Please enter some content' }]}
                >
                    <Input.TextArea />
                </Form.Item>
                <Form.Item
                    label="Author"
                    name="user"
                    rules={[{ required: true, message: 'Please Select Author' }]}

                >
                    {(userRole.role === 'author') ?
                        <Select>
                            <Select.Option key={userRole._id} value={userRole._id}>{userRole.name}</Select.Option>
                        </Select> :
                        <Select
                            placeholder="Select a option and change input text above"
                            allowClear
                        >
                            {author}
                        </Select>}
                </Form.Item>
                <Form.Item
                    label="Select Category"
                    name="category"
                    rules={[{ required: true, message: 'Please Select Category For Blog ' }]}
                >
                    <Select
                        mode="multiple"
                        placeholder="Select a option and change input text above"
                        allowClear
                    >
                        {category}
                    </Select>
                </Form.Item>
                <Form.Item
                    name="avatar"
                    label="Upload Image (size < 3 MB)"
                    valuePropName="file"
                >
                    <Upload name="avatar" listType="picture" maxCount={1} customRequest={dummyRequest}>
                        <Button icon={<UploadOutlined />}>Click to upload</Button>
                        {_id ? <Image src={`http://localhost:5000/images/${avatar}`} alt="BlogPicture" /> : ""}
                    </Upload>
                </Form.Item>
                <Form.Item>
                    {_id ? <Button type="primary" htmlType="submit">Update Blog</Button> :
                        <Button type="primary" htmlType="submit">Add Blog</Button>
                    }
                </Form.Item>
            </Form >
        </>
    );
}

export default BlogForm;