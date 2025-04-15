import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Item, ItemState } from '../types/types';
import { CreateItemPayload, itemsApi } from '../api/items';
import { RootState } from '../store/store';


const initialState: ItemState = {
  items: [],
  item: null,
  loading: false,
  error: null
}

export const fetchAllItems = createAsyncThunk(
  'items/fetchAllItems',
  async () => {
    const response = await itemsApi.getAllItems();
    return response;
  }
);


export const fetchItemById = createAsyncThunk(
  'items/fetchItemById',
  async (id: string) => {
    const response = await itemsApi.getItembyId(id);
    return response;
  }
);

// Async thunk for creating a new item
export const createItem = createAsyncThunk(
  'items/createItem',
  async (newItemData: CreateItemPayload) => {
    const response = await itemsApi.createItem(newItemData);
    return response;
  }
);
export const deleteItem = createAsyncThunk(
  'items/deleteItem',
  async (id: string) => {
    const response = await itemsApi.deleteItem(id);
    return response;
  }
);

export const updateItem = createAsyncThunk(
  'items/updateItem',
  async ({ id, updatedData }: { id: string; updatedData: Item }) => {
    const response = await itemsApi.updateItem(id, updatedData);
    return response;
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
      state.items = action.payload.data;
    })
    builder.addCase(fetchAllItems.rejected, (state) => {
      state.loading = false
      state.error = 'Could not fetch items'
    })
    builder.addCase(fetchItemById.pending, (state) => {
      state.loading = true
    })
    builder.addCase(fetchItemById.fulfilled, (state, action) => {
      state.loading = false;
      const fetchedItem = action.payload.data;
      state.item = fetchedItem;
      const exists = state.items.some(item => item.item_id === fetchedItem.item_id);
      if (!exists) {
        state.items.push(fetchedItem);
      }
    })
    builder.addCase(createItem.fulfilled, (state, action) => {

      state.items.push(action.payload.data);
    })
    builder.addCase(deleteItem.fulfilled, (state, action) => {
      const deletedId = action.payload?.data?.item_id;
      if (deletedId) {
        state.items = state.items.filter(item => item.item_id !== deletedId);
      }
    })
    builder.addCase(updateItem.fulfilled, (state, action) => {
      const updatedItem = action.payload?.data;
      if (updatedItem) {
        const index = state.items.findIndex(item => item.item_id === updatedItem.item_id);
        if (index !== -1) {
          state.items[index] = updatedItem;
        }
      }
    })
  }
})

export const selectAllItems = (state: RootState) => {
  return state.items.items;
}

export const selectItemById = (id: string) => (state: RootState) => {
  return state.items.items.find((item) => item.item_id === id);
}

export default itemsSlice.reducer;