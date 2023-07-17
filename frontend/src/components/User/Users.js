import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Table, Space, Typography, Modal, message, Tooltip, Input } from 'antd';
import axios from 'axios';
import { ExclamationCircleOutlined, FileAddOutlined, SearchOutlined } from '@ant-design/icons';
import { CSVLink } from "react-csv";

const { Title } = Typography;
const { confirm } = Modal;

function User() {
  const [users, setUsers] = useState([]);

  //get api call for display all endusers
  const getUsers = async () => {
    const response = await axios.get('http://localhost:5000/users/list');
    setUsers(response.data);
  }
  useEffect(() => {
    getUsers();
  }, []);

  //delete api call for delete endusers
  const deleteUser = async (user_id) => {
    const response = await axios.delete(`http://localhost:5000/users/delete/${user_id}`);
    getUsers(response.data);
    message.success('User deleted successfully');
  };

  const handleDelete = (user_id) => {
    confirm({
      title: 'Do you want to delete this user?',
      icon: <ExclamationCircleOutlined />,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        deleteUser(user_id);
      },
    });
  };

  const columns = [
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
      title: 'Action',
      key: 'action',
      render: (_, user) => (
        <Space size="middle">
          <Link to={`/users/update/${user._id}`}>
            <Button type="primary">Edit</Button>
          </Link>
          <Button type="primary" onClick={() => handleDelete(user._id)} danger>Delete</Button>
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
        <Title level={3}>Users</Title>
        <div>
          <Link to="/users/create">
            <Button type="primary" size="middle" style={{ margin: 3 }}>
              Create User
            </Button>
          </Link>
          <Link to={`/csvUpload/user`}>
            <Tooltip placement="top" title="Add csv file ">
              <Button type="primary" size="middle" style={{ margin: 5 }}>
                <FileAddOutlined />
              </Button>
            </Tooltip>
          </Link>
          <Tooltip placement="top" title="Export data to csv file ">
            <Button type="primary" size="middle">
            <CSVLink data={users} headers={headers} filename={"UserData.csv"} className="btn btn-primary" enclosingCharacter={``}>Export</CSVLink>
          </Button>
        </Tooltip>
      </div>
    </div >
      <Table columns={columns} dataSource={users} rowKey="_id" />
    </>
  );
}

export default User;