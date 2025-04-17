import { Box, Container, Grid, Stack, Typography } from '@mui/material';
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
        sx={{ maxWidth: 1240, minHeight: 690, margin: 'auto', textAlign: 'center', display: 'flex', flexDirection: 'column', my: '170px' }}>
        <Typography variant='h2'>View Our Range Of Categories</Typography>
        <Typography variant='body1' sx={{ width: 'clamp(150px, 80vw, 609px)', margin: '12px auto 68px' }}>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam.</Typography>

        {/* Category Previews */}
        <Container
          sx={{
            display: 'flex', paddingLeft: { xs: '10px', sm: 0 }, paddingRight: { xs: '10px', sm: 0 }, justifyContent: 'center', margin: '0 auto',
            '& img': { width: '100%', transition: 'scale 200ms', objectFit: 'cover' },
            '& .MuiBox-root': { width: { sm: 'clamp(180px, 30vw, 300px)', xl: 392 }, overflow: 'hidden', borderRadius: '14px', position: 'relative', height: { xs: 180, sm: '100%' } },
            '& span': { position: 'absolute', bottom: 25, left: 19, fontSize: 22 },
            '& .MuiStack-root': { gap: { xs: '10px', lg: '32px' } },
            '& .MuiBox-root:hover img': { scale: 1.04, cursor: 'pointer' }
          }}>
          <Stack direction={{ xs: 'column', sm: 'row' }}
            justifyContent={'center'}
            sx={{ maxHeight: { xs: '100%', sm: 400, xl: 513 } }}>


            <Box sx={{
              '& > a > img': {
                height: { xs: 'auto', sm: '100%' }
              }
            }
            }>
              <Link to={`/items?category=${categories?.[0]?.category_name.replace(/ /g, '-')}`}>
                <img src={categories?.[0]?.image_path} alt="" />
                <Typography variant='body3'>{categories?.[0]?.category_name}</Typography>
              </Link>
            </Box>

            {/* Inner Stack: middle categories */}
            <Stack
              sx={{
                flexDirection: 'column',
                justifyContent: 'space-between',
                '& .MuiBox-root': { maxHeight: 240 },
                '& img': { height: { xs: '100%' } },
                '& img:first-of-type': { objectPosition: '0% 60%' }
              }}>
              <Box>
                <Link to={`/items?category=${categories?.[1]?.category_name.replace(/ /g, '-')}`}>
                  <img src={categories?.[1]?.image_path} alt="" />
                  <Typography variant='body3'>{categories?.[1]?.category_name}</Typography>
                </Link>
              </Box>
              <Box>
                <Link to={`/items?category=${categories?.[2]?.category_name.replace(/ /g, '-')}`}>
                  <img src={categories?.[2]?.image_path} alt="" />
                  <Typography variant='body3'>{categories?.[2]?.category_name}</Typography>
                </Link>
              </Box>
            </Stack>
            <Box sx={{
              '& > a > img': {
                objectPosition: { xs: 'initial' },
                height: '100%',
              }
            }}>
              <Link to={`/items?category=${categories?.[3]?.category_name.replace(/ /g, '-')}`}>
                <img src={categories?.[3]?.image_path} alt="" />
                <Typography variant='body3'>{categories?.[3]?.category_name}</Typography>
              </Link>
            </Box>
          </Stack>
        </Container>
      </Box >
    </Box>
  )
}

export default Home;