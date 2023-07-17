import { UploadOutlined } from "@ant-design/icons";
import { Form, Button, Typography, Upload, message, Table, Tag, Spin } from "antd";
import axios from "axios";
import React, { useState } from "react";
import { useParams } from "react-router-dom";

const CsvUpload = () => {
    const [csvUserForm] = Form.useForm();
    const [users, setUserData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const { role } = useParams();

    const handleOnSubmit = async (values) => {
        setIsLoading(true);
        csvUserForm.validateFields().then(async () => {
            const data = new FormData();
            if (values?.csvfile?.file?.status === "error" || values?.csvfile?.file?.status === "removed") {
                message.error("Please upload a csv file")
                setIsLoading(false);
                return false;
            }
            if (values?.csvfile?.file?.originFileObj && values?.csvfile?.file?.status !== "removed" && values?.csvfile?.file?.status === "done") {
                data.append('csvfile', values?.csvfile?.file?.originFileObj)
            }
            try {
                await axios.post(`http://localhost:5000/csvUpload/${role}`, data, {
                    headers: {
                        'Content-Type': "multipart/form-data"
                    }
                }).then((addedUserData) => {
                    setUserData(addedUserData.data.data)
                });
                message.success("Users Added Successfully");
            } catch (err) {
                message.error("Something Went Wrong")
            }
            setIsLoading(false);
            csvUserForm.resetFields();
        }).catch((err) => {
            message.error(err)
        })
    }

    const allowedFileTypes = ["text/csv"];
    const dummyRequest = ({ file, onError, onSuccess }) => {
        if (!allowedFileTypes.includes(file.type)) {
            onError(message.error("You can only upload csv file!"))
            return false;
        } else {
            setTimeout(() => {
                onSuccess("ok");
            }, 0)
        }
    }

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Username',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: 'Has_Error',
            dataIndex: 'is_error',
            key: 'is_error',
            render(value) {
                return value ?
                    <Tag color="volcano">Has Error</Tag> :
                    <Tag color="green">No Error</Tag>
            }
        }, {
            title: 'Error_Message',
            dataIndex: 'err_msg',
            key: 'err_msg',
            render(value) {
                return value ?
                    <Tag color="volcano">{value}</Tag> :
                    <Tag color="green">User Added</Tag>
            }

        }
    ]
    return (
        <>
            {isLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <Spin tip="Loading..." />
                </div>
            ) : (
                <>
                    <div>
                        <Typography.Title level={4} style={{ textAlign: "center" }}>Upload Csv File</Typography.Title>
                        <Form
                            layout="vertical"
                            form={csvUserForm}
                            onFinish={handleOnSubmit}
                            encType="multipart/form-data"
                            style={{
                                padding: 10,
                                display: 'inline-block',
                                justifyContent: 'center',
                                width: 300,
                            }}
                            disabled={isLoading}
                        >
                            <Form.Item
                                label="Upload .csv file"
                                name="csvfile"
                                valuePropName="file"
                                rules={[{ required: true, message: 'Please Select a file' }]}
                            >
                                <Upload name="csvfile" accept=".csv" maxCount={1} customRequest={dummyRequest} disabled={isLoading}>
                                    <Button icon={<UploadOutlined />} disabled={isLoading}>Click to upload</Button>
                                </Upload>
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" disabled={isLoading}>Submit</Button>
                            </Form.Item>
                        </Form>
                    </div>
                    <Table columns={columns} dataSource={users} rowKey="_id" />
                </>
            )}
        </>
    )
}

export default CsvUpload;