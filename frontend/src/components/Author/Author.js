import React, { useState, useEffect } from 'react';
import { Button, Space, Table, Typography, Modal, message, Tag, Tooltip, Input } from 'antd';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ExclamationCircleOutlined, FileAddOutlined, SearchOutlined } from '@ant-design/icons';
import { CSVLink } from "react-csv";
import '../../App.css'

const { Title } = Typography;
const { confirm } = Modal;

function Author() {
  const [authors, setAuthors] = useState([]);

  //get api call for display all Authors
  const getAuthors = async () => {
    const response = await axios.get('http://localhost:5000/authors/list');
    setAuthors(response.data);
  }
  useEffect(() => {
    getAuthors();
  }, []);

  //delete api call for delete author
  const deleteAuthor = async (author_id, isDeleted) => {
    const response = await axios.delete(`http://localhost:5000/authors/delete/${author_id}/${isDeleted}`);
    getAuthors(response.data);
    (response.data.isDeleted === false) ? message.success('Login access removed successfully') : message.success('Login access given successfully')
  };

  const handleDelete = (author_id, isDeleted) => {
    (isDeleted === false) ?
      confirm({
        title: 'Do you want to delete this author?',
        icon: <ExclamationCircleOutlined />,
        okText: 'Yes',
        okType: 'danger',
        cancelText: 'No',
        onOk() {
          deleteAuthor(author_id, isDeleted);
        },
      }) : confirm({
        title: 'Do you want to give access to this author?',
        icon: <ExclamationCircleOutlined />,
        okText: 'Yes',
        okType: 'danger',
        cancelText: 'No',
        onOk() {
          deleteAuthor(author_id, isDeleted);
        },
      })

  };

  const columns = [
    {
      title: 'Profile',
      dataIndex: 'name',
      key: 'profile',
      render: (name) => {
        const nameArray = name.split(' ')
        let initials = '';
        nameArray.forEach(name => {
          initials += name.charAt(0);
        })
        return <div className='circle'><Typography.Text className='circle-inner'>{initials}</Typography.Text></div>
      },
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search name"
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
        record.name.toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: (a, b) => a.email.localeCompare(b.email),
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search email"
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
        record.email.toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
      sorter: (a, b) => a.username.localeCompare(b.username),
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search username"
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
        record.username.toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: 'Status',
      dataIndex: 'isDeleted',
      key: 'isDeleted',
      render(value) {
        return value ?
          <Tag color="volcano">Deleted</Tag> :
          <Tag color="green">Not Deleted</Tag>
      },
      filters: [
        {
          text: 'Deleted',
          value: true,
        },
        {
          text: 'Not Deleted',
          value: false,
        },
      ],
      onFilter: (value, record) => record.isDeleted === value,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, author) => (
        <Space size="middle">
          <Link to={`/authors/update/${author._id}`}>
            <Button type="primary">Edit</Button>
          </Link>
          {(author.isDeleted === false) ?
            <Button type="primary" danger onClick={() => handleDelete(author._id, author.isDeleted)}>Delete</Button> :
            <Button type="default" onClick={() => handleDelete(author._id, author.isDeleted)}>Give Access</Button>}
        </Space>
      ),
    }]

  const headers = [
    { label: "name", key: "name" },
    { label: "email", key: "email" },
    { label: "username", key: "username" },
    { label: "password", key: "password" }
  ]

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={3}>Authors</Title>
        <div>
          <Link to="/authors/create">
            <Button type="primary" size="middle" style={{ margin: 3 }}>
              Create Author
            </Button>
          </Link>
          <Link to="/csvUpload/author">
            <Tooltip placement="top" title="Add csv file ">
              <Button type="primary" size="middle" style={{ margin: 5 }}>
                <FileAddOutlined />
              </Button>
            </Tooltip>
          </Link>
          <Tooltip placement="top" title="Export data to csv file ">
            <Button type="primary" size="middle">
              <CSVLink data={authors} headers={headers} filename={"AuthorData.csv"} className="btn btn-primary" enclosingCharacter={``}>Export</CSVLink>
            </Button>
          </Tooltip>
        </div>
      </div>
      <Table columns={columns} dataSource={authors} rowKey="_id" />
    </>
  );
}

export default Author;