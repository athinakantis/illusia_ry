import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Container, Stack, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchAllCategories, selectAllCategories } from '../slices/itemsSlice';
import { Link } from 'react-router-dom';
import { GridExpandMoreIcon } from '@mui/x-data-grid';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import { getAccessToken } from '../utility/getToken';


function Home() {
  const categories = useAppSelector(selectAllCategories)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (categories.length < 1) {
      dispatch(fetchAllCategories())
    }
  }, [dispatch, categories])


  // Categories to display
  const CATEGORIES_TO_DISPLAY = ['clothing', 'board games', 'props', 'accessories']
  const displayCategories = categories.filter(cat => {
    return CATEGORIES_TO_DISPLAY.includes(cat.category_name.toLowerCase())
  })


  return (
    <Box id='home'>
      <Button onClick={getAccessToken} variant='contained'>Get Access Token</Button>
      {/* Hero banner */}
      <Box component='section' id='hero-container'
        sx={{
          backgroundImage: 'url(/hero.png)', height: 779, backgroundRepeat: 'no-repeat', width: '100%',
          backgroundSize: 'cover', backgroundPosition: 'center'
        }}>
        <Box
          sx={{ width: 'clamp(150px, 85vw, 797px)', textAlign: 'center', height: '100%', display: 'flex', gap: '35px', margin: 'auto', justifyContent: 'center', flexDirection: 'column' }}>

          <Typography variant='h1'>Home for live-action role-playing games props</Typography>
          <Typography variant='body3' color='text.main'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla fringilla nunc in molestie feugiat. Nunc auctor consectetur elit, quis pulvina. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla fringilla nunc in molestie feugiat</Typography>
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
              <Link to={`/items?category=${displayCategories?.[0]?.category_name.replace(/ /g, '-')}`}>
                <img src={displayCategories?.[0]?.image_path} alt="" />
                <Typography variant='body3' color='text.main'>{displayCategories?.[0]?.category_name}</Typography>
              </Link>
            </Box>

            {/* Inner Stack: middle displayCategories */}
            <Stack
              sx={{
                flexDirection: 'column',
                justifyContent: 'space-between',
                '& .MuiBox-root': { maxHeight: 240 },
                '& img': { height: { xs: '100%' } },
                '& img:first-of-type': { objectPosition: '0% 60%' }
              }}>
              <Box>
                <Link to={`/items?category=${displayCategories?.[1]?.category_name.replace(/ /g, '-')}`}>
                  <img src={displayCategories?.[1]?.image_path} alt="" />
                  <Typography variant='body3' color='text.main'>{displayCategories?.[1]?.category_name}</Typography>
                </Link>
              </Box>
              <Box>
                <Link to={`/items?category=${displayCategories?.[3]?.category_name.replace(/ /g, '-')}`}>
                  <img src={displayCategories?.[3]?.image_path} alt="" />
                  <Typography variant='body3' color='text.main'>{displayCategories?.[3]?.category_name}</Typography>
                </Link>
              </Box>
            </Stack>
            <Box sx={{
              '& > a > img': {
                objectPosition: { xs: 'initial' },
                height: '100%',
              }
            }}>
              <Link to={`/items?category=${displayCategories?.[2]?.category_name.replace(/ /g, '-')}`}>
                <img src={displayCategories?.[2]?.image_path} alt="" />
                <Typography variant='body3' color='text.main'>{displayCategories?.[2]?.category_name}</Typography>
              </Link>
            </Box>
          </Stack>
        </Container>

        {/* FAQ Section */}
        <Container sx={{ maxWidth: 1264, pt: 15 }}>
          <Stack sx={{
            textAlign: 'start', flexDirection: { xs: 'column', sm: 'row' }, gap: '32px'
          }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', maxWidth: 521 }}>
              <Typography variant='h3'
                sx={{ fontWeight: 700, fontFamily: 'Oxygen, sans-serif', color: '#3D3D3D', mb: '14px' }}>Frequently Asked Questions</Typography>
              <Typography color='text.primary' variant='body3'>Before reaching out to us, see if you can find you're looking for in our FAQ</Typography>
              <Button variant='rounded' endIcon={<ArrowForwardIosRoundedIcon />}
                sx={{ mt: '32px' }}>Ask a question
              </Button>
            </Box>
            <Box sx={{
              maxWidth: 711,
              '& .MuiAccordion-root': { border: '1px solid #A6A6A6', borderRadius: '4px', mb: '20px', boxShadow: 'none' },
              '& .MuiAccordionDetails-root': { color: '#666666', fontSize: 16 },
              '& .MuiTypography-root': { fontSize: 20, fontWeight: 300, letterSpacing: '-2%' }
            }}>
              <Accordion>
                <AccordionSummary
                  expandIcon={<GridExpandMoreIcon />}
                  aria-controls="panel1-content"
                  id="panel1-header"
                >
                  <Typography component="span">When will my booking be approved?</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  We look through bookings as soon as we can. Bookings are usually approved within the span of 2-3 days. If you've waited longer than 5 days, send us an email
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary
                  expandIcon={<GridExpandMoreIcon />}
                  aria-controls="panel2-content"
                  id="panel2-header"
                >
                  <Typography component="span">How long can I book items for?</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  One booking can be a maximum duration of two weeks
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary
                  expandIcon={<GridExpandMoreIcon />}
                  aria-controls="panel3-content"
                  id="panel3-header"
                >
                  <Typography component="span">Why do I have to be approved before booking items?</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  We see the approval of our users as a guarantee that the items which have been lent will be returned after a maximum of 2 weeks.
                </AccordionDetails>
              </Accordion>
            </Box>
          </Stack>
        </Container>
      </Box >
    </Box>
  )
}

export default Home;