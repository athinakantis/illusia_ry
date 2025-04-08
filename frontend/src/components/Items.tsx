import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchAllItems, selectAllItems } from '../slices/itemsSlice';
import { Button, Card, CardActions, CardContent, CardMedia, Box, Stack, Typography } from '@mui/material';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
function Items() {
  const items = useAppSelector(selectAllItems);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (items.length < 1) {
      dispatch(fetchAllItems());
    }
  }, [dispatch, items]);

  return (
    <>
      <Stack direction={'row'} flexWrap={'wrap'} gap={3} justifyContent={'center'}
        maxWidth={'95%'}
        justifySelf={'center'}
        padding={'none'}
        textAlign={'start'}>
        {items.map((item) => (

          <Card key={item.item_id}
            sx={{ width: 300, minHeight: 300, boxShadow: 'none' }}>
            <CardMedia
              sx={{ backgroundColor: 'lightgrey', height: '300px', borderRadius: '14px' }}
              src={item.image_path || 'https://placehold.co/200x200?text=hello+world'} />
            <CardContent sx={{ padding: '0.5rem 0', mb: '1rem', display: 'flex', justifyContent: 'space-between' }}>

              <Box sx={{ width: '80%', alignItems: 'center', display: 'flex' }}>
                <Typography variant='body1' sx={{ width: '70%' }}>{item.item_name}</Typography>
              </Box>

              <CardActions
                sx={{ padding: 0, justifySelf: 'end', width: 'fit-content' }}>
                <Button
                  sx={{ padding: '3px', minWidth: 'fit-content' }}>
                  <AddCircleOutlineOutlinedIcon />
                </Button>
              </CardActions>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </>
  );
}

export default Items;
