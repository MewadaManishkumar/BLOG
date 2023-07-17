import './App.css';
import { BrowserRouter, Routes, Route, Link, Navigate, Outlet } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import LoginForm from './components/Login/LoginForm';
import BlogList from './components/Blog/BlogList';
import BlogForm from './components/Blog/BlogForm';
import BlogDetail from './components/Blog/BlogDetail';
import Category from './components/Category/Category';
import CategoryForm from './components/Category/CategoryForm';
import Author from './components/Author/Author';
import AuthorForm from './components/Author/AuthorForm';
import Admin from './components/Admin/Admin';
import AdminForm from './components/Admin/AdminForm';
import User from './components/User/Users';
import UserForm from './components/User/UserForm';
import Page403 from './components/Pages/Page403';
import Page404 from './components/Pages/Page404';

import AuthService from './services/auth-service';
import { LogoutOutlined } from '@ant-design/icons';
import { useEffect } from 'react';
import CsvUpload from './components/CsvUploader/CsvUpload';
import CategoryCsv from './components/CsvUploader/CategoryCsv';
import BlogCsv from './components/CsvUploader/BlogCsv';

const { Header, Content, Footer } = Layout;

const Navbar = [{
  "name": "Blogs",
  "link": "/",
  "roles": ["masterAdmin", "admin", "author"]
},
{
  "name": "Category",
  "link": "/categories",
  "roles": ["masterAdmin", "admin"]
},
{
  "name": "Author",
  "link": "/authors",
  "roles": ["masterAdmin", "admin"]
},
{
  "name": "Admin",
  "link": "/admins",
  "roles": ["masterAdmin"]
},
{
  "name": "User",
  "link": "/users",
  "roles": ["masterAdmin", "admin"]
},
{
  "name": "Logout",
  "link": "/login",
  "roles": ["masterAdmin", "admin", "author"]
}]

export default function App() {

  const Auth = ({ allowedRoles }) => {
    const token = localStorage.getItem('accessToken');
    const userRole = AuthService.getCurrentUser();

    useEffect(() => {
      if (token) {
        const refreshToken = async () => {
          try {
            const response = await AuthService.refreshToken();
            localStorage.setItem('accessToken', response.accessToken);

            const existingData = JSON.parse(localStorage.getItem('user')); //existing accessToken in the user object
            existingData.accessToken = response.accessToken;
            localStorage.setItem('user', JSON.stringify(existingData)); //updating the accessToken in user object
          } catch (error) {
            console.error(error);
          }
        }

        const intervalId = setInterval(refreshToken, 300000);

        return () => {
          clearInterval(intervalId);
        };
      }
    }, [token]);


    const items = Navbar?.map((item, index) => {
      if (token && item.roles.includes(userRole?.role)) {
        const key = index + 1;
        return (item.name !== "Logout") ? {
          key,
          label: <Link to={item.link}>{item.name}</Link>
        } : {
          key,
          label: <Link to={item.link}>{item.name}</Link>,
          icon: <LogoutOutlined />,
          onClick: AuthService.logout
        }
      } else {
        return null;
      }
    }
    )
    return token && allowedRoles?.find((role) => userRole?.role?.includes(role)) ? (
      <>
        <Header>
          {userRole?.role && <div className="logo"> {userRole?.role?.toUpperCase()} DASHBOARD</div>}
          <Menu theme="dark" mode="horizontal" items={items} />
        </Header>
        <Outlet />
      </>
    ) : (userRole?.name) ? (
      <Navigate to="/unauthorized" replace />
    ) : (
      <Navigate to="/login" replace />
    );
  };


  return (
    <div className='App'>
      <BrowserRouter>
        <Layout>
          <Content style={{ padding: '0 50px' }} className="site-layout">
            <Routes>
              <Route exact path="/login" element={<LoginForm />} />
              <Route element={<Auth allowedRoles={["masterAdmin", "admin", "author"]} />}>
                <Route exact path="/" element={<BlogList />} />
              </Route>
              <Route element={<Auth allowedRoles={["masterAdmin", "admin","author"]} />}>
                <Route exact path="/blogcsv" element={<BlogCsv />} />
              </Route>
              <Route element={<Auth allowedRoles={["masterAdmin", "admin", "author"]} />}>
                <Route exact path="/blogs/create" element={<BlogForm />} />
              </Route>
              <Route element={<Auth allowedRoles={["masterAdmin", "admin", "author"]} />}>
                <Route exact path="/blogs/list/:_id" element={<BlogDetail />} />
              </Route>
              <Route element={<Auth allowedRoles={["masterAdmin", "admin", "author"]} />}>
                <Route exact path="/blogs/update/:_id" element={<BlogForm />} />
              </Route>
              <Route element={<Auth allowedRoles={["masterAdmin", "admin"]} />}>
                <Route exact path="/categories" element={<Category />} />
              </Route>
              <Route element={<Auth allowedRoles={["masterAdmin", "admin"]} />}>
                <Route exact path="/categorycsv" element={<CategoryCsv />} />
              </Route>
              <Route element={<Auth allowedRoles={["masterAdmin", "admin"]} />}>
                <Route exact path="/categories/create" element={<CategoryForm />} />
              </Route>
              <Route element={<Auth allowedRoles={["masterAdmin", "admin"]} />}>
                <Route exact path="/categories/update/:_id" element={<CategoryForm />} />
              </Route>
              <Route element={<Auth allowedRoles={["masterAdmin", "admin"]} />}>
                <Route exact path="/authors" element={<Author />} />
              </Route>
              <Route element={<Auth allowedRoles={["masterAdmin", "admin"]} />}>
                <Route exact path="/authors/create" element={<AuthorForm />} />
              </Route>
              <Route element={<Auth allowedRoles={["masterAdmin", "admin"]} />}>
                <Route exact path="/csvUpload/:role" element={<CsvUpload />} />
              </Route>
              <Route element={<Auth allowedRoles={["masterAdmin", "admin"]} />}>
                <Route exact path="/authors/update/:_id" element={<AuthorForm />} />
              </Route>
              <Route element={<Auth allowedRoles={["masterAdmin"]} />}>
                <Route exact path="/admins" element={<Admin />} />
              </Route>
              <Route element={<Auth allowedRoles={["masterAdmin"]} />}>
                <Route exact path="/admins/create" element={<AdminForm />} />
              </Route>
              <Route element={<Auth allowedRoles={["masterAdmin"]} />}>
                <Route exact path="/admins/update/:_id" element={<AdminForm />} />
              </Route>
              <Route element={<Auth allowedRoles={["masterAdmin", "admin"]} />}>
                <Route exact path="/users" element={<User />} />
              </Route>
              <Route element={<Auth allowedRoles={["masterAdmin", "admin"]} />}>
                <Route exact path="/users/create" element={<UserForm />} />
              </Route>
              <Route element={<Auth allowedRoles={["masterAdmin", "admin"]} />}>
                <Route exact path="/csvUpload/:role" element={<CsvUpload />} />
              </Route>
              <Route element={<Auth allowedRoles={["masterAdmin", "admin"]} />}>
                <Route exact path="/users/update/:_id" element={<UserForm />} />
              </Route>
              <Route path='/unauthorized' element={<Page403 />} />
              <Route path='*' element={<Page404 />} />
            </Routes>
          </Content>
          <Footer style={{ textAlign: 'center' }}>Admin Panel ©2023 Created by Me</Footer>
        </Layout>
      </BrowserRouter>
    </div>
  )
}