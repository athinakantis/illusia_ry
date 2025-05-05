import { Button } from "@mui/material";
import { getAccessToken } from "../utility/getToken";

const TestPage = () => {
    return(
        <div>
            <h1>Test Page</h1>
          <Button variant="contained" color="primary"
          onClick={getAccessToken}>
            Test Button
          </Button>
        </div>
    )
    }
export default TestPage;