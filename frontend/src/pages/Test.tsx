import { Button } from "@mui/material";
import { getAccessToken } from "../utility/getToken";

const TestPage = () => {
    

    const handleClick = async () => {
        getAccessToken()
    }

    return (
        <>
            <div>This is the test route</div>
            <Button onClick={handleClick}>
                Get Token
            </Button>
        </>
    )
}
export default TestPage;