import { Pagination as MUIPagination, Stack } from '@mui/material';
import { Dispatch, SetStateAction, useState } from 'react';
import { Item } from '../types/types';


function Pagination({ items, setOffset, pageItems = 8 }: {
  items: Item[],
  pageItems?: number,
  setOffset: Dispatch<SetStateAction<number>>
}) {
  const [page, setPage] = useState(1);

  const handleChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value)
    setOffset((value - 1) * pageItems)
  }

  return (
    <Stack spacing={2}>
      <MUIPagination
        count={Math.ceil(items.length / pageItems)}
        shape="rounded"
        page={page}
        onChange={handleChange}
      />
    </Stack>
  );
}

export default Pagination;
