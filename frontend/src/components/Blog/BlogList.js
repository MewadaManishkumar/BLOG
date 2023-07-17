import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { List, Button, Typography, Card, Image, Tooltip, Table, Space, Input } from 'antd';
import axios from 'axios';
import AuthService from '../../services/auth-service'
import { FileAddOutlined, SearchOutlined } from '@ant-design/icons';
import { CSVLink } from "react-csv";

const { Title, Paragraph } = Typography;

function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const userRole = AuthService.getCurrentUser();

  //Get Api call for display all blogs 
  useEffect(() => {
    const getBlogs = async () => {
      let tempAPI;
      if (userRole.role === 'masterAdmin' || userRole.role === 'admin') {
        // get all blogs 
        tempAPI = await axios.get('http://localhost:5000/blogs/list');
        setBlogs(tempAPI.data);
      } else {
        // get only author blogs here
        tempAPI = await axios.get(`http://localhost:5000/blogs/author/${userRole._id}`);
        setBlogs(tempAPI.data);
      }
    };
    getBlogs();
  }, [userRole.role, userRole._id]);

  const headers = [
    { label: "title", key: "title" },
    { label: "content", key: "content" },
    { label: "user", key: "user_id.email" },
    { label: "category", key: "category_id" }
  ]

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      sorter: (a, b) => a.title.localeCompare(b.title),
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search title"
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onKeyUp={confirm}
            style={{ marginBottom: 8, display: 'block' }}
          />
        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
      ),
      onFilter: (value, record) =>
        record.title.toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: 'Content',
      dataIndex: 'content',
      key: 'content',
      render: (text) => (<Paragraph ellipsis={{ rows: 3, expandable: false, }}>{text}</Paragraph>),
    },
    {
      title: 'Author',
      dataIndex: 'user_id',
      key: 'user_id',
      render: (user) => (<Paragraph>{user?.name}</Paragraph>),
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search author"
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onKeyUp={confirm}
            style={{ marginBottom: 8, display: 'block' }}
          />
        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
      ),
      onFilter: (value, record) =>
        record.user_id.name.toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: 'Category',
      dataIndex: 'category_id',
      key: 'category_id',
      render: (categories) => (<Paragraph>{categories?.map((category) => category?.name)?.toString()}</Paragraph>),
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search category"
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onKeyUp={confirm}
            style={{ marginBottom: 8, display: 'block' }}
          />
        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
      ),
      onFilter: (value, record) => {
        const categoryNames = record.category_id.map(category => category.name.toLowerCase());
        return categoryNames.some(name => name.includes(value.toLowerCase()));
      }
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Link to={`/blogs/list/${record._id}`}>
          <Button type="primary">Read more</Button>
        </Link>
      ),
    },
  ];

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={3}>Blogs</Title>
        <div>
          <Link to="/blogs/create">
            <Button type="primary" size="middle" style={{ margin: 3 }}>
              Create Blog
            </Button>
          </Link>
          <Link to={`/blogcsv`}>
            <Tooltip placement="top" title="Add csv file ">
              <Button type="primary" size="middle" style={{ margin: 5 }}>
                <FileAddOutlined />
              </Button>
            </Tooltip>
          </Link>
          <Tooltip placement="top" title="Export data to csv file ">
            <Button type="primary" size="middle">
              <CSVLink data={blogs} headers={headers} filename={"BlogData.csv"} className="btn btn-primary" enclosingCharacter={``}>Export</CSVLink>
            </Button>
          </Tooltip>
        </div>
      </div>
      {(userRole.role === 'masterAdmin' || userRole.role === 'admin') ?
        <Table columns={columns} dataSource={blogs} rowKey="_id" />
        :
        <List
          grid={{
            gutter: 16,
            xs: 1,
            sm: 2,
            md: 3,
            lg: 4,
            xl: 4,
            xxl: 4,
          }}
          pagination={{
            pageSize: 12,
          }}
          dataSource={blogs}
          renderItem={(blog) => {
            return (
              <List.Item>
                <Card
                  hoverable
                  title={blog.title}
                  cover={<Image src={`http://localhost:5000/images/${blog.avatar}`} alt="BlogPicture" style={{ width: 343, height: 200 }} />}
                >
                  <Paragraph ellipsis={{ rows: 3, expandable: false, }}><strong>Content: </strong>{blog.content}</Paragraph>
                  <Paragraph><strong>Author: </strong>{blog?.user_id?.name}</Paragraph>
                  <Paragraph><strong>Category: </strong>{blog?.category_id?.map((category) => category?.name)?.toString()}</Paragraph>
                  <Link to={`/blogs/list/${blog?._id}`}>
                    <Button type="primary" style={{ float: 'left' }}>Read more</Button>
                  </Link>
                </Card>
              </List.Item>
            )
          }
          }
        />
      }
    </>
  );
}

export default BlogList;

