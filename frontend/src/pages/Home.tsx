import { Box, Grid, Stack, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchAllCategories, selectAllCategories } from '../slices/itemsSlice';
import { Link } from 'react-router-dom';


function Home() {
  const categories = useAppSelector(selectAllCategories)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (categories.length < 1) {
      dispatch(fetchAllCategories())
    }
  }, [dispatch, categories])

  return (
    <Box>

      {/* Hero banner */}
      <Box component='section' id='hero-container'
        sx={{
          backgroundImage: 'url(/hero.png)', height: 779, backgroundRepeat: 'no-repeat', width: '100%',
          backgroundSize: 'cover', backgroundPosition: 'center'
        }}>
        <Box
          sx={{ width: 'clamp(150px, 85vw, 797px)', textAlign: 'center', height: '100%', display: 'flex', gap: '35px', margin: 'auto', justifyContent: 'center', flexDirection: 'column' }}>

          <Typography variant='h1'>Home for live-action role-playing games props</Typography>
          <Typography variant='body3'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla fringilla nunc in molestie feugiat. Nunc auctor consectetur elit, quis pulvina. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla fringilla nunc in molestie feugiat</Typography>
        </Box>
      </Box>


      {/* Category section */}
      <Box component='section'
        sx={{ maxWidth: 1240, height: 690, margin: 'auto', textAlign: 'center', display: 'flex', flexDirection: 'column', my: '170px' }}>
        <Typography variant='h2'>View Our Range Of Categories</Typography>
        <Typography variant='body1' sx={{ width: 'clamp(150px, 80vw, 609px)', margin: '12px auto 68px' }}>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam.</Typography>

        {/* Category Previews */}
        <Grid container spacing={'32px'} columns={3} direction="row"
          sx={{
            height: 513,
            '& .MuiGrid-root': { position: 'relative', height: 513, width: 392, overflow: 'hidden' },
            '& .MuiStack-root a': { height: 240 },
            '& a': { textDecoration: 'none', borderRadius: '14px', position: 'relative', overflow: 'hidden' },
            '& img': { transition: 'scale 200ms' },
            '& img:hover': { scale: 1.03 },
            '& span': { left: 19, bottom: 25, position: 'absolute', fontSize: 22 }
          }}>
          <Link to='/'>
            <Grid size={{ xs: 12, md: 4 }}>
              <img src={categories?.[0]?.image_path} alt="" />
              <Typography variant='body3'>{categories?.[0]?.category_name}</Typography>
            </Grid>
          </Link>

          <Grid size={{ xs: 12, md: 4 }}>
            <Stack sx={{ gap: '32px' }}>
              <Link to='/'>
                <img src={categories?.[1]?.image_path} alt="" />
                <Typography variant='body3'>{categories?.[1]?.category_name}</Typography>
              </Link>

              <Link to='/'>
                <img src={categories?.[2]?.image_path} alt="" />
                <Typography variant='body3'>{categories?.[2]?.category_name}</Typography>
              </Link>
            </Stack>
          </Grid>

          <Link to='/'>
            <Grid size={{ xs: 12, md: 4 }}>
              <img src={categories?.[3]?.image_path} alt="" />
              <Typography variant='body3'>{categories?.[3]?.category_name}</Typography>
            </Grid>
          </Link>
        </Grid>
      </Box>
    </Box >
  )
}

export default Home;