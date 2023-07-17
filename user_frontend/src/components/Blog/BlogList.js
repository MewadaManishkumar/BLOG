import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { List, Typography, Card, Image, Button, Select } from "antd";
import axios from "axios";

const { Title, Paragraph } = Typography;

const BlogList = () => {
    const [blogs, setBlogs] = useState([]);
    const [authorData, setAuthorData] = useState([]);
    const [categoryData, setCategoryData] = useState([]);

    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedAuthor, setSelectedAuthor] = useState(null);

    useEffect(() => {
        const getBlogs = async () => {
            const response = await axios.get("http://localhost:5000/blogs/list");
            setBlogs(response.data);
        };
        getBlogs();
    }, []);

    ////////////Get Authors//////////
    const getAuthors = async () => {
        const authors = await axios.get('http://localhost:5000/authors/list');
        (!authors) ? setAuthorData([]) : setAuthorData(authors.data);
    }
    useEffect(() => {
        getAuthors();
    }, []);

    //////////Get Categories/////////
    const getCategories = async () => {
        const categories = await axios.get('http://localhost:5000/categories/list');
        (!categories) ? setCategoryData([]) : setCategoryData(categories.data);
    }
    useEffect(() => {
        getCategories();
    }, [])

    //////////Authors select options////////
    const author = authorData?.map((d) => (
        <Select.Option key={d._id} value={d._id} >{d.name}</Select.Option>
    ));

    ///////////Category select options/////////
    const category = categoryData?.map((d) => (
        <Select.Option key={d._id} value={d._id}>{d.name}</Select.Option>
    ));

    ////////////Filter Function/////////////////
    const getFilteredList = () => {
        let filteredList = blogs;
        if (!selectedCategory && !selectedAuthor) {
            return blogs;
        }
        if (selectedCategory) {
            const filteredList = blogs?.filter((blog) => {
                const blogCategoryIds = blog.category_id.map((category) => category._id);
                return selectedCategory.some((categoryId) => blogCategoryIds.includes(categoryId));
            });
            return filteredList
        }
        else if (selectedAuthor) {
            const filteredList = blogs?.filter((item) => item?.user_id?._id.includes(selectedAuthor));
            return filteredList
        }
        return filteredList
    }

    const filteredListData = useMemo(getFilteredList, [blogs, selectedAuthor, selectedCategory])

    return (
        <>
            <Title level={3}>Blogs</Title>
            <Select
                mode="multiple"
                placeholder="Filter blogs by Category"
                allowClear
                style={{ width: 300, margin: 20 }}
                onChange={(value) => { setSelectedCategory(value && value.length > 0 ? value : null) }}
            >
                {category}
            </Select>
            <Select
                placeholder="Filter blogs by Authors"
                allowClear
                style={{ width: 300, margin: 20 }}
                onChange={(value) => setSelectedAuthor(value)}
            >
                {author}
            </Select>
            <List
                grid={{
                    gutter: 16,
                    xs: 1,
                    sm: 2,
                    md: 3,
                    lg: 3,
                    xl: 4,
                    xxl: 4,
                }}
                dataSource={filteredListData}
                renderItem={(filteredListData) => (
                    <List.Item>
                        <Card
                            hoverable
                            title={filteredListData.title}
                            cover={<Image src={`http://localhost:5000/images/${filteredListData.avatar}`} alt="BlogPicture" style={{ width: 343, height: 200 }} />}
                        >
                            <Paragraph ellipsis={{ rows: 3, expandable: false, }}><strong>Content: </strong>{filteredListData?.content}</Paragraph>
                            <Paragraph><strong>Author: </strong>{filteredListData?.user_id?.name}</Paragraph>
                            <Paragraph><strong>Category: </strong>{filteredListData?.category_id?.map((category) => category?.name)?.toString()}</Paragraph>
                            <Link to={`/blogs/list/${filteredListData._id}`}>
                                <Button type="primary" style={{ float: 'left' }}>Read more</Button>
                            </Link>
                        </Card>
                    </List.Item >)
                }
            />
        </>
    );
}

export default BlogList;