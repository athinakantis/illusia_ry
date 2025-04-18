import { Box } from '@mui/material';

function Spinner() {
  return (
    <Box className='pyramid-loader'>
      <Box className='wrapper'>
        <Box className='side side1'></Box>
        <Box className='side side2'></Box>
        <Box className='side side3'></Box>
        <Box className='side side4'></Box>
        <Box className='shadow'></Box>
      </Box>
    </Box>
  )
}

export default Spinner;