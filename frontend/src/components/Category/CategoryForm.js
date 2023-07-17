import { Button, Form, Input, message } from "antd";
import axios from "axios";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const CategoryForm = () => {
    const { _id } = useParams();
    const navigate = useNavigate();
    const [form] = Form.useForm();

    //Get Api call for selected category data
    useEffect(() => {
        const getCategory = async () => {
            const response = await axios.get(`http://localhost:5000/categories/list/${_id}`);
            form.setFieldsValue({
                category: response.data.name
            });
        }
        if (_id) {
            getCategory();
        }
    }, [form, _id]);

    //post api call for create a new category
    const createCategory = async (values) => {
        try {
            await axios.post('http://localhost:5000/categories/create', values);
            navigate('/categories')
            message.success('Category created successfully');
        } catch (error) {
            message.error(error.response.data.message)
        }
    }

    //put api call for update a blog
    const updateCategory = async (values) => {
        try {
            await axios.put(`http://localhost:5000/categories/update/${_id}`, values);
            navigate('/categories')
            message.success('Category updated successfully');
        } catch (error) {
            message.error("This category is already exist!")
        }
    }
    return (
        <>
            {_id ? <h1>Update Category</h1> : <h1>Add New Category</h1>}
            <Form
                layout="vertical"
                form={form}
                onFinish={_id ? updateCategory : createCategory}
                style={{
                    padding: 10,
                    display: 'inline-block',
                    justifyContent: 'center',
                    width: 300,
                }}
                autoComplete="off"
            >
                <Form.Item
                    label="Category Name"
                    name="category"
                    rules={[
                        {
                            required: true,
                            message: 'Please input category name!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item>
                    {_id ? <Button type="primary" htmlType="submit">
                        Update Category
                    </Button> : <Button type="primary" htmlType="submit">
                        Add Category
                    </Button>}
                </Form.Item>
            </Form>
        </>
    );
}

export default CategoryForm;