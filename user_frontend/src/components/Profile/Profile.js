import { Avatar, Button, Form, Input, Typography } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const Profile = () => {
    const { _id } = useParams();
    const [user, setUser] = useState([]);

    useEffect(() => {
        const getSelectedUsers = async () => {
            const response = await axios.get(`http://localhost:5000/users/list/${_id}`);
            setUser(response.data);
        }
        getSelectedUsers();
    }, [_id]);

    let initials = '';
    const nameArray = (user?.name)?.split(" ");
    nameArray?.forEach(name => {
        initials += name?.charAt(0);
    });

    return (
        <div className="container">
            <div>
                <header className="jumbotron">
                    <h3>
                        <strong>{user.name}'s</strong> Profile
                    </h3>
                    <Avatar size={100} src={`https://via.placeholder.com/150x150.png?text=${initials}`} alt="profile" />
                </header>
                <Form>
                    <div>
                        <div className="form-group">
                            <Typography.Title level={5} htmlFor="username">Name</Typography.Title>
                            <Input
                                type="text"
                                className="form-control"
                                name="name"
                                value={user.name}
                            />
                        </div>
                        <div className="form-group">
                            <Typography.Title level={5} htmlFor="email">Email</Typography.Title>
                            <Input
                                type="text"
                                className="form-control"
                                name="email"
                                value={user.email}
                            />
                        </div>

                        <div className="form-group">
                            <Typography.Title level={5} htmlFor="password">Password</Typography.Title>
                            <Input
                                type="password"
                                className="form-control"
                                name="password"
                                value={user.password}
                            />
                        </div>

                        <div className="form-group">
                            <Typography.Title level={5} htmlFor="password">Role</Typography.Title>
                            <Input
                                type="text"
                                className="form-control"
                                name="role"
                                value={user.role}
                            />
                        </div>

                        <div className="form-group">
                            <Link to={`/users/update/${_id}`} style={{ padding: 10 }}>
                                <Button type="primary" className="btn btn-primary btn-block">Edit Profile</Button>
                            </Link>
                        </div>
                    </div>
                </Form>
            </div>
        </div>
    );
}

export default Profile;