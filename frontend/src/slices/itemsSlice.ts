import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit';
import { Item, ItemState } from '../types/types';
import { CreateItemPayload, itemsApi } from '../api/items';
import { RootState } from '../store/store';
import { categoriesApi } from '../api/categories';
import { addTagToItem, removeTagFromItem, ItemTagRelationWithTagName } from './tagSlice';
import { tagsApi } from '../api/tags';

interface Category {
  category_id: string;
  category_name: string;
  image_path: string;
}

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

export const createCategory = createAsyncThunk(
  'items/createCategory',
  async (categoryData: { category_name: string; image_path?: string }) => {
    const response = await categoriesApi.createCategory(categoryData);
    return response;
  }
);

export const updateCategory = createAsyncThunk(
  'items/updateCategory',
  async ({ id, categoryData }: { id: string; categoryData: { category_name: string; image_path?: string } }) => {
    const response = await categoriesApi.updateCategory(id, categoryData);
    return response;
  }
);

export const deleteCategory = createAsyncThunk(
  'items/deleteCategory',
  async (id: string) => {
    const response = await categoriesApi.deleteCategory(id);
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
    /* ─── fetch all items ────────────────────────────────────────────── */
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

    // ─── fetch all items for admin ────────────────────────────────
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
    
    /* ─── fetch all categories ────────────────────────────────────────── */
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

    /*────────────────────────── create category ──────────────────────────*/
    builder.addCase(createCategory.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createCategory.fulfilled, (state, action) => {
      state.loading = false;
      const rows = action.payload?.data as Category[] | Category | undefined;
      if (!rows) return;
      const newCat = Array.isArray(rows) ? rows[0] : rows;
      state.categories.push(newCat);
    });
    builder.addCase(createCategory.rejected, (state) => {
      state.loading = false;
      state.error = 'Could not create category';
    });

    /*────────────────────────── update category ──────────────────────────*/
    builder.addCase(updateCategory.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateCategory.fulfilled, (state, action) => {
      state.loading = false;
      const rows = action.payload?.data as Category[] | Category | undefined;
      if (!rows) return;
      const updatedCat = Array.isArray(rows) ? rows[0] : rows;
      const idx = state.categories.findIndex(c => c.category_id === updatedCat.category_id);
      if (idx !== -1) {
        state.categories[idx] = updatedCat;
      }
    });
    builder.addCase(updateCategory.rejected, (state) => {
      state.loading = false;
      state.error = 'Could not update category';
    });

    /*────────────────────────── delete category ──────────────────────────*/
    builder.addCase(deleteCategory.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(deleteCategory.fulfilled, (state, action) => {
      state.loading = false;
      // ❶ Try to get the removed ID from the payload (if the backend returns it)
      let removedId: string | undefined;
      const rows = action.payload?.data as Category[] | Category | null | undefined;

      if (rows) {
        removedId = Array.isArray(rows)
          ? rows[0]?.category_id
          : (rows as Category | null)?.category_id;
      }

      // ❷ Fallback: use the ID we originally passed into deleteCategory(id)
      if (!removedId && action.meta?.arg) {
        removedId = action.meta.arg as string;
      }

      // ❸ Finally remove it from the slice
      if (removedId) {
        state.categories = state.categories.filter(
          (c) => c.category_id !== removedId
        );
      }
    });
    builder.addCase(deleteCategory.rejected, (state) => {
      state.loading = false;
      state.error = 'Could not delete category';
    });
    /* ─── fetch item by ID ────────────────────────────────────────────── */
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
    builder.addCase(fetchItemById.rejected, (state) => {
      state.loading = false
      state.error = 'Could not fetch item'
    })
    /* ─── create item ────────────────────────────────────────────── */
    builder.addCase(createItem.fulfilled, (state, action) => {
      state.items.push(action.payload.data);
    })
    builder.addCase(createItem.rejected, (state) => {
      state.error = 'Could not create item';
    })
    /* ─── delete item ────────────────────────────────────────────── */
    builder.addCase(deleteItem.fulfilled, (state, action) => {
      const deletedId = action.payload?.data?.item_id;
      if (deletedId) {
        state.items = state.items.filter(item => item.item_id !== deletedId);
      }
    })
    builder.addCase(deleteItem.rejected, (state) => {
      state.error = 'Could not delete item';
    })
    /* ─── update item ────────────────────────────────────────────── */
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
      const rel = action.payload as ItemTagRelationWithTagName; // { item_id, tag_id, created_at, tag_name }

      // keep the junction list (avoid duplicates)
      if (!state.item_tags.some(r => r.item_id === rel.item_id && r.tag_id === rel.tag_id)) {
        state.item_tags.push(rel);
      }

      // helper to push the tag into an item's tag_ids array and tags array
      const pushTag = (it?: Item) => {
        if (!it) return;
        
        // Update tag_ids array (existing logic)
        if (!Array.isArray(it.tag_ids)) it.tag_ids = [];
        if (!it.tag_ids.includes(rel.tag_id)) it.tag_ids.push(rel.tag_id);
        
        // Update tags array (new logic for the tags string array from the view)
        if (!Array.isArray(it.tags)) it.tags = [];
        if (!it.tags.includes(rel.tag_name)) it.tags.push(rel.tag_name);
      };

      pushTag(state.items.find(i => i.item_id === rel.item_id));
      if (state.item && state.item.item_id === rel.item_id) pushTag(state.item);
    });

    /* ---------- detach tag from item ---------- */
    builder.addCase(removeTagFromItem.fulfilled, (state, action) => {
      const rel = action.payload as ItemTagRelationWithTagName; // { item_id, tag_id, created_at, tag_name }

      // drop from junction cache
      state.item_tags = state.item_tags.filter(
        r => !(r.item_id === rel.item_id && r.tag_id === rel.tag_id)
      );

      const removeTag = (it?: Item) => {
        // Remove from tag_ids array (existing logic)
        if (it?.tag_ids) it.tag_ids = it.tag_ids.filter((id: string) => id !== rel.tag_id);
        
        // Remove from tags array (new logic for the tags string array from the view)
        if (it?.tags && Array.isArray(it.tags)) {
          it.tags = it.tags.filter((tagName: string) => tagName !== rel.tag_name);
        }
      };

      removeTag(state.items.find(i => i.item_id === rel.item_id));
      if (state.item && state.item.item_id === rel.item_id) removeTag(state.item);
    });

    /* ─── fetch all item–tag relations ────────────────────────────────── */
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

      // Create a mapping of tag_id to tag_name for updating tags arrays
      const tagIdToName: Record<string, string> = {};
      state.tags.forEach(tag => {
        tagIdToName[tag.tag_id] = tag.tag_name ?? '';
      });

      state.items.forEach((it) => {
        it.tag_ids = byItem[it.item_id] ?? [];
        
        // Update tags array based on tag_ids and the mapping
        if (it.tag_ids.length > 0) {
          it.tags = it.tag_ids
            .map(id => tagIdToName[id])
            .filter(name => name !== undefined); // Filter out any undefined names
        } else {
          it.tags = [];
        }
      });
      
      if (state.item) {
        state.item.tag_ids = byItem[state.item.item_id] ?? [];
        
        // Update tags array for the selected item
        if (state.item.tag_ids.length > 0) {
          state.item.tags = state.item.tag_ids
            .map(id => tagIdToName[id])
            .filter(name => name !== undefined);
        } else {
          state.item.tags = [];
        }
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
