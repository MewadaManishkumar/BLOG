import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Space, Table, Typography, Modal, message, Tooltip, Input } from 'antd';
import { ExclamationCircleOutlined, FileAddOutlined, SearchOutlined } from '@ant-design/icons';
import axios from 'axios';
import { CSVLink } from "react-csv";

const { Title } = Typography;
const { confirm } = Modal;

function Category() {
    const [categories, setCategories] = useState([]);

    //get api call for display all categories
    const getCategories = async () => {
        const response = await axios.get('http://localhost:5000/categories/list');
        setCategories(response.data);
    }
    useEffect(() => {
        getCategories();
    }, []);

    //delete api call for delete category
    const deleteCategory = async (category_id) => {
        try {
            const response = await axios.delete(`http://localhost:5000/categories/delete/${category_id}`);
            getCategories(response.data);
            message.success('Category deleted successfully');
        } catch (error) {
            if (error.response.status === 400) {
                message.error(error.response.data.message)
            } else if (error.response.status === 404) {
                message.error(error.response.data.message)
            }
        }
    };

    const handleDelete = (category_id) => {
        confirm({
            title: 'Do you want to delete this category?',
            icon: <ExclamationCircleOutlined />,
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                deleteCategory(category_id);
            },
        });
    };

    const columns = [
        {
            title: 'Category Name',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
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
            onFilter: (value, record) =>
                record.name.toLowerCase().includes(value.toLowerCase()),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, category) => (
                <Space size="middle">
                    <Link to={`/categories/update/${category._id}`}>
                        <Button type="primary">Edit</Button>
                    </Link>
                    <Button type="primary" danger onClick={() => handleDelete(category._id)}>Delete</Button>
                </Space>
            ),
        },
    ]
    const headers = [
        { label: "name", key: "name" }
    ]
    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <Title level={3}>Categories</Title>
                <div>
                    <Link to="/categories/create">
                        <Button type="primary" size="middle" style={{ margin: 3 }}>
                            Create Category
                        </Button>
                    </Link>
                    <Link to={`/categorycsv`}>
                        <Tooltip placement="top" title="Add csv file ">
                            <Button type="primary" size="middle" style={{ margin: 5 }}>
                                <FileAddOutlined />
                            </Button>
                        </Tooltip>
                    </Link>
                    <Tooltip placement="top" title="Export data to csv file ">
                        <Button type="primary" size="middle">
                            <CSVLink data={categories} headers={headers} filename={"CategoryData.csv"} className="btn btn-primary" enclosingCharacter={``}>Export</CSVLink>
                        </Button>
                    </Tooltip>
                </div>
            </div>
            <Table columns={columns} dataSource={categories} rowKey="_id" />
        </>
    );
}
export default Category;

