import "./LoginForm.css"
import axios from 'axios'
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { Button, Form, Input, Typography, message } from 'antd';
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  //function for form submit
  const onLogin = async (values) => {
    try {
      const response = await axios.post('http://localhost:5000/login', values);
      if (response.status === 200) {
        localStorage.setItem('accessToken', `Bearer ${response.data.accessToken}`);
        localStorage.setItem('refreshToken', `Bearer ${response.data.refreshToken}`);
        localStorage.setItem('user', JSON.stringify(response.data));
        navigate('/');
        message.success('You are logged in successfully');
      }
    } catch (error) {
      if(error.response.status === 400){
      message.error(error.response.data.msg);
      }
      else if(error.response.status === 401){
        message.error('Access denied!');
      }
      else if(error.response.status === 403){
        message.error('You are not authorized for login');
      }
    }
  }

  return (
    <>
      <Form
        layout="vertical"
        form={form}
        className="login-form"
        onFinish={onLogin}
      >
        <Typography.Title level={3}>Login Form</Typography.Title>
        <Form.Item
          name="email"
          rules={[
            {
              required: true,
              message: 'Please input your email!',
            },
          ]}
        >
          <Input prefix={<MailOutlined className="site-form-item-icon" />} placeholder="Email" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: 'Please input your Password!',
            },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="login-form-button">
            LOGIN
          </Button>
        </Form.Item>
      </Form>
    </>
  )
}

export default LoginForm;
