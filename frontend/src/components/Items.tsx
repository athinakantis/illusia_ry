import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchAllItems, selectAllItems } from '../slices/itemsSlice';


function Items() {
  const items = useAppSelector(selectAllItems)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (items.length < 1) {
      dispatch(fetchAllItems())
    }
  }, [dispatch, items])

  return (
    <>
      {items.map(item => (
        <p>{item.item_name}</p>
      )
      )}
    </>
  )
}

export default Items;