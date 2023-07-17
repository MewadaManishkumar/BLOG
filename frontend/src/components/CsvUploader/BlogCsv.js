import { UploadOutlined } from "@ant-design/icons";
import { Form, Button, Typography, Upload, message, Table, Tag, Spin } from "antd";
import axios from "axios";
import { useState } from "react";

const BlogCsv = () => {
    const [csvBlogForm] = Form.useForm();
    const [blogData, setBlogData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleOnSubmit = async (values) => {
        setIsLoading(true);
        csvBlogForm.validateFields().then(async () => {
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
                await axios.post(`http://localhost:5000/blogcsv`, data, {
                    headers: {
                        'Content-Type': "multipart/form-data"
                    }
                }).then((addedUserData) => {
                    setBlogData(addedUserData.data.data)
                });
                message.success("Blogs Added Successfully");
            } catch (err) {
                message.error("Something Went Wrong")
            }
            csvBlogForm.resetFields();
            setIsLoading(false);
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
            title: 'Blog Title',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Description',
            dataIndex: 'content',
            key: 'content',
        },
        {
            title: 'Author',
            dataIndex: 'userName',
            key: 'userName',
        },
        {
            title: 'Categories',
            dataIndex: 'categoryName',
            key: 'categoryName',
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
                    <Tag color="green">Blog Added</Tag>
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
                            form={csvBlogForm}
                            onFinish={handleOnSubmit}
                            encType="multipart/form-data"
                            style={{
                                padding: 10,
                                display: 'inline-block',
                                justifyContent: 'center',
                                width: 300,
                            }}
                        >
                            <Form.Item
                                label="Upload .csv file"
                                name="csvfile"
                                valuePropName="file"
                                rules={[{ required: true, message: 'Please Select a file' }]}
                            >
                                <Upload name="csvfile" maxCount={1} customRequest={dummyRequest}>
                                    <Button icon={<UploadOutlined />}>Click to upload</Button>
                                </Upload>
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit">Submit</Button>
                            </Form.Item>
                        </Form>
                    </div>
                    <Table columns={columns} dataSource={blogData} rowKey="_id" />
                </>
            )}
        </>
    )
}

export default BlogCsv;