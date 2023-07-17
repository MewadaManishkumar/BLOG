import React, { useEffect, useState } from "react";
import { Button, Modal, Typography, Layout, Image, message } from "antd";
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Content } from "antd/es/layout/layout";
import AuthService from '../../services/auth-service'

const { confirm } = Modal;
const { Paragraph, Title } = Typography;

const BlogDetail = () => {
    const { _id } = useParams();
    const navigate = useNavigate();
    const [blog, setBlog] = useState({});
    const UserData = AuthService.getCurrentUser();

    //Get Api call for selected blog data
    useEffect(() => {
        const getBlog = async () => {
            const response = await axios.get(`http://localhost:5000/blogs/list/${_id}`);
            setBlog(response.data)
        }
        if (_id) {
            getBlog();
        }
    }, [_id]);

    // Delete api call for delete blog
    const deleteBlog = async (_id) => {
        await axios.delete(`http://localhost:5000/blogs/delete/${_id}/${UserData.role}`);
        navigate('/');
        message.success('Blog deleted successfully');
    };

    const handleDelete = (_id) => {
        confirm({
            title: 'Do you want to delete this blog?',
            icon: <ExclamationCircleOutlined />,
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                deleteBlog(_id);
            },
        });
    };

    return (
        <Layout className="layout">
            <Content style={{ padding: '0 50px' }}>
                <>
                    <Image src={`http://localhost:5000/images/${blog.avatar}`} alt="Blog Picture"
                        style={{ height: "300px", width: "400px" }} />
                    <Title level={2}>{blog.title}</Title>
                    <Paragraph style={{ textAlign: "initial" }}><strong>Description : </strong>{blog.content}</Paragraph>
                    <Paragraph style={{ textAlign: "initial" }}><strong>Categories : </strong>
                        {blog?.category_id?.map((category) => category?.name)?.toString()}</Paragraph>
                    <Paragraph style={{ textAlign: "initial" }}><strong>By {blog.user_id?.name ? blog.user_id.name : "Unknown Author"}
                    </strong> </Paragraph>
                    <Paragraph style={{ textAlign: "initial", fontWeight: "bold" }}>Posted {blog.createdAt}</Paragraph>
                    {(blog.createdAt === blog.updatedAt) ? null :
                        <Paragraph style={{ textAlign: "initial", fontWeight: "bold" }}>Updated {blog.updatedAt}</Paragraph>
                    }
                    <Link to={`/blogs/update/${_id}`} style={{ padding: 10 }}>
                        <Button type="primary">Edit</Button>
                    </Link>
                    {UserData.role === 'author' ? null : (
                        <Button type="primary" danger onClick={() => handleDelete(_id)}>
                            Delete
                        </Button>
                    )}
                </>
            </Content>
        </Layout>
    )
};

export default BlogDetail;
