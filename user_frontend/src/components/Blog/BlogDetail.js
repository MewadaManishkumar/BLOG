import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Image, Typography } from "antd";
import axios from "axios";
import "../../App.css";

const BlogDetail = () => {
    const { _id } = useParams();
    const [blogs, setBlogs] = useState([]);
    useEffect(() => {
        const getBlog = async () => {
            const response = await axios.get(
                `http://localhost:5000/blogs/list/${_id}`
            );
            setBlogs(response.data);
        };
        if (_id) {
            getBlog();
        }
    }, [_id]);

    return (
        <div className="post-page">
            <Typography.Title level={3} style={{ textAlign: "center" }}>{blogs.title}</Typography.Title>
            <Image src={`http://localhost:5000/images/${blogs.avatar}`} alt="blog_image" preview={false} rootClassName="antdImage" />
            <Typography.Paragraph><strong>Description</strong> : {blogs.content}</Typography.Paragraph>
            <Typography.Paragraph><strong>Categories</strong> : {blogs?.category_id?.map((category) => category?.name)?.toString()}</Typography.Paragraph>
            <Typography.Paragraph><strong>Created By : {blogs?.user_id?.name}</strong></Typography.Paragraph>
            <Typography.Paragraph strong>Created {blogs.createdAt}</Typography.Paragraph>
            {(blogs.createdAt !== blogs.updatedAt) ? <Typography.Paragraph strong>Updated {blogs.updatedAt}</Typography.Paragraph> : null}
        </div>
    );
}

export default BlogDetail;
