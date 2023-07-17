import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";

const Page404 = () => {
    const navigate = useNavigate();

    const handleRoute = () => {
        navigate("/");
    }
    return (<>
        <Result
            status="404"
            title="404"
            subTitle="Sorry, the page you visited does not exist."
            extra={<Button type="primary" onClick={handleRoute}>Back Home</Button>}
        />
    </>);
}

export default Page404;