import React, { useState, useEffect } from 'react';
import { Button, Space, Table, Typography, Modal, message, Input } from 'antd';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ExclamationCircleOutlined,SearchOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { confirm } = Modal;

function Admin() {
  const [admins, setAdmins] = useState([]);

  //get api call for display all admins
  const getAdmins = async () => {
    const response = await axios.get('http://localhost:5000/admins/list');
    setAdmins(response.data);
  }
  useEffect(() => {
    getAdmins();
  }, []);

  //delete api call for delete admina
  const deleteAdmin = async (admin_id) => {
    const response = await axios.delete(`http://localhost:5000/admins/delete/${admin_id}`);
    message.success('Admin deleted successfully');
    getAdmins(response.data);
  };
  const handleDelete = (admin_id) => {
    confirm({
      title: 'Do you want to delete this admin?',
      icon: <ExclamationCircleOutlined />,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        deleteAdmin(admin_id);
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
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      filters: [
        {
          text: 'MasterAdmin',
          value: 'masterAdmin',
        },
        {
          text: 'Admin',
          value: 'admin',
        },
      ],
      onFilter: (value, record) => record.role === value,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, admin) => (
        <Space size="middle">
          <Link to={`/admins/update/${admin._id}`}>
            <Button type="primary">Edit</Button>
          </Link>
          <Button type="primary" onClick={() => handleDelete(admin._id)} danger>Delete</Button>
        </Space>
      ),
    },]

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={3}>Admins</Title>
        <Link to="/admins/create">
          <Button type="primary" size="middle">
            Create Admin
          </Button>
        </Link>
      </div>
      <Table columns={columns} dataSource={admins} rowKey="_id" />
    </>
  );
}

export default Admin;