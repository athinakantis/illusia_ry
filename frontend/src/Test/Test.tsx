import { Button } from "@mui/material";
import { getAccessToken } from "../utility/getToken";

const TestPage = () => {
    

    const handleClick = async () => {
        getAccessToken()
    }

    return (
        <>
            <div>This is a route I need for getting a token to give to Postman</div>
            <Button onClick={handleClick}>
                Get Token
            </Button>
        </>
    )
}
export default TestPage;