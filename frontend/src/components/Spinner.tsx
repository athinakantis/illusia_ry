import { Box } from '@mui/material';
import './pyramid-loader.css'

function Spinner() {
  return (
    <Box className='pyramid-loader'
      // Custom styling to always horizontally center spinner.
      sx={{ width: '100%', justifyContent: 'center', display: 'flex' }}>
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