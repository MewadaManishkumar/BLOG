import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";
import authService from "../../services/auth-service";

const Page403 = () => {

    const navigate = useNavigate();
    const userRole = authService.getCurrentUser();
    const handleRoute = () => {
        (userRole.role === "user")? navigate("/login"): navigate("/");
    }
    return (<>
        <Result
            status="403"
            title="403"
            subTitle="Sorry, you are not authorized to access this page."
            extra={<Button type="primary" onClick={handleRoute}>Back Home</Button>}
        />
    </>);
}

export default Page403;