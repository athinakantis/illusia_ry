import { Box, Button } from "@mui/material";
import { getAccessToken } from "./utility/getToken";
import { useTranslation } from 'react-i18next';
// Can we keep this in for now and have it hidden or something?
// Every time i add a new endpoint I have to recreate this file and put it in the router.
const TestPage = () => {
  const { t } = useTranslation();

    return(
        <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 'calc(100vh - 3rem - 64px)',
            p: 3,
            pb: 12,
        }}>
       
          <Button variant="contained" color="primary"
          onClick={getAccessToken}>
            {t('button.test')}
          </Button>
        </Box>
    )
    }
export default TestPage;