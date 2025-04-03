import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchAllItems, selectAllItems } from '../slices/itemsSlice';
import { Item } from '../types/types';


function Items() {
  const items: Item[] = useAppSelector(selectAllItems)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (items.length < 1) {
      dispatch(fetchAllItems())
    }
    console.log('items: ', items)
  }, [dispatch, items])

  return (
    <>
      {items.map(item => (
        <p key={item.item_id}>{item.item_name}</p>
      )
      )}
    </>
  )
}

export default Items;