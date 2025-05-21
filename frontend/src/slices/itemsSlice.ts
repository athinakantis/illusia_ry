
import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit';
import { Item, ItemState } from '../types/types';
import { CreateItemPayload, itemsApi } from '../api/items';
import { RootState } from '../store/store';
import { categoriesApi } from '../api/categories';
import { addTagToItem, removeTagFromItem } from './tagSlice';
import { tagsApi } from '../api/tags';

const initialState: ItemState = {
  items: [],
  item: null,
  loading: false,
  tags: [],
  item_tags: [],
  error: null,
  categories: []
}

export const fetchAllItems = createAsyncThunk(
  'items/fetchAllItems',
  async () => {
    const response = await itemsApi.getAllItems();
    return response;
  }
);
export const fetchAllItemsAdmin = createAsyncThunk(
  'items/fetchAllItemsAdmin',
  async () => {
    const response = await itemsApi.getAllItemsAdmin();
    return response;
  }
);

export const fetchAllCategories = createAsyncThunk(
  'items/fetchAllCategories',
  async () => {
    const response = await categoriesApi.getAllCategories();
    return response;
  }
);

// fetch every row of the item_tags junction once (startup / admin page)
export const fetchAllItemTags = createAsyncThunk(
  'items/fetchAllItemTags',
  async () => {
    const response = await tagsApi.getAllItemTags();
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

export const updateItemVisibility = createAsyncThunk(
  'items/updateItemVisibility',
  async ({ id, visible }: { id: string; visible: boolean }) => {
    const response = await itemsApi.updateItem(id, { visible });
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
      state.items = action.payload.data;
      //state.loading = false
    })
    builder.addCase(fetchAllItems.rejected, (state) => {
      state.loading = false
      state.error = 'Could not fetch items'
    })
    builder.addCase(fetchAllItemsAdmin.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchAllItemsAdmin.fulfilled, (state, action) => {
      state.items = action.payload.data;
      state.loading = false;
    });
    builder.addCase(fetchAllItemsAdmin.rejected, (state) => {
      state.error = 'Could not fetch admin items';
      state.loading = false;
    });
    builder.addCase(fetchAllCategories.pending, (state) => {
      state.loading = true
    })
    builder.addCase(fetchAllCategories.fulfilled, (state, action) => {
      state.loading = false
      state.categories = action.payload.data
    })
    builder.addCase(fetchAllCategories.rejected, (state) => {
      state.error = 'Could not fetch items'
      state.loading = false
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
    // ─── toggle visibility ─────────────────────────────────────────────
    builder.addCase(updateItemVisibility.fulfilled, (state, action) => {
      const updatedItem = action.payload?.data;
      if (updatedItem) {
        const idx = state.items.findIndex((it) => it.item_id === updatedItem.item_id);
        if (idx !== -1) state.items[idx] = updatedItem;
        if (state.item && state.item.item_id === updatedItem.item_id) {
          state.item = updatedItem;
        }
      }
    });

    /* ---------- attach tag to item ---------- */
    builder.addCase(addTagToItem.fulfilled, (state, action) => {
      const rel = action.payload; // { item_id, tag_id, created_at }

      // keep the junction list (avoid duplicates)
      if (!state.item_tags.some(r => r.item_id === rel.item_id && r.tag_id === rel.tag_id)) {
        state.item_tags.push(rel);
      }

      // helper to push the tag into an item's tag_ids array
      const pushTag = (it?: any) => {
        if (!it) return;
        if (!Array.isArray(it.tag_ids)) it.tag_ids = [];
        if (!it.tag_ids.includes(rel.tag_id)) it.tag_ids.push(rel.tag_id);
      };

      pushTag(state.items.find(i => i.item_id === rel.item_id));
      if (state.item && state.item.item_id === rel.item_id) pushTag(state.item);
    });

    /* ---------- detach tag from item ---------- */
    builder.addCase(removeTagFromItem.fulfilled, (state, action) => {
      const rel = action.payload; // { item_id, tag_id, created_at }

      // drop from junction cache
      state.item_tags = state.item_tags.filter(
        r => !(r.item_id === rel.item_id && r.tag_id === rel.tag_id)
      );

      const removeTag = (it?: any) => {
        if (it?.tag_ids) it.tag_ids = it.tag_ids.filter((id: string) => id !== rel.tag_id);
      };

      removeTag(state.items.find(i => i.item_id === rel.item_id));
      if (state.item && state.item.item_id === rel.item_id) removeTag(state.item);
    });

    /* ---------- fetch all item_tags ---------- */
    builder.addCase(fetchAllItemTags.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchAllItemTags.fulfilled, (state, action) => {
      state.loading = false;
      state.item_tags = action.payload.data ?? [];

      // also propagate tag_ids onto each cached item
      const byItem: Record<string, string[]> = {};
      state.item_tags.forEach(r => {
        if (!byItem[r.item_id]) byItem[r.item_id] = [];
        byItem[r.item_id].push(r.tag_id);
      });

      state.items.forEach((it: any) => {
        it.tag_ids = byItem[it.item_id] ?? [];
      });
      if (state.item) {
        state.item.tag_ids = byItem[state.item.item_id] ?? [];
      }
    });
    builder.addCase(fetchAllItemTags.rejected, (state) => {
      state.loading = false;
      state.error = 'Could not fetch item–tag relations';
    });
  }
})

export const selectAllCategories = (state: RootState) => state.items.categories


export const selectAllItems = (state: RootState) => {
  return state.items.items;
}
export const selectVisibleItems = createSelector(
  selectAllItems,
  (items) => items.filter((i) => i.visible),
);

export const selectItemsLoading = (state: RootState) => state.items.loading

export const selectItemById = (id: string) => (state: RootState) => {
  return state.items.items.find((item) => item.item_id === id);
}

export const selectTagIdsForItem = (id: string) => (state: RootState) =>
  state.items.item_tags
    .filter(r => r.item_id === id)
    .map(r => r.tag_id);

export default itemsSlice.reducer;
