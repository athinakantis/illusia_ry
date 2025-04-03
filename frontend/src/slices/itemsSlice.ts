import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ItemState } from '../types/types';
import { itemsApi } from '../api/items';
import { RootState } from '../store/store';

const initialState: ItemState = {
  items: [],
  loading: false,
  error: null
}

export const fetchAllItems = createAsyncThunk(
  'items/fetchAllItems',
  async () => {
    const response = await itemsApi.getAllItems();
    return response.data;
  }
);


export const itemsSlice = createSlice({
  name: 'items',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAllItems.pending, (state) => {
      state.loading = true
    })
    builder.addCase(fetchAllItems.fulfilled, (state, action) => {
      state.loading = false
      state.items = action.payload;
    })
    builder.addCase(fetchAllItems.rejected, (state) => {
      state.loading = false
      state.error = 'Could not fetch items'
    })
  }
})

export const selectAllItems = (state: RootState) =>
  state.items.items;
export default itemsSlice.reducer;