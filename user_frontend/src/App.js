import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import React, { useEffect, useState } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";

import AuthService from "./services/auth.service";

import Login from "./components/Login/LoginPage";
import SignupPage from "./components/Signup/SignupPage";
import Profile from "./components/Profile/Profile";
import BlogDetail from "./components/Blog/BlogDetail";
import BlogList from "./components/Blog/BlogList";
import UpdateProfile from "./components/Profile/UpdateProfile";

const App = () => {
    const [userData, setUserData] = useState();
    const location = useLocation();
    const user = AuthService.getCurrentUser();
    const token = localStorage.getItem('accessToken');
    
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

    useEffect(() => {
        if (!userData) {
            (user) ? setUserData(user) : setUserData(undefined)
        }
    }, [location, user, userData])

    return (
        <>
            {(userData) ?
                <nav className="navbar navbar-expand navbar-dark bg-dark">
                    <Link to={"/"} className="navbar-brand">
                        My Blogs
                    </Link>
                    <div className="navbar-nav ml-auto">
                        <li className="nav-item">
                            <Link to={`/users/list/${userData._id}`} className="nav-link">
                                {userData?.name}
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to={"/endUser/login"} className="nav-link" onClick={AuthService.logout}>
                                Logout
                            </Link>
                        </li>
                    </div>
                </nav> :
                <nav className="navbar navbar-expand navbar-dark bg-dark">
                    <Link to={"/"} className="navbar-brand">
                        My Blogs
                    </Link>

                    <div className="navbar-nav ml-auto">
                        <li className="nav-item">
                            <Link to={"/endUser/login"} className="nav-link">
                                Login
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link to={"/register"} className="nav-link">
                                Sign Up
                            </Link>
                        </li>
                    </div>
                </nav>}
            <div className="container mt-3">
                <Routes>
                    <Route path="/" element={<BlogList />} />
                    <Route path="/endUser/login" element={<Login />} />
                    <Route path="/register" element={<SignupPage />} />
                    <Route path="/blogs/list/:_id" element={<BlogDetail />} />
                    <Route path="/users/list/:_id" element={<Profile />} />
                    <Route path="/users/update/:_id" element={<UpdateProfile />} />
                </Routes>
            </div>

        </>
    );
}

export default App;