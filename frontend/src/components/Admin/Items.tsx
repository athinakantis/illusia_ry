import { ItemDataGrid } from '../ItemGrid/ItemDataGrid';
import { useEffect } from 'react';
import { fetchAllItems, selectAllItems } from '../../slices/itemsSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../config/supabase';

function Items() {
  
  const items = useAppSelector(selectAllItems);
  const dispatch = useAppDispatch();
    // Implement hook call to ensure User is Admin. If not, return.
    useEffect(() => {
      if (items.length < 1) {
        dispatch(fetchAllItems())
      }
    }, [dispatch, items])
async function checkUser() {
    const session = await supabase.auth.getSession();
    console.log(session.data.session?.access_token);

  console.log(session);
}
checkUser();
  //  if (!session) {
  //   return <div>Loading...</div>;
  // }
  return (
      <ItemDataGrid data={items} />
  );
}

export default Items;
