import { Box, Card, CardContent, CardMedia, Stack, Typography } from '@mui/material';
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
      <Box component='section' id='hero-container'
        sx={{
          backgroundImage: 'url(/hero.png)', height: 779, backgroundRepeat: 'no-repeat', width: '100%',
          backgroundSize: 'cover', backgroundPosition: 'center'
        }}>
        <Box
          sx={{ width: 797, textAlign: 'center', height: '100%', display: 'flex', gap: '35px', margin: 'auto', justifyContent: 'center', flexDirection: 'column' }}>

          <Typography variant='h1'
            sx={{ color: '#FFF' }}>Home for live-action role-playing games props</Typography>
          <Typography variant='body1' sx={{ color: '#FFF' }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla fringilla nunc in molestie feugiat. Nunc auctor consectetur elit, quis pulvina. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla fringilla nunc in molestie feugiat</Typography>
        </Box>
      </Box>
      <Box component='section'
        sx={{ maxWidth: 1240, height: 690, margin: 'auto', textAlign: 'center', display: 'flex', flexDirection: 'column', my: '170px' }}>
        <Typography variant='h2'>View Our Range Of Categories</Typography>
        <Typography variant='body1' sx={{ width: 609, margin: '12px auto 68px' }}>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam.</Typography>

        <Stack direction='row' spacing={2} sx={{
          width: '100%', px: 2, flexWrap: 'wrap',
          '& .MuiCard-root:not(.css-2359du)': { borderRadius: '14px', backgroundSize: 'cover', position: 'relative' },
          '& p': { justifySelf: 'start', color: '#FFF', fontSize: 22, fontWeight: 300 },
          '& a': { textDecoration: 'none' },
          '& .MuiCardMedia-root': { display: 'flex', alignItems: 'end', transition: 'scale 200ms' },
          '& a:hover .MuiCardMedia-root': { scale: 1.03 },
          '& .MuiCardContent-root': { position: 'absolute', bottom: '25px', left: '19px', p: 0 }
        }}>
          <Link to='/'>
            <Card>
              <CardMedia component='image' image={categories?.[0]?.image_path}
                sx={{ backgroundImage: `url(${categories?.[0]?.image_path})`, height: 513, width: 392, flexShrink: 1 }}>
              </CardMedia>
              <CardContent>
                <Typography variant='body1'>{categories?.[0]?.category_name}</Typography>
              </CardContent>
            </Card>
          </Link>
          <Box sx={{ height: 513, width: 392, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minWidth: 300 }}>
            <Link to='/'>
              <Card>
                <CardMedia component='image' image={categories?.[1]?.image_path} sx={{ height: 240 }}>
                </CardMedia>
                <CardContent>
                  <Typography variant='body1'>{categories?.[1]?.category_name}</Typography>
                </CardContent>
              </Card>
            </Link>
            <Link to='/'>

              <Card>
                <CardMedia component='image' image={categories?.[2]?.image_path} sx={{ height: 240 }}>
                </CardMedia>
                <CardContent>
                  <Typography variant='body1'>{categories?.[2]?.category_name}</Typography>
                </CardContent>
              </Card>
            </Link>
          </Box>
          <Link to='/'>
            <Card>
              <CardMedia component='image' image={categories?.[3]?.image_path} sx={{ height: 513, width: 392, minWidth: 300, flexShrink: 1 }}>
              </CardMedia>
              <CardContent>
                <Typography variant='body1'>{categories?.[3]?.category_name}</Typography>
              </CardContent>
            </Card>
          </Link>
        </Stack>
      </Box>
    </Box>
  )
}

export default Home;