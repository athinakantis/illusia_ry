import UserItems from '../components/Items';
import { Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';



function Items() {
  const navigate = useNavigate();

  return (
    <Box sx={{ padding: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/items/new')}
        >
          Add New Item
        </Button>
      </Box>
      <UserItems />
    </Box>
  )
}

export default Items;