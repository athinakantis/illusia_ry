import { configureStore } from '@reduxjs/toolkit';
import itemsReducer, { deleteItem } from "./../slices/itemsSlice";
import { Item } from './../types/types';
import thunk from 'redux-thunk';
import * as itemsApi from './../api/items';
import { vi, Mock } from 'vitest';

vi.mock('./../api/items');

const mockItems: Item[] = [
  {
    item_id: '1',
    item_name: 'First Item',
    description: 'Desc',
    image_path: '',
    location: '',
    quantity: 10,
    category_id: '',
    created_at: new Date().toISOString(),
  },
  {
    item_id: '2',
    item_name: 'Second Item',
    description: 'Desc',
    image_path: '',
    location: '',
    quantity: 5,
    category_id: '',
    created_at: new Date().toISOString(),
  },
];

describe('itemsSlice deleteItem thunk', () => {
  it('should remove the deleted item from state on fulfilled', async () => {
    (itemsApi.itemsApi.deleteItem as Mock).mockResolvedValue({
      data: { item_id: '1' }, // Match your APIResponse shape
    });

    const store = configureStore({
        reducer: {
          items: itemsReducer,
        },
        middleware: (getDefaultMiddleware) => getDefaultMiddleware(), // ✅ no need to add thunk manually
        preloadedState: {
          items: {
            items: mockItems,
            loading: false,
            error: null,
          },
        },
      });
    await store.dispatch(deleteItem('1'));

    const state = store.getState().items;
    expect(state.items.length).toBe(1);
    expect(state.items[0].item_id).toBe('2');
  });
});