import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchAllItems, selectAllItems } from '../slices/itemsSlice';
import { Item } from '../types/types';
import { itemsApi } from '../api/items';


function Items() {
  const items: Item[] = useAppSelector(selectAllItems)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (items.length < 1) {
      dispatch(fetchAllItems())
    }
  }, [dispatch, items])

  useEffect(() => {
    const itemToAdd: Partial<Item> = {
      item_name: 'Playstation 4',
      location: 'Shelf 16',
      quantity: 2,
      category_id: 'd1a0db85-8e03-4ba1-9ba8-5780d76e8c6d'
    }

    itemsApi.createItem(itemToAdd)
  }, [])

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