import { Button } from "@mui/material";
import { getAccessToken } from "../utility/getToken";
import { useEffect, useState } from "react";
import { api } from "../api/axios";
import { accountApi } from "../api/account";
import { Input } from "postcss";

const TestPage = () => {
  const [name, setName] = useState("")

    return(
        <div>
          
          <input type="text" onChange={(e) => setName(e.target.value)} value={name} />
          <Button variant="contained" color="primary"
          onClick={async () => {
            try {
              await accountApi.updateName(name)
            } catch (error) {
              console.error("Error updating name:", error);
            }
          }}>
            Update Name
          </Button>
            <h1>Test Page</h1>
          <Button variant="contained" color="primary"
          onClick={getAccessToken}>
            Test Button
          </Button>
        </div>
    )
    }
export default TestPage;