import UserItems from '../components/Items';
import { Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';



function Items() {
  const navigate = useNavigate();

  return (
    <Box sx={{ padding: 2 }}>
      {/* Button Container */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          paddingBottom: '32px',
          maxWidth: '95%', // Match the Stack's width
          margin: '0 auto', // Center the container horizontally
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/items/new')}
        >
          Add New Item
        </Button>
      </Box>

      {/* Items Component */}
      <UserItems />
    </Box>
  );
}

export default Items;